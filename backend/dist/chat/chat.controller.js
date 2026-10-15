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
import { Controller, Get, Post, Delete, Patch, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatGateway } from './chat.gateway.js';
import { SendMessageDto } from './dto/send-message.dto.js';
let ChatController = class ChatController {
    chatService;
    chatGateway;
    constructor(chatService, chatGateway) {
        this.chatService = chatService;
        this.chatGateway = chatGateway;
    }
    async getMessages(userId) {
        return this.chatService.getMessages(userId);
    }
    async createMessage(dto) {
        const saved = await this.chatService.createMessage(dto);
        if (this.chatGateway.server) {
            this.chatGateway.server.emit('newMessage', saved);
        }
        return saved;
    }
    async clearMessages(userId) {
        return this.chatService.clearMessages(userId);
    }
    async markAsRead(ids) {
        return this.chatService.markAsRead(ids);
    }
};
__decorate([
    Get('messages'),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    Post('messages'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createMessage", null);
__decorate([
    Delete('messages'),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "clearMessages", null);
__decorate([
    Patch('messages/read'),
    __param(0, Body('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
ChatController = __decorate([
    Controller('chat'),
    __metadata("design:paramtypes", [ChatService,
        ChatGateway])
], ChatController);
export { ChatController };
//# sourceMappingURL=chat.controller.js.map