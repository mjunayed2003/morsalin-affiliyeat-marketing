import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { BroadcastNotificationDto, RegisterDeviceDto } from './dto/create-notification.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  /**
   * Register or update FCM device token (supports multi-device per user)
   */
  @Post('devices')
  @UseGuards(JwtAuthGuard)
  async registerDevice(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterDeviceDto
  ) {
    if (!dto.token) {
      throw new BadRequestException('FCM registration token is required.');
    }
    return this.notificationsService.registerDeviceToken(user.id, dto.token, dto.platform || 'web');
  }

  /**
   * Unregister FCM device token (e.g. on logout)
   */
  @Delete('devices')
  async unregisterDevice(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('FCM token is required.');
    }
    return this.notificationsService.unregisterDeviceToken(token);
  }

  /**
   * Retrieve notification history for the authenticated user (or guest)
   */
  @Get()
  async getNotifications(
    @Query('userId') queryUserId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10) || 1;
    const limitNum = parseInt(limit || '30', 10) || 30;
    return this.notificationsService.getUserNotifications(queryUserId, pageNum, limitNum);
  }

  /**
   * Get unread notifications count
   */
  @Get('unread-count')
  async getUnreadCount(@Query('userId') userId?: string) {
    const count = await this.notificationsService.getUnreadCount(userId || '');
    return { unreadCount: count };
  }

  /**
   * Mark a single notification as read
   */
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body('userId') userId?: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required to mark notification read.');
    }
    const res = await this.notificationsService.markAsRead(id, userId);

    // Emit real-time notification:read event
    if (this.chatGateway.server) {
      this.chatGateway.server.to(`room_${userId}`).emit('notification:read', { id, userId });
    }

    return res;
  }

  /**
   * Mark all notifications as read for a user
   */
  @Patch('read-all')
  async markAllAsRead(@Body('userId') userId?: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    const res = await this.notificationsService.markAllAsRead(userId);

    // Emit real-time notification:read-all event
    if (this.chatGateway.server) {
      this.chatGateway.server.to(`room_${userId}`).emit('notification:read-all', { userId });
      this.chatGateway.server.to(`room_${userId}`).emit('notification:unread-count', { unreadCount: 0 });
    }

    return res;
  }

  /**
   * Admin Broadcast to all users or target groups (ADMIN ONLY)
   */
  @Post('broadcast')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async broadcastNotification(
    @CurrentUser() adminUser: AuthenticatedUser,
    @Body() dto: BroadcastNotificationDto
  ) {
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException('Notification title is required.');
    }
    if (!dto.body || !dto.body.trim()) {
      throw new BadRequestException('Notification message body is required.');
    }

    const result = await this.notificationsService.broadcastNotification(adminUser, dto);

    // Distribute in real-time over Socket.IO to connected clients
    if (this.chatGateway.server && result.notification) {
      this.chatGateway.server.emit('notification:new', result.notification);
      this.chatGateway.server.emit('notification:broadcast', result.notification);
      // Legacy event for existing clients
      this.chatGateway.server.emit('notification', result.notification);
    }

    return result;
  }

  /**
   * Admin: View broadcast history and audit metrics
   */
  @Get('broadcasts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getBroadcastLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1', 10) || 1;
    const limitNum = parseInt(limit || '20', 10) || 20;
    return this.notificationsService.getBroadcastLogs(pageNum, limitNum);
  }
}
