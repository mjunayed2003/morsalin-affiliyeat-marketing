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

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`⚡ Client connected via Socket.IO: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Client disconnected from Socket.IO: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId?: string; userId?: string },
  ) {
    const room = payload.roomId || (payload.userId ? `room_${payload.userId}` : 'general_support');
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { event: 'joinedRoom', room };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageDto,
  ) {
    this.logger.log(`💬 Received message from ${payload.sender}: "${payload.text?.slice(0, 30)}..."`);

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
            // First message ever
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
      // Record this message timestamp so subsequent messages within 5 hours get NO auto-reply
      this.lastCustomerMessageTimes.set(clientKey, now);
    }

    // If admin replies, ensure it targets the active customer thread
    if (payload.sender === 'admin' && !payload.userId) {
      const lastCustomer = await this.chatService.getLastCustomerMessage();
      if (lastCustomer?.userId) {
        payload.userId = lastCustomer.userId;
      }
    }

    // 2. Save message to database
    const savedMessage = await this.chatService.createMessage(payload);

    // 3. Broadcast to all sockets so client and admin see it in real-time
    this.server.emit('newMessage', savedMessage);

    // 4. Send auto-reply ONLY if 5 hours have passed without messaging (first message only)
    if (shouldAutoReply && payload.sender === 'customer') {
      this.logger.log(`🤖 5-hour inactivity threshold met: Triggering auto-reply for customer ${clientKey}`);

      setTimeout(() => {
        this.server.emit('typing', { isTyping: true, sender: 'admin' });
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

        this.server.emit('typing', { isTyping: false, sender: 'admin' });
        this.server.emit('newMessage', autoAdminMessage);
      }, 1600);
    } else if (payload.sender === 'customer') {
      this.logger.log(`ℹ️ Auto-reply suppressed: Customer ${clientKey} messaged within the 5-hour window.`);
    }

    return savedMessage;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { isTyping: boolean; sender: string },
  ) {
    client.broadcast.emit('typing', payload);
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
