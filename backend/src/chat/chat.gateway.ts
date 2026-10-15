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

    // Save message to database
    const savedMessage = await this.chatService.createMessage(payload);

    // Broadcast new message to all clients or specific room
    this.server.emit('newMessage', savedMessage);

    // If message is from customer, simulate automated intelligent response after 1.5s
    if (payload.sender === 'customer') {
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
