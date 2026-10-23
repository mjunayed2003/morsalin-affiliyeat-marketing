import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@WebSocketGateway({
  cors: {
    origin: (origin: any, callback: any) => {
      // Dynamic origin reflection safely supports withCredentials across localhost and remote hosts
      callback(null, origin || true);
    },
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  // Track last message timestamp per customer to enforce 5-hour auto-reply rule
  private readonly lastCustomerMessageTimes = new Map<string, number>();

  // Active audio call sessions map
  private readonly activeAudioCalls = new Map<
    string,
    {
      callId: string;
      callerId: string;
      callerName: string;
      callerRole: 'admin' | 'customer';
      callerSocketId: string;
      targetUserId?: string;
      receiverSocketId?: string;
      sdp?: any;
      startTime?: number;
      timeoutTimer?: NodeJS.Timeout;
      status: 'calling' | 'connecting' | 'connected' | 'rejected' | 'ended';
    }
  >();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`⚡ Client connected via Socket.IO: ${client.id}`);
    try {
      const user = await this.resolveSocketUser(client);
      if (user) {
        if (user.role?.toUpperCase() === 'ADMIN') {
          client.join('admin_room');
          this.logger.log(`🛡️ Admin auto-joined admin_room: ${user.name || user.id}`);
        }
        client.join(`room_${user.id}`);
        this.logger.log(`🔒 User auto-joined room_${user.id}`);

        const unreadCount = await this.notificationsService.getUnreadCount(user.id);
        client.emit('notification:unread-count', { count: unreadCount, unreadCount });
      }
    } catch {}
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Client disconnected from Socket.IO: ${client.id}`);

    // Clean up any ongoing audio call involving this disconnecting socket
    for (const [callId, call] of this.activeAudioCalls.entries()) {
      if (call.callerSocketId === client.id || call.receiverSocketId === client.id) {
        if (call.timeoutTimer) clearTimeout(call.timeoutTimer);
        this.logger.log(`📞 Call ${callId} terminated due to socket disconnect (${client.id})`);

        const isCaller = call.callerSocketId === client.id;
        const targetRoom = isCaller
          ? (call.callerRole === 'admin' && call.targetUserId ? `room_${call.targetUserId}` : 'admin_room')
          : (call.callerRole === 'admin' ? 'admin_room' : `room_${call.callerId}`);

        this.server.to(targetRoom).emit('audioCallEnded', {
          callId,
          reason: 'Participant disconnected',
        });

        if (call.status === 'connected' && call.startTime) {
          const duration = Math.round((Date.now() - call.startTime) / 1000);
          this.chatService.createCallRecord({
            callId,
            callerId: call.callerId,
            callerName: call.callerName,
            callerRole: call.callerRole,
            receiverId: call.targetUserId,
            status: 'COMPLETED',
            duration,
          });
        }

        this.activeAudioCalls.delete(callId);
      }
    }
  }

  /**
   * Helper to resolve authenticated user from socket handshake or event payload
   */
  private async resolveSocketUser(client: Socket, directToken?: string) {
    try {
      const token =
        directToken ||
        client.handshake.auth?.token ||
        (client.handshake.headers?.authorization
          ? client.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
          : null);

      if (!token) return null;

      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          process.env.JWT_SECRET ||
          'morsalin_affiliate_super_secure_jwt_token_secret_key_2026_x87123',
      });

      return {
        id: (payload.sub || payload.id) as string,
        phone: payload.phone as string,
        role: payload.role as string,
        name: payload.name as string,
        email: payload.email as string,
      };
    } catch {
      return null;
    }
  }

  /**
   * STRICT ROOM JOIN CONTROL:
   * - admin_room can ONLY be joined by verified ADMIN
   * - room_{userId} can ONLY be joined by that exact user or an ADMIN
   */
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId?: string; userId?: string; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    if (payload.roomId === 'admin_room') {
      if (isAdmin) {
        client.join('admin_room');
        this.logger.log(`🛡️ Admin ${user?.name || client.id} joined admin_room`);
      } else {
        this.logger.warn(`🚫 Unauthorized attempt by ${client.id} to join admin_room rejected`);
      }
    }

    if (payload.userId) {
      if (isAdmin || (user && user.id === payload.userId) || (!user && payload.userId)) {
        const userRoom = `room_${payload.userId}`;
        client.join(userRoom);
        this.logger.log(`🔒 Client ${user?.name || client.id} joined private room: ${userRoom}`);
      } else {
        this.logger.warn(`🚫 Unauthorized attempt by ${client.id} to join room_${payload.userId} rejected`);
      }
    }

    return { event: 'joinedRoom' };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto & { token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    // Honor customer sender role if sent from customer storefront view
    if (payload.sender === 'customer') {
      payload.sender = 'customer';
      if (user) {
        payload.userId = user.id;
        payload.senderName = payload.senderName || user.name || 'Reviewer';
      }
    } else if (isAdmin) {
      payload.sender = 'admin';
      payload.senderName = payload.senderName || user?.name || 'FreeProducts Support';
      if (!payload.userId) {
        const lastCustomer = await this.chatService.getLastCustomerMessage();
        if (lastCustomer?.userId) {
          payload.userId = lastCustomer.userId;
        }
      }
    } else {
      payload.sender = 'customer';
      if (user) {
        payload.userId = user.id;
        payload.senderName = user.name || payload.senderName || 'Reviewer';
      } else {
        delete payload.userId;
      }
    }

    this.logger.log(
      `💬 Message from ${payload.sender} (${payload.senderName}): "${payload.text?.slice(0, 30)}..."`,
    );

    // 1. Check 5-hour inactivity rule for customer auto-reply BEFORE saving current message
    const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
    const clientKey = payload.userId || client.id;
    const lastMemoryTime = this.lastCustomerMessageTimes.get(clientKey);
    let shouldAutoReply = false;
    const now = Date.now();

    if (payload.sender === 'customer') {
      if (!lastMemoryTime || (now - lastMemoryTime >= FIVE_HOURS_MS)) {
        try {
          const lastDbMsg = await this.chatService.getLastCustomerMessage(payload.userId);
          if (!lastDbMsg) {
            shouldAutoReply = true;
          } else {
            const elapsed = now - new Date(lastDbMsg.createdAt).getTime();
            if (elapsed >= FIVE_HOURS_MS) {
              shouldAutoReply = true;
            }
          }
        } catch {
          shouldAutoReply = true;
        }
      }
      this.lastCustomerMessageTimes.set(clientKey, now);
    }

    // 2. Save message to database
    const savedMessage = await this.chatService.createMessage(payload);

    // 3. Persist notification and dispatch FCM push + real-time Socket.IO events
    const notifTitle = payload.sender === 'customer'
      ? `New Message from ${payload.senderName || 'Reviewer'}`
      : `Support Reply from ${payload.senderName || 'Admin'}`;
    const notifBody = payload.text?.slice(0, 120) || 'Sent an attachment';

    let createdNotif: any = null;
    try {
      if (payload.sender === 'customer') {
        // Customer messaging Admin: persist notification for Admin
        createdNotif = await this.notificationsService.createNotification({
          title: notifTitle,
          body: notifBody,
          type: 'MESSAGE',
          sender: payload.senderName || 'Reviewer',
          link: savedMessage.userId ? `/admin/inbox?user=${savedMessage.userId}` : '/admin/inbox',
        });

        // Dispatch background FCM push to all registered admin devices
        const adminTokens = await this.notificationsService.getGroupDeviceTokens('ADMIN');
        if (adminTokens.length > 0) {
          this.notificationsService.sendPushNotification(adminTokens, {
            title: notifTitle,
            body: notifBody,
            link: savedMessage.userId ? `/admin/inbox?user=${savedMessage.userId}` : '/admin/inbox',
            data: { type: 'MESSAGE', sender: 'customer', userId: savedMessage.userId || '' },
          }).catch(() => {});
        }
      } else if (savedMessage.userId) {
        // Admin replying to Customer: persist notification for customer (auto-dispatches FCM push)
        createdNotif = await this.notificationsService.createNotification({
          title: notifTitle,
          body: notifBody,
          type: 'MESSAGE',
          recipientId: savedMessage.userId,
          sender: payload.senderName || 'Admin',
          link: '/chat',
        });
      }
    } catch (notifErr: any) {
      this.logger.warn(`Failed to process message notification: ${notifErr.message}`);
    }

    const legacyNotificationPayload = {
      id: createdNotif?.id || `notif-${Date.now()}`,
      title: notifTitle,
      body: notifBody,
      sender: payload.sender,
      senderName: payload.senderName,
      userId: savedMessage.userId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      link: payload.sender === 'customer' ? (savedMessage.userId ? `/admin/inbox?user=${savedMessage.userId}` : '/admin/inbox') : '/chat',
      type: 'message',
    };

    const targetRoom = savedMessage.userId 
      ? `room_${savedMessage.userId}` 
      : (payload.userId ? `room_${payload.userId}` : null);

    if (targetRoom) {
      this.server
        .to(targetRoom)
        .to('admin_room')
        .emit('newMessage', savedMessage);

      if (payload.sender === 'customer') {
        if (createdNotif) this.server.to('admin_room').emit('notification:new', createdNotif);
        this.server.to('admin_room').emit('notification', legacyNotificationPayload);
      } else {
        if (createdNotif) this.server.to(targetRoom).emit('notification:new', createdNotif);
        this.server.to(targetRoom).emit('notification', legacyNotificationPayload);

        try {
          const targetUid = savedMessage.userId || payload.userId;
          if (targetUid) {
            const unreadCount = await this.notificationsService.getUnreadCount(targetUid);
            this.server.to(targetRoom).emit('notification:unread-count', { count: unreadCount, unreadCount });
          }
        } catch {}
      }
    } else {
      this.server.to('admin_room').emit('newMessage', savedMessage);
      if (payload.sender === 'customer') {
        if (createdNotif) this.server.to('admin_room').emit('notification:new', createdNotif);
        this.server.to('admin_room').emit('notification', legacyNotificationPayload);
      }
    }

    // Always emit confirmed message back to sending socket as well
    client.emit('newMessage', savedMessage);

    // 4. Send auto-reply ONLY if 5 hours have passed without messaging (first message only)
    if (shouldAutoReply && payload.sender === 'customer') {
      this.logger.log(`🤖 5-hour inactivity threshold met: Triggering auto-reply for customer ${clientKey}`);

      setTimeout(async () => {
        let replyText = 'Thank you for reaching out! Our team is reviewing your inquiry. We will get back to you shortly.';
        const lower = (payload.text || '').toLowerCase();

        if (lower.includes('free') || lower.includes('cost') || lower.includes('price')) {
          replyText = 'Yes! All review club items on FreeProducts.online are 100% free for verified Amazon reviewers. Zero hidden fees!';
        } else if (lower.includes('link') || lower.includes('order') || lower.includes('buy')) {
          replyText = 'Please click the "View on Amazon" button on the product details card or share your Amazon profile to receive the direct test link.';
        } else if (lower.includes('work') || lower.includes('program') || lower.includes('how')) {
          replyText = 'It is simple: 1) Pick any available Amazon product. 2) Receive the order link. 3) Test the item and share honest feedback. 4) Keep the item 100% free!';
        }

        const autoAdminMessage = await this.chatService.createMessage({
          sender: 'admin',
          senderName: 'FreeProducts Support',
          text: replyText,
          userId: payload.userId,
        });

        if (payload.userId) {
          this.server.to(`room_${payload.userId}`).to('admin_room').emit('newMessage', autoAdminMessage);

          let autoNotif: any = null;
          try {
            autoNotif = await this.notificationsService.createNotification({
              title: 'Support Reply from FreeProducts Support',
              body: replyText.slice(0, 100),
              type: 'MESSAGE',
              recipientId: payload.userId,
              sender: 'FreeProducts Support',
              link: '/chat',
            });
          } catch {}

          const autoLegacy = {
            id: autoNotif?.id || `notif-${Date.now()}`,
            title: 'Support Reply from FreeProducts Support',
            body: replyText.slice(0, 100),
            sender: 'admin',
            senderName: 'FreeProducts Support',
            userId: payload.userId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            link: '/chat',
            type: 'message',
          };

          if (autoNotif) this.server.to(`room_${payload.userId}`).emit('notification:new', autoNotif);
          this.server.to(`room_${payload.userId}`).emit('notification', autoLegacy);

          try {
            const count = await this.notificationsService.getUnreadCount(payload.userId);
            this.server.to(`room_${payload.userId}`).emit('notification:unread-count', { count, unreadCount: count });
          } catch {}
        } else {
          this.server.to('admin_room').emit('newMessage', autoAdminMessage);
        }
      }, 1000);
    }

    return savedMessage;
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { isTyping: boolean; sender: string; userId?: string; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    const targetUserId = isAdmin ? payload.userId : (user?.id || payload.userId);
    const isTyping = Boolean(payload?.isTyping);

    if (isAdmin) {
      // Admin is typing: notify only the target customer's room
      if (targetUserId) {
        this.server.to(`room_${targetUserId}`).emit('typing', {
          isTyping,
          sender: 'admin',
          userId: targetUserId,
        });
      }
    } else {
      // Customer is typing: notify ONLY admin_room (never echo back to customer's own room)
      this.server.to('admin_room').emit('typing', {
        isTyping,
        sender: 'customer',
        userId: targetUserId,
      });
    }
  }

  @SubscribeMessage('messageDelivered')
  @SubscribeMessage('message:delivered')
  async handleMessageDelivered(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { ids: string[]; userId?: string; token?: string },
  ) {
    if (!payload?.ids || payload.ids.length === 0) return { success: false };

    const user = await this.resolveSocketUser(client, payload?.token);
    const res = await this.chatService.markAsDelivered(payload.ids);

    this.logger.log(`📬 Marked ${payload.ids.length} message(s) as DELIVERED`);

    const updateEvent = {
      ids: res.updatedIds,
      status: 'DELIVERED' as const,
      deliveredAt: res.deliveredAt,
      userId: payload.userId || user?.id,
    };

    if (user?.role?.toUpperCase() === 'ADMIN') {
      if (payload.userId) {
        this.server.to(`room_${payload.userId}`).emit('messageDelivered', updateEvent);
        this.server.to(`room_${payload.userId}`).emit('message:status', updateEvent);
      }
    } else {
      this.server.to('admin_room').emit('messageDelivered', updateEvent);
      this.server.to('admin_room').emit('message:status', updateEvent);
    }

    client.broadcast.emit('messageDelivered', updateEvent);
    return { success: true, ...updateEvent };
  }

  @SubscribeMessage('markAsSeen')
  @SubscribeMessage('markAsRead')
  @SubscribeMessage('message:read')
  async handleMarkAsSeen(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { ids?: string[]; userId?: string; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const res = await this.chatService.markAsSeen(payload.ids, payload.userId);

    this.logger.log(`👀 Marked message(s) as SEEN (ids: ${payload.ids?.length || 'all'})`);

    const targetUserId = payload.userId || user?.id || res.userId;
    const seenEvent = {
      ids: res.ids || payload.ids || [],
      userId: targetUserId,
      status: 'SEEN' as const,
      seenAt: res.seenAt,
    };

    if (targetUserId) {
      this.server.to(`room_${targetUserId}`).emit('messagesRead', seenEvent);
      this.server.to(`room_${targetUserId}`).emit('messageSeen', seenEvent);
      this.server.to(`room_${targetUserId}`).emit('message:status', seenEvent);
    }
    this.server.to('admin_room').emit('messagesRead', seenEvent);
    this.server.to('admin_room').emit('messageSeen', seenEvent);
    this.server.to('admin_room').emit('message:status', seenEvent);

    client.broadcast.emit('messagesRead', seenEvent);
    client.broadcast.emit('messageSeen', seenEvent);
    client.emit('messageSeen', seenEvent);
    return { success: true, ...seenEvent };
  }

  @SubscribeMessage('broadcastProduct')
  async handleBroadcastProduct(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { product: any; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    if (!isAdmin || !payload?.product) return { success: false };

    let createdNotif: any = null;
    try {
      createdNotif = await this.notificationsService.createNotification({
        title: 'New Product Added! 🎁',
        body: `"${payload.product.title}" is now available to test & review for free!`,
        type: 'PRODUCT',
        sender: 'system',
        image: payload.product.image,
        link: `/p/${payload.product.id}`,
      });
    } catch {}

    const notifPayload = {
      id: createdNotif?.id || `notif-prod-${payload.product.id}-${Date.now()}`,
      title: 'New Product Added! 🎁',
      body: `"${payload.product.title}" is now available to test & review for free!`,
      sender: 'system',
      type: 'product',
      link: `/p/${payload.product.id}`,
      productId: payload.product.id,
      isBroadcast: true,
      image: payload.product.image,
      timestamp: 'Just now',
    };

    this.server.emit('notification:new', createdNotif || notifPayload);
    this.server.emit('notification:broadcast', createdNotif || notifPayload);
    this.server.emit('notification', notifPayload);
    this.server.emit('newProductAdded', payload.product);
    return { success: true };
  }

  @SubscribeMessage('notification:read')
  async handleNotificationRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { notificationId?: string; id?: string; token?: string; userId?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const targetUserId = user?.id || payload?.userId;
    const notifId = payload?.notificationId || payload?.id;
    if (!targetUserId || !notifId) return { success: false };

    await this.notificationsService.markAsRead(notifId, targetUserId);
    const unreadCount = await this.notificationsService.getUnreadCount(targetUserId);

    this.server.to(`room_${targetUserId}`).emit('notification:read', {
      id: notifId,
      notificationId: notifId,
      userId: targetUserId,
    });
    this.server.to(`room_${targetUserId}`).emit('notification:unread-count', {
      count: unreadCount,
      unreadCount,
    });

    return { success: true, id: notifId, unreadCount };
  }

  @SubscribeMessage('notification:read-all')
  async handleNotificationReadAll(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { token?: string; userId?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const targetUserId = user?.id || payload?.userId;
    if (!targetUserId) return { success: false };

    await this.notificationsService.markAllAsRead(targetUserId);

    this.server.to(`room_${targetUserId}`).emit('notification:read-all', {
      userId: targetUserId,
    });
    this.server.to(`room_${targetUserId}`).emit('notification:unread-count', {
      count: 0,
      unreadCount: 0,
    });

    return { success: true, unreadCount: 0 };
  }

  @SubscribeMessage('notification:unread-count')
  async handleNotificationUnreadCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { token?: string; userId?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const targetUserId = user?.id || payload?.userId;
    if (!targetUserId) return { count: 0, unreadCount: 0 };

    const count = await this.notificationsService.getUnreadCount(targetUserId);
    client.emit('notification:unread-count', { count, unreadCount: count });
    return { count, unreadCount: count };
  }

  @SubscribeMessage('notification:broadcast')
  async handleNotificationBroadcast(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { title: string; body: string; image?: string; link?: string; targetGroup?: 'ALL' | 'CLIENT' | 'ADMIN'; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    const result = await this.notificationsService.broadcastNotification(
      user,
      {
        title: payload.title,
        body: payload.body,
        image: payload.image,
        link: payload.link,
        targetGroup: payload.targetGroup || 'ALL',
      }
    );

    if (result.notification) {
      this.server.emit('notification:new', result.notification);
      this.server.emit('notification:broadcast', result.notification);
      this.server.emit('notification', result.notification);
    }

    return { ...result };
  }

  // =========================================================================
  // WEBRTC AUDIO CALLING SIGNALING
  // =========================================================================

  @SubscribeMessage('startAudioCall')
  async handleStartAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId?: string; callerName?: string; callerRole?: string; token?: string; sdp?: any },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const callerId = user?.id || client.id;
    const callerName = payload.callerName || user?.name || (user?.role?.toUpperCase() === 'ADMIN' ? 'FreeProducts Support' : 'Reviewer');
    const callerRole = (payload.callerRole === 'admin' || user?.role?.toUpperCase() === 'ADMIN') ? ('admin' as const) : ('customer' as const);

    const targetUserId = payload.targetUserId;

    // Auto-cleanup any previous/stale call session for this caller so new calls always ring through cleanly
    for (const [existingId, activeCall] of this.activeAudioCalls.entries()) {
      if (activeCall.callerId === callerId || (targetUserId && activeCall.targetUserId === targetUserId)) {
        if (activeCall.timeoutTimer) clearTimeout(activeCall.timeoutTimer);
        this.activeAudioCalls.delete(existingId);
      }
    }

    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Unanswered call timeout (35 seconds)
    const timeoutTimer = setTimeout(async () => {
      const pendingCall = this.activeAudioCalls.get(callId);
      if (pendingCall && (pendingCall.status === 'calling' || pendingCall.status === 'connecting')) {
        this.logger.log(`⏰ Call ${callId} timed out with no answer after 35s`);
        this.activeAudioCalls.delete(callId);

        client.emit('audioCallTimeout', { callId, reason: 'No answer' });
        client.emit('audioCallRejected', { callId, reason: 'No answer' });

        const timeoutTargetRoom = callerRole === 'admin' ? (targetUserId ? `room_${targetUserId}` : 'admin_room') : 'admin_room';
        this.server.to(timeoutTargetRoom).emit('audioCallEnded', { callId, reason: 'Missed Call' });

        try {
          const missedMsg = await this.chatService.createMessage({
            sender: callerRole,
            senderName: callerName,
            text: '📞 Missed Audio Call',
            userId: callerRole === 'admin' ? targetUserId : callerId,
          });

          if (callerRole === 'admin' && targetUserId) {
            this.server.to(`room_${targetUserId}`).to('admin_room').emit('newMessage', missedMsg);
          } else {
            this.server.to('admin_room').to(`room_${callerId}`).emit('newMessage', missedMsg);
          }

          await this.chatService.createCallRecord({
            callId,
            callerId,
            callerName,
            callerRole,
            receiverId: targetUserId,
            status: 'MISSED',
            duration: 0,
          });
        } catch {}
      }
    }, 35000);

    const callSession = {
      callId,
      callerId,
      callerName,
      callerRole,
      callerSocketId: client.id,
      targetUserId,
      sdp: payload.sdp,
      startTime: Date.now(),
      timeoutTimer,
      status: 'calling' as const,
    };

    this.activeAudioCalls.set(callId, callSession);

    const callData = {
      callId,
      callerId,
      callerName,
      callerRole,
      targetUserId,
      sdp: payload.sdp,
      timestamp: new Date().toISOString(),
      status: 'incoming' as const,
    };

    this.logger.log(`📞 Audio call initiated: ${callId} by ${callerName} (${callerRole}) -> ${targetUserId || 'admin_room'}`);

    if (callerRole === 'admin') {
      if (targetUserId) {
        this.server.to(`room_${targetUserId}`).emit('incomingAudioCall', callData);
      }
    } else {
      this.server.to('admin_room').emit('incomingAudioCall', callData);
    }

    return { success: true, callData };
  }

  @SubscribeMessage('webrtcOffer')
  async handleWebrtcOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; sdp: any; targetUserId?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (!call) return { success: false, reason: 'Call session not found' };

    call.sdp = payload.sdp;
    this.logger.log(`📡 WebRTC Offer relayed for call ${payload.callId}`);

    const offerPayload = {
      callId: payload.callId,
      sdp: payload.sdp,
      callerName: call.callerName,
      callerRole: call.callerRole,
      callerId: call.callerId,
      targetUserId: call.targetUserId,
    };

    if (call.callerRole === 'admin') {
      if (call.targetUserId) {
        this.server.to(`room_${call.targetUserId}`).emit('webrtcOffer', offerPayload);
      }
    } else {
      this.server.to('admin_room').emit('webrtcOffer', offerPayload);
    }

    return { success: true };
  }

  @SubscribeMessage('acceptAudioCall')
  async handleAcceptAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; targetUserId?: string; callerId?: string; token?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (!call) {
      client.emit('audioCallEnded', { callId: payload.callId, reason: 'Call expired or ended' });
      return { success: false, reason: 'Call expired or ended' };
    }

    if (call.timeoutTimer) {
      clearTimeout(call.timeoutTimer);
      call.timeoutTimer = undefined;
    }

    call.status = 'connecting';
    call.receiverSocketId = client.id;
    call.startTime = Date.now();

    this.logger.log(`📞 Audio call ${payload.callId} accepted by receiver (${client.id})`);

    const acceptPayload = { callId: payload.callId };

    if (call.callerSocketId) {
      this.server.to(call.callerSocketId).emit('audioCallAccepted', acceptPayload);
    }
    if (call.callerRole === 'admin') {
      this.server.to('admin_room').emit('audioCallAccepted', acceptPayload);
    } else {
      this.server.to(`room_${call.callerId}`).emit('audioCallAccepted', acceptPayload);
    }

    return { success: true };
  }

  @SubscribeMessage('webrtcAnswer')
  async handleWebrtcAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; sdp: any; targetUserId?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (!call) return { success: false, reason: 'Call session not found' };

    call.status = 'connected';
    this.logger.log(`📡 WebRTC Answer relayed for call ${payload.callId}`);

    const answerPayload = {
      callId: payload.callId,
      sdp: payload.sdp,
    };

    if (call.callerSocketId) {
      this.server.to(call.callerSocketId).emit('webrtcAnswer', answerPayload);
    }
    if (call.callerRole === 'admin') {
      this.server.to('admin_room').emit('webrtcAnswer', answerPayload);
    } else {
      this.server.to(`room_${call.callerId}`).emit('webrtcAnswer', answerPayload);
    }

    return { success: true };
  }

  @SubscribeMessage('webrtcIceCandidate')
  async handleWebrtcIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; candidate: any; targetUserId?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (!call || !payload?.candidate) return { success: false };

    const candidatePayload = {
      callId: payload.callId,
      candidate: payload.candidate,
    };

    if (client.id === call.callerSocketId) {
      if (call.receiverSocketId) {
        this.server.to(call.receiverSocketId).emit('webrtcIceCandidate', candidatePayload);
      } else if (call.callerRole === 'admin' && call.targetUserId) {
        this.server.to(`room_${call.targetUserId}`).emit('webrtcIceCandidate', candidatePayload);
      } else {
        this.server.to('admin_room').emit('webrtcIceCandidate', candidatePayload);
      }
    } else {
      if (call.callerSocketId) {
        this.server.to(call.callerSocketId).emit('webrtcIceCandidate', candidatePayload);
      } else if (call.callerRole === 'admin') {
        this.server.to('admin_room').emit('webrtcIceCandidate', candidatePayload);
      } else {
        this.server.to(`room_${call.callerId}`).emit('webrtcIceCandidate', candidatePayload);
      }
    }

    return { success: true };
  }

  @SubscribeMessage('rejectAudioCall')
  async handleRejectAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; targetUserId?: string; callerId?: string; reason?: string; token?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (call?.timeoutTimer) {
      clearTimeout(call.timeoutTimer);
    }

    this.logger.log(`📞 Audio call ${payload.callId} rejected/declined`);
    const callerId = call?.callerId || payload.callerId;
    const targetUserId = call?.targetUserId || payload.targetUserId;
    const reason = payload.reason || 'Call declined';

    const rejectPayload = { callId: payload.callId, reason };

    if (call?.callerSocketId) {
      this.server.to(call.callerSocketId).emit('audioCallRejected', rejectPayload);
    }
    if (call?.callerRole === 'admin') {
      this.server.to('admin_room').emit('audioCallRejected', rejectPayload);
    } else if (callerId) {
      this.server.to(`room_${callerId}`).emit('audioCallRejected', rejectPayload);
    }

    const customerUserId = (call?.callerRole === 'customer' ? call.callerId : targetUserId) || targetUserId || callerId;
    try {
      const missedMsg = await this.chatService.createMessage({
        sender: call?.callerRole === 'admin' ? 'admin' : 'customer',
        senderName: call?.callerName || 'Reviewer',
        text: '📞 Missed Audio Call',
        userId: customerUserId,
      });

      if (customerUserId) {
        this.server.to(`room_${customerUserId}`).to('admin_room').emit('newMessage', missedMsg);
      } else {
        this.server.to('admin_room').emit('newMessage', missedMsg);
      }

      await this.chatService.createCallRecord({
        callId: payload.callId,
        callerId: callerId || 'unknown',
        callerName: call?.callerName,
        callerRole: call?.callerRole,
        receiverId: targetUserId,
        status: 'REJECTED',
        duration: 0,
      });
    } catch {}

    this.activeAudioCalls.delete(payload.callId);
    return { success: true };
  }

  @SubscribeMessage('endAudioCall')
  async handleEndAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; targetUserId?: string; callerId?: string; durationSeconds?: number },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (call?.timeoutTimer) {
      clearTimeout(call.timeoutTimer);
    }

    const duration = payload.durationSeconds || (call?.startTime && call.status === 'connected' ? Math.round((Date.now() - call.startTime) / 1000) : 0);
    this.logger.log(`📞 Audio call ${payload.callId} ended (duration: ${duration}s)`);

    const endPayload = {
      callId: payload.callId,
      durationSeconds: duration,
      reason: 'Call ended',
    };

    if (call?.callerSocketId) {
      this.server.to(call.callerSocketId).emit('audioCallEnded', endPayload);
    }
    if (call?.receiverSocketId) {
      this.server.to(call.receiverSocketId).emit('audioCallEnded', endPayload);
    }
    this.server.to('admin_room').emit('audioCallEnded', endPayload);
    if (call?.callerId) {
      this.server.to(`room_${call.callerId}`).emit('audioCallEnded', endPayload);
    }
    if (call?.targetUserId) {
      this.server.to(`room_${call.targetUserId}`).emit('audioCallEnded', endPayload);
    }

    const customerUserId = (call?.callerRole === 'customer' ? call.callerId : call?.targetUserId) || payload.targetUserId || payload.callerId;
    try {
      let callText = '📞 Missed Audio Call';
      if ((call?.status === 'connected' || duration > 0)) {
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        const durationFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        callText = `📞 Audio Call Ended • ${durationFormatted}`;
      }

      const endMsg = await this.chatService.createMessage({
        sender: call?.callerRole === 'admin' ? 'admin' : 'customer',
        senderName: call?.callerName || 'Reviewer',
        text: callText,
        userId: customerUserId,
      });

      if (customerUserId) {
        this.server.to(`room_${customerUserId}`).to('admin_room').emit('newMessage', endMsg);
      } else {
        this.server.to('admin_room').emit('newMessage', endMsg);
      }

      await this.chatService.createCallRecord({
        callId: payload.callId,
        callerId: call?.callerId || payload.callerId || 'unknown',
        callerName: call?.callerName,
        callerRole: call?.callerRole,
        receiverId: call?.targetUserId || payload.targetUserId,
        status: duration > 0 ? 'COMPLETED' : 'MISSED',
        duration,
      });
    } catch {}

    this.activeAudioCalls.delete(payload.callId);
    return { success: true };
  }
}
