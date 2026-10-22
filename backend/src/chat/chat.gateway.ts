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
      callerSocketId: string;
      targetUserId?: string;
      receiverSocketId?: string;
      startTime?: number;
      timeoutTimer?: NodeJS.Timeout;
      status: 'calling' | 'connecting' | 'connected' | 'rejected' | 'ended';
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

    // 3. Broadcast to the target user's private room, admin room, and connected clients
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
      link: payload.sender === 'customer' ? '/admin/inbox' : '/chat',
    };

    if (savedMessage.userId) {
      this.server
        .to(`room_${savedMessage.userId}`)
        .to('admin_room')
        .emit('newMessage', savedMessage);
      client.broadcast.emit('newMessage', savedMessage);

      if (payload.sender === 'customer') {
        this.server.to('admin_room').emit('notification', notificationPayload);
        client.broadcast.emit('notification', notificationPayload);
      } else {
        this.server.to(`room_${savedMessage.userId}`).emit('notification', notificationPayload);
        client.broadcast.emit('notification', notificationPayload);
      }
    } else {
      this.server.to('admin_room').emit('newMessage', savedMessage);
      client.broadcast.emit('newMessage', savedMessage);
      if (payload.sender === 'customer') {
        this.server.to('admin_room').emit('notification', notificationPayload);
        client.broadcast.emit('notification', notificationPayload);
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

    const seenEvent = {
      ids: res.ids,
      userId: payload.userId || user?.id,
      status: 'SEEN' as const,
      seenAt: res.seenAt,
    };

    if (user?.role?.toUpperCase() === 'ADMIN') {
      if (payload.userId) {
        this.server.to(`room_${payload.userId}`).emit('messagesRead', seenEvent);
        this.server.to(`room_${payload.userId}`).emit('messageSeen', seenEvent);
        this.server.to(`room_${payload.userId}`).emit('message:status', seenEvent);
      }
    } else {
      this.server.to('admin_room').emit('messagesRead', seenEvent);
      this.server.to('admin_room').emit('messageSeen', seenEvent);
      this.server.to('admin_room').emit('message:status', seenEvent);
    }

    client.broadcast.emit('messagesRead', seenEvent);
    client.broadcast.emit('messageSeen', seenEvent);
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

  // =========================================================================
  // WEBRTC AUDIO CALLING SIGNALING
  // =========================================================================

  @SubscribeMessage('startAudioCall')
  async handleStartAudioCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId?: string; callerName?: string; callerRole?: string; token?: string },
  ) {
    const user = await this.resolveSocketUser(client, payload?.token);
    const callerId = user?.id || client.id;
    const callerName = payload.callerName || user?.name || (user?.role?.toUpperCase() === 'ADMIN' ? 'FreeProducts Support' : 'Reviewer');
    const callerRole = (payload.callerRole === 'admin' || user?.role?.toUpperCase() === 'ADMIN') ? ('admin' as const) : ('customer' as const);

    const targetUserId = payload.targetUserId;

    // Check for busy participant
    for (const [existingId, activeCall] of this.activeAudioCalls.entries()) {
      if (activeCall.status === 'connected' || activeCall.status === 'calling' || activeCall.status === 'connecting') {
        const isTargetBusy = targetUserId && (activeCall.callerId === targetUserId || activeCall.targetUserId === targetUserId);
        const isCallerBusy = activeCall.callerId === callerId || (activeCall.targetUserId && activeCall.targetUserId === callerId);

        if (isTargetBusy || isCallerBusy) {
          client.emit('audioCallBusy', {
            callId: existingId,
            reason: 'User is currently on another call.',
          });
          return { success: false, reason: 'BUSY' };
        }
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
    } else if (call.callerRole === 'admin') {
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
