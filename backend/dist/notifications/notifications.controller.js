var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, BadRequestException, } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { BroadcastNotificationDto, RegisterDeviceDto } from './dto/create-notification.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';
let NotificationsController = class NotificationsController {
    notificationsService;
    chatGateway;
    constructor(notificationsService, chatGateway) {
        this.notificationsService = notificationsService;
        this.chatGateway = chatGateway;
    }
    async registerDevice(user, dto) {
        if (!dto.token) {
            throw new BadRequestException('FCM registration token is required.');
        }
        return this.notificationsService.registerDeviceToken(user.id, dto.token, dto.platform || 'web');
    }
    async unregisterDevice(token) {
        if (!token) {
            throw new BadRequestException('FCM token is required.');
        }
        return this.notificationsService.unregisterDeviceToken(token);
    }
    async getNotifications(queryUserId, page, limit) {
        const pageNum = parseInt(page || '1', 10) || 1;
        const limitNum = parseInt(limit || '30', 10) || 30;
        return this.notificationsService.getUserNotifications(queryUserId, pageNum, limitNum);
    }
    async getUnreadCount(userId) {
        const count = await this.notificationsService.getUnreadCount(userId || '');
        return { unreadCount: count };
    }
    async markAsRead(id, userId) {
        if (!userId) {
            throw new BadRequestException('User ID is required to mark notification read.');
        }
        const res = await this.notificationsService.markAsRead(id, userId);
        if (this.chatGateway.server) {
            this.chatGateway.server.to(`room_${userId}`).emit('notification:read', { id, userId });
        }
        return res;
    }
    async markAllAsRead(userId) {
        if (!userId) {
            throw new BadRequestException('User ID is required.');
        }
        const res = await this.notificationsService.markAllAsRead(userId);
        if (this.chatGateway.server) {
            this.chatGateway.server.to(`room_${userId}`).emit('notification:read-all', { userId });
            this.chatGateway.server.to(`room_${userId}`).emit('notification:unread-count', { unreadCount: 0 });
        }
        return res;
    }
    async broadcastNotification(adminUser, dto) {
        if (!dto.title || !dto.title.trim()) {
            throw new BadRequestException('Notification title is required.');
        }
        if (!dto.body || !dto.body.trim()) {
            throw new BadRequestException('Notification message body is required.');
        }
        const result = await this.notificationsService.broadcastNotification(adminUser, dto);
        if (this.chatGateway.server && result.notification) {
            this.chatGateway.server.emit('notification:new', result.notification);
            this.chatGateway.server.emit('notification:broadcast', result.notification);
            this.chatGateway.server.emit('notification', result.notification);
        }
        return result;
    }
    async getBroadcastLogs(page, limit) {
        const pageNum = parseInt(page || '1', 10) || 1;
        const limitNum = parseInt(limit || '20', 10) || 20;
        return this.notificationsService.getBroadcastLogs(pageNum, limitNum);
    }
};
__decorate([
    Post('devices'),
    UseGuards(JwtAuthGuard),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RegisterDeviceDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "registerDevice", null);
__decorate([
    Delete('devices'),
    __param(0, Body('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unregisterDevice", null);
__decorate([
    Get(),
    __param(0, Query('userId')),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    Get('unread-count'),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    Patch(':id/read'),
    __param(0, Param('id')),
    __param(1, Body('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    Patch('read-all'),
    __param(0, Body('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    Post('broadcast'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BroadcastNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "broadcastNotification", null);
__decorate([
    Get('broadcasts'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getBroadcastLogs", null);
NotificationsController = __decorate([
    Controller('notifications'),
    __metadata("design:paramtypes", [NotificationsService,
        ChatGateway])
], NotificationsController);
export { NotificationsController };
//# sourceMappingURL=notifications.controller.js.map