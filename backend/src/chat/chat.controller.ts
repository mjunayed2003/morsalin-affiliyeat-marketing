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

  /**
   * STRICT CHAT PRIVACY & ISOLATION:
   * - Admin can view all messages or filter by specific user
   * - A Client can ONLY view their own private messages (matching currentUser.id)
   * - Unauthenticated visitors receive [] (cannot scrape or view any chat)
   */
  @Get('messages')
  @Public()
  async getMessages(
    @CurrentUser() currentUser?: AuthenticatedUser,
    @Query('userId') queryUserId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';
    const parsedPage = page ? parseInt(page, 10) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;

    if (isAdmin) {
      return this.chatService.getMessages(queryUserId, true, parsedPage, parsedLimit);
    }

    if (currentUser) {
      // Non-admin client is strictly locked to their own user ID (ignores query tampering)
      return this.chatService.getMessages(currentUser.id, false, parsedPage, parsedLimit);
    }

    // Unauthenticated visitors have no access to private chat threads
    return {
      messages: [],
      total: 0,
      page: 1,
      limit: parsedLimit || 50,
      totalPages: 0,
      hasMore: false,
    };
  }

  // Authenticated user or admin sends message
  @Post('messages')
  @Public()
  async createMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser() currentUser?: AuthenticatedUser,
  ) {
    // Only verified admin token can send as admin
    const isSenderAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';

    let resolvedUserId: string | null = null;

    if (isSenderAdmin) {
      // If admin specifies a customer's ID (not the admin's own ID)
      if (dto.userId && dto.userId !== currentUser?.id) {
        resolvedUserId = dto.userId;
      } else {
        const lastCustomer = await this.chatService.getLastCustomerMessage();
        resolvedUserId = lastCustomer?.userId || null;
      }
    } else if (currentUser) {
      // Client is strictly locked to their own verified user ID
      resolvedUserId = currentUser.id;
    } else {
      resolvedUserId = null;
    }

    const enrichedDto: SendMessageDto = {
      ...dto,
      sender: isSenderAdmin ? 'admin' : 'customer',
      senderName: isSenderAdmin
        ? (dto.senderName || currentUser?.name || 'FreeProducts Support')
        : (currentUser?.name || dto.senderName || 'Reviewer'),
      userId: resolvedUserId || undefined,
      localId: dto.localId,
    };

    const saved = await this.chatService.createMessage(enrichedDto);

    // Broadcast to target user private room and admin room with real-time notification
    if (this.chatGateway.server) {
      const notificationPayload = {
        id: `notif-${Date.now()}`,
        title: enrichedDto.sender === 'customer'
          ? `New Message from ${enrichedDto.senderName || 'Reviewer'}`
          : `Support Reply from ${enrichedDto.senderName || 'Admin'}`,
        body: enrichedDto.text?.slice(0, 100) || 'Sent an attachment',
        sender: enrichedDto.sender,
        senderName: enrichedDto.senderName,
        userId: saved.userId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (saved.userId) {
        this.chatGateway.server
          .to(`room_${saved.userId}`)
          .to('admin_room')
          .emit('newMessage', saved);

        if (enrichedDto.sender === 'customer') {
          this.chatGateway.server.to('admin_room').emit('notification', notificationPayload);
        } else {
          this.chatGateway.server.to(`room_${saved.userId}`).emit('notification', notificationPayload);
        }
      } else {
        this.chatGateway.server.to('admin_room').emit('newMessage', saved);
        if (enrichedDto.sender === 'customer') {
          this.chatGateway.server.to('admin_room').emit('notification', notificationPayload);
        }
      }
    }

    return saved;
  }

  // Clear conversation history (Admin can clear for a user; Client can clear only their own)
  @Delete('messages')
  @Public()
  async clearMessages(
    @CurrentUser() currentUser?: AuthenticatedUser,
    @Query('userId') queryUserId?: string,
  ) {
    const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';
    if (isAdmin) {
      return this.chatService.clearMessages(queryUserId);
    }
    if (currentUser) {
      return this.chatService.clearMessages(currentUser.id);
    }
    return { success: false, message: 'Authentication required' };
  }

  // Mark messages as delivered
  @Patch('messages/delivered')
  @Public()
  async markAsDelivered(@Body('ids') ids: string[]) {
    const res = await this.chatService.markAsDelivered(ids);
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('messageDelivered', { ids, deliveredAt: res.deliveredAt });
    }
    return res;
  }

  // Mark messages as read / seen
  @Patch('messages/read')
  @Public()
  async markAsRead(@Body('ids') ids?: string[], @Body('userId') userId?: string) {
    const res = await this.chatService.markAsSeen(ids, userId);
    if (this.chatGateway.server) {
      this.chatGateway.server.emit('messagesRead', { ids: res.ids, seenAt: res.seenAt, userId: res.userId });
    }
    return res;
  }
}
