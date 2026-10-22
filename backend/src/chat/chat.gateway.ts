import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@WebSocketGateway({
  cors: {
    origin: '*',
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
      targetUserId?: string;
      startTime?: number;
      status: 'calling' | 'connected';
    }
  >();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`⚡ Client connected via Socket.IO: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Client disconnected from Socket.IO: ${client.id}`);
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
      if (isAdmin || (user && user.id === payload.userId)) {
        const userRoom = `room_${payload.userId}`;
        client.join(userRoom);
        this.logger.log(`🔒 User ${user?.name || client.id} joined private room: ${userRoom}`);
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

    // Strictly enforce sender role & identity from verified token
    if (isAdmin) {
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
        // Unauthenticated client cannot spoof any registered userId
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

    // 3. Broadcast STRICTLY to the target user's private room and the admin room
    const notificationPayload = {
      id: `notif-${Date.now()}`,
      title: payload.sender === 'customer' 
        ? `New Message from ${payload.senderName || 'Reviewer'}` 
        : `Support Reply from ${payload.senderName || 'Admin'}`,
      body: payload.text?.slice(0, 100) || 'Sent an attachment',
      sender: payload.sender,
      senderName: payload.senderName,
      userId: savedMessage.userId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (savedMessage.userId) {
      this.server
        .to(`room_${savedMessage.userId}`)
        .to('admin_room')
        .emit('newMessage', savedMessage);

      // STRICT USER ISOLATION: Notification is sent ONLY to the recipient (never to sender or other clients)
      if (payload.sender === 'customer') {
        this.server.to('admin_room').emit('notification', notificationPayload);
      } else {
        this.server.to(`room_${savedMessage.userId}`).emit('notification', notificationPayload);
      }
    } else {
      this.server.to('admin_room').emit('newMessage', savedMessage);
      if (payload.sender === 'customer') {
        this.server.to('admin_room').emit('notification', notificationPayload);
      }
    }

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
          // Notify ONLY this specific customer in their private room
          this.server.to(`room_${payload.userId}`).emit('notification', {
            id: `notif-${Date.now()}`,
            title: 'Support Reply from FreeProducts Support',
            body: replyText.slice(0, 100),
            sender: 'admin',
            senderName: 'FreeProducts Support',
            userId: payload.userId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
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

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() payload: { ids?: string[] },
  ) {
    await this.chatService.markAsRead(payload.ids);
    this.server.emit('messagesRead', { ids: payload.ids });
    return { success: true };
  }

  @SubscribeMessage('broadcastProduct')
  async handleBroadcastProduct(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { product: any; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    if (!isAdmin || !payload?.product) return { success: false };

    const notifPayload = {
      id: `notif-prod-${payload.product.id}-${Date.now()}`,
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

    this.server.emit('notification', notifPayload);
    this.server.emit('newProductAdded', payload.product);
    return { success: true };
  }

  @SubscribeMessage('startAudioCall')
  async handleStartAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId?: string; callerName?: string; callerRole?: string; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const callerId = user?.id || client.id;
    const callerName = payload.callerName || user?.name || 'Reviewer';
    const callerRole = user?.role?.toUpperCase() === 'ADMIN' ? ('admin' as const) : ('customer' as const);

    const callId = `call_${Date.now()}`;
    const callData = {
      callId,
      callerId,
      callerName,
      callerRole,
      targetUserId: payload.targetUserId,
      timestamp: new Date().toISOString(),
      status: 'calling' as const,
    };

    this.activeAudioCalls.set(callId, callData);

    this.logger.log(`📞 Audio call initiated by ${callerName} (${callerRole}) for ${payload.targetUserId || 'admin_room'}`);

    if (callerRole === 'admin' && payload.targetUserId) {
      this.server.to(`room_${payload.targetUserId}`).emit('incomingAudioCall', callData);
    } else {
      this.server.to('admin_room').emit('incomingAudioCall', callData);
    }

    return { success: true, callData };
  }

  @SubscribeMessage('acceptAudioCall')
  async handleAcceptAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; targetUserId?: string; token?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    if (call) {
      call.status = 'connected';
      call.startTime = Date.now();
    }

    this.logger.log(`📞 Audio call accepted for callId ${payload.callId}`);

    const targetUserId = payload.targetUserId || call?.targetUserId || (call?.callerRole === 'customer' ? call.callerId : undefined);
    const callerId = call?.callerId;

    if (targetUserId) {
      this.server.to(`room_${targetUserId}`).emit('audioCallAccepted', { callId: payload.callId });
    }
    if (callerId) {
      this.server.to(`room_${callerId}`).emit('audioCallAccepted', { callId: payload.callId });
    }
    this.server.to('admin_room').emit('audioCallAccepted', { callId: payload.callId });
    client.broadcast.emit('audioCallAccepted', { callId: payload.callId });
    return { success: true };
  }

  @SubscribeMessage('rejectAudioCall')
  async handleRejectAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; targetUserId?: string; callerId?: string; reason?: string; token?: string },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    this.logger.log(`📞 Audio call rejected/declined for callId ${payload.callId}`);

    const targetUserId = payload.targetUserId || call?.targetUserId;
    const callerId = payload.callerId || call?.callerId;
    const customerUserId = (call?.callerRole === 'customer' ? call.callerId : targetUserId) || targetUserId || callerId;

    // Terminate call on ALL sides immediately
    if (targetUserId) {
      this.server.to(`room_${targetUserId}`).emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
    }
    if (callerId) {
      this.server.to(`room_${callerId}`).emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
    }
    this.server.to('admin_room').emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });
    client.broadcast.emit('audioCallRejected', { callId: payload.callId, reason: payload.reason || 'Call declined' });

    // Messenger style: Post Missed Call alert to chat
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
    } catch (e) {
      this.logger.warn(`Failed to create missed call message: ${e}`);
    }

    this.activeAudioCalls.delete(payload.callId);
    return { success: true };
  }

  @SubscribeMessage('endAudioCall')
  async handleEndAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { callId: string; targetUserId?: string; callerId?: string; durationSeconds?: number },
  ) {
    const call = this.activeAudioCalls.get(payload.callId);
    this.logger.log(`📞 Audio call ended for callId ${payload.callId}`);

    const targetUserId = payload.targetUserId || call?.targetUserId;
    const callerId = payload.callerId || call?.callerId;
    const customerUserId = (call?.callerRole === 'customer' ? call.callerId : targetUserId) || targetUserId || callerId;

    // Send audioCallEnded to ALL sides immediately so call modal terminates on both sides
    if (targetUserId) {
      this.server.to(`room_${targetUserId}`).emit('audioCallEnded', payload);
    }
    if (callerId) {
      this.server.to(`room_${callerId}`).emit('audioCallEnded', payload);
    }
    this.server.to('admin_room').emit('audioCallEnded', payload);
    client.broadcast.emit('audioCallEnded', payload);

    // Messenger-like call record: calculate duration or missed call
    try {
      let callText = '📞 Missed Audio Call';
      const duration = payload.durationSeconds || (call?.startTime ? Math.round((Date.now() - call.startTime) / 1000) : 0);

      if (call?.status === 'connected' || duration > 0) {
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
    } catch (e) {
      this.logger.warn(`Failed to create call end message: ${e}`);
    }

    this.activeAudioCalls.delete(payload.callId);
    return { success: true };
  }
}
