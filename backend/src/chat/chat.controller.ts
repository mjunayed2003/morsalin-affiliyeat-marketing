import { Controller, Get, Post, Delete, Patch, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('messages')
  async getMessages(@Query('userId') userId?: string) {
    return this.chatService.getMessages(userId);
  }

  @Post('messages')
  async createMessage(@Body() dto: SendMessageDto) {
    const saved = await this.chatService.createMessage(dto);
    // Broadcast via socket.io gateway as well
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('newMessage', saved);
    }
    return saved;
  }

  @Delete('messages')
  async clearMessages(@Query('userId') userId?: string) {
    return this.chatService.clearMessages(userId);
  }

  @Patch('messages/read')
  async markAsRead(@Body('ids') ids?: string[]) {
    return this.chatService.markAsRead(ids);
  }
}
