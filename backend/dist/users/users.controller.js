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
import { Controller, Get, Param, Query, Patch, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(role) {
        return this.usersService.findAll(role);
    }
    async getPendingCount() {
        return this.usersService.getPendingCount();
    }
    async findPendingRegistrations(page, limit, search) {
        return this.usersService.findPendingRegistrations(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, search);
    }
    async approveRegistration(id, adminUser) {
        return this.usersService.approveRegistration(id, adminUser);
    }
    async rejectRegistration(id, reason, adminUser) {
        return this.usersService.rejectRegistration(id, adminUser, reason);
    }
    async updateStatus(id, status, adminUser) {
        return this.usersService.updateStatus(id, status, adminUser);
    }
    async findOne(id, currentUser) {
        if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
            throw new ForbiddenException('Access Denied: You can only view your own user account.');
        }
        return this.usersService.findOne(id);
    }
    async updateRole(id, role) {
        return this.usersService.updateRole(id, role);
    }
    async updateReviewPermission(id, canReview) {
        return this.usersService.updateReviewPermission(id, canReview);
    }
    async updateSelfie(id, selfieImage, currentUser) {
        if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
            throw new ForbiddenException('Access Denied: You can only update your own selfie.');
        }
        return this.usersService.updateSelfie(id, selfieImage);
    }
    async updateFcmToken(id, fcmToken, currentUser) {
        if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
            throw new ForbiddenException('Access Denied: You can only update your own notification settings.');
        }
        return this.usersService.updateFcmToken(id, fcmToken);
    }
};
__decorate([
    Get(),
    Roles('ADMIN'),
    __param(0, Query('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    Get('pending/count'),
    Roles('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPendingCount", null);
__decorate([
    Get('pending'),
    Roles('ADMIN'),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __param(2, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findPendingRegistrations", null);
__decorate([
    Patch(':id/approve'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveRegistration", null);
__decorate([
    Patch(':id/reject'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, Body('reason')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "rejectRegistration", null);
__decorate([
    Patch(':id/status'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateStatus", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    Patch(':id/role'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, Body('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    Patch(':id/review-permission'),
    Roles('ADMIN'),
    __param(0, Param('id')),
    __param(1, Body('canReview')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateReviewPermission", null);
__decorate([
    Patch(':id/selfie'),
    __param(0, Param('id')),
    __param(1, Body('selfieImage')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateSelfie", null);
__decorate([
    Patch(':id/fcm-token'),
    __param(0, Param('id')),
    __param(1, Body('fcmToken')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateFcmToken", null);
UsersController = __decorate([
    Controller('users'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map