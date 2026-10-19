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
      payload.senderName = payload.senderName || user?.name || 'ProductPerks Admin';
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
    if (savedMessage.userId) {
      this.server
        .to(`room_${savedMessage.userId}`)
        .to('admin_room')
        .emit('newMessage', savedMessage);
    } else {
      this.server.to('admin_room').emit('newMessage', savedMessage);
    }

    // 4. Send auto-reply ONLY if 5 hours have passed without messaging (first message only)
    if (shouldAutoReply && payload.sender === 'customer') {
      this.logger.log(`🤖 5-hour inactivity threshold met: Triggering auto-reply for customer ${clientKey}`);

      setTimeout(() => {
        if (payload.userId) {
          this.server.to(`room_${payload.userId}`).to('admin_room').emit('typing', { isTyping: true, sender: 'admin', userId: payload.userId });
        } else {
          this.server.to('admin_room').emit('typing', { isTyping: true, sender: 'admin' });
        }
      }, 500);

      setTimeout(async () => {
        let replyText = 'Thank you for reaching out! Our team is reviewing your inquiry. We will get back to you shortly.';
        const lower = (payload.text || '').toLowerCase();

        if (lower.includes('free') || lower.includes('cost') || lower.includes('price')) {
          replyText = 'Yes! All review club items on ProductPerks are 100% free for verified Amazon reviewers. Zero hidden fees!';
        } else if (lower.includes('link') || lower.includes('order') || lower.includes('buy')) {
          replyText = 'Please click the "View on Amazon" button on the product details card or share your Amazon profile to receive the direct test link.';
        } else if (lower.includes('work') || lower.includes('program') || lower.includes('how')) {
          replyText = 'It is simple: 1) Pick any available Amazon product. 2) Receive the order link. 3) Test the item and share honest feedback. 4) Keep the item 100% free!';
        }

        const autoAdminMessage = await this.chatService.createMessage({
          sender: 'admin',
          senderName: 'ProductPerks Admin',
          text: replyText,
          userId: payload.userId,
        });

        if (payload.userId) {
          this.server.to(`room_${payload.userId}`).to('admin_room').emit('typing', { isTyping: false, sender: 'admin', userId: payload.userId });
          this.server.to(`room_${payload.userId}`).to('admin_room').emit('newMessage', autoAdminMessage);
        } else {
          this.server.to('admin_room').emit('typing', { isTyping: false, sender: 'admin' });
          this.server.to('admin_room').emit('newMessage', autoAdminMessage);
        }
      }, 1600);
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

    if (targetUserId) {
      this.server.to(`room_${targetUserId}`).to('admin_room').emit('typing', {
        isTyping: payload.isTyping,
        sender: isAdmin ? 'admin' : 'customer',
        userId: targetUserId,
      });
    } else {
      this.server.to('admin_room').emit('typing', {
        isTyping: payload.isTyping,
        sender: 'customer',
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
}
