import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Patch, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  // Admin sees all messages (or filtered by user); Client sees their own + general; Guest sees by queryUserId or general
  @Get('messages')
  @Public()
  async getMessages(
    @CurrentUser() currentUser?: AuthenticatedUser,
    @Query('userId') queryUserId?: string,
  ) {
    if (currentUser?.role?.toUpperCase() === 'ADMIN') {
      return this.chatService.getMessages(queryUserId);
    }
    if (currentUser) {
      return this.chatService.getMessages(currentUser.id);
    }
    return this.chatService.getMessages(queryUserId);
  }

  // Authenticated user or guest sends message
  @Post('messages')
  @Public()
  async createMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser() currentUser?: AuthenticatedUser,
  ) {
    const isSenderAdmin = 
      currentUser?.role?.toUpperCase() === 'ADMIN' || 
      dto.sender === 'admin';

    let resolvedUserId: string | null = null;

    if (isSenderAdmin) {
      // If admin specifies a customer's ID (not the admin's own ID)
      if (dto.userId && dto.userId !== currentUser?.id) {
        resolvedUserId = dto.userId;
      } else {
        // Automatically link admin reply to the active customer conversation
        const lastCustomer = await this.chatService.getLastCustomerMessage();
        resolvedUserId = lastCustomer?.userId || null;
      }
    } else {
      resolvedUserId = currentUser?.id || dto.userId || null;
    }

    const enrichedDto: SendMessageDto = {
      ...dto,
      sender: isSenderAdmin ? 'admin' : (dto.sender || 'customer'),
      senderName: isSenderAdmin
        ? (dto.senderName || currentUser?.name || 'ProductPerks Admin')
        : (currentUser?.name || dto.senderName || 'Reviewer'),
      userId: resolvedUserId || undefined,
      localId: dto.localId,
    };

    const saved = await this.chatService.createMessage(enrichedDto);
    // Broadcast to all connected sockets
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('newMessage', saved);
    }
    return saved;
  }

  // Admin Only: Clear conversation history
  @Delete('messages')
  @Roles('ADMIN')
  async clearMessages(@Query('userId') userId?: string) {
    return this.chatService.clearMessages(userId);
  }

  // Authenticated user marks messages as read
  @Patch('messages/read')
  async markAsRead(@Body('ids') ids?: string[]) {
    return this.chatService.markAsRead(ids);
  }
}
