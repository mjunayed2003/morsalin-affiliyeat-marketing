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
import { Controller, Get, Post, Delete, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let ChatController = class ChatController {
    chatService;
    chatGateway;
    constructor(chatService, chatGateway) {
        this.chatService = chatService;
        this.chatGateway = chatGateway;
    }
    async getMessages(currentUser, queryUserId, page, limit) {
        const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';
        const parsedPage = page ? parseInt(page, 10) : undefined;
        const parsedLimit = limit ? parseInt(limit, 10) : undefined;
        if (isAdmin) {
            return this.chatService.getMessages(queryUserId, true, parsedPage, parsedLimit);
        }
        if (currentUser) {
            return this.chatService.getMessages(currentUser.id, false, parsedPage, parsedLimit);
        }
        return {
            messages: [],
            total: 0,
            page: 1,
            limit: parsedLimit || 50,
            totalPages: 0,
            hasMore: false,
        };
    }
    async createMessage(dto, currentUser) {
        const isSenderAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';
        let resolvedUserId = null;
        if (isSenderAdmin) {
            if (dto.userId && dto.userId !== currentUser?.id) {
                resolvedUserId = dto.userId;
            }
            else {
                const lastCustomer = await this.chatService.getLastCustomerMessage();
                resolvedUserId = lastCustomer?.userId || null;
            }
        }
        else if (currentUser) {
            resolvedUserId = currentUser.id;
        }
        else {
            resolvedUserId = null;
        }
        const enrichedDto = {
            ...dto,
            sender: isSenderAdmin ? 'admin' : 'customer',
            senderName: isSenderAdmin
                ? (dto.senderName || currentUser?.name || 'FreeProducts Support')
                : (currentUser?.name || dto.senderName || 'Reviewer'),
            userId: resolvedUserId || undefined,
            localId: dto.localId,
        };
        const saved = await this.chatService.createMessage(enrichedDto);
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
                }
                else {
                    this.chatGateway.server.to(`room_${saved.userId}`).emit('notification', notificationPayload);
                }
            }
            else {
                this.chatGateway.server.to('admin_room').emit('newMessage', saved);
                if (enrichedDto.sender === 'customer') {
                    this.chatGateway.server.to('admin_room').emit('notification', notificationPayload);
                }
            }
        }
        return saved;
    }
    async clearMessages(currentUser, queryUserId) {
        const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';
        if (isAdmin) {
            return this.chatService.clearMessages(queryUserId);
        }
        if (currentUser) {
            return this.chatService.clearMessages(currentUser.id);
        }
        return { success: false, message: 'Authentication required' };
    }
    async markAsDelivered(ids) {
        const res = await this.chatService.markAsDelivered(ids);
        if (this.chatGateway.server) {
            this.chatGateway.server.emit('messageDelivered', { ids, deliveredAt: res.deliveredAt });
        }
        return res;
    }
    async markAsRead(ids, userId) {
        const res = await this.chatService.markAsSeen(ids, userId);
        if (this.chatGateway.server) {
            this.chatGateway.server.emit('messagesRead', { ids: res.ids, seenAt: res.seenAt, userId: res.userId });
        }
        return res;
    }
};
__decorate([
    Get('messages'),
    Public(),
    __param(0, CurrentUser()),
    __param(1, Query('userId')),
    __param(2, Query('page')),
    __param(3, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    Post('messages'),
    Public(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createMessage", null);
__decorate([
    Delete('messages'),
    Public(),
    __param(0, CurrentUser()),
    __param(1, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "clearMessages", null);
__decorate([
    Patch('messages/delivered'),
    Public(),
    __param(0, Body('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsDelivered", null);
__decorate([
    Patch('messages/read'),
    Public(),
    __param(0, Body('ids')),
    __param(1, Body('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
ChatController = __decorate([
    Controller('chat'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ChatService,
        ChatGateway])
], ChatController);
export { ChatController };
//# sourceMappingURL=chat.controller.js.map