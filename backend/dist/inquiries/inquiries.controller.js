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
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InquiriesService } from './inquiries.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let InquiriesController = class InquiriesController {
    inquiriesService;
    constructor(inquiriesService) {
        this.inquiriesService = inquiriesService;
    }
    async create(dto, currentUser) {
        const targetUserId = currentUser.role === 'ADMIN' && dto.userId ? dto.userId : currentUser.id;
        return this.inquiriesService.create({
            ...dto,
            userId: targetUserId,
        });
    }
    async findAll(currentUser, queryUserId) {
        if (currentUser.role === 'ADMIN') {
            return this.inquiriesService.findAll(queryUserId);
        }
        return this.inquiriesService.findAll(currentUser.id);
    }
    async updateStatus(id, status) {
        return this.inquiriesService.updateStatus(id, status);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInquiryDto, Object]),
    __metadata("design:returntype", Promise)
], InquiriesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InquiriesController.prototype, "findAll", null);
__decorate([
    Patch(':id/status'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InquiriesController.prototype, "updateStatus", null);
InquiriesController = __decorate([
    Controller('inquiries'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [InquiriesService])
], InquiriesController);
export { InquiriesController };
//# sourceMappingURL=inquiries.controller.js.map