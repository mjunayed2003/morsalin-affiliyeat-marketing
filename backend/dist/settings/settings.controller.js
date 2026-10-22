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
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { ChatGateway } from '../chat/chat.gateway.js';
let SettingsController = class SettingsController {
    settingsService;
    chatGateway;
    constructor(settingsService, chatGateway) {
        this.settingsService = settingsService;
        this.chatGateway = chatGateway;
    }
    async getSettings() {
        return this.settingsService.getSettings();
    }
    async updateSettings(dto) {
        const updated = this.settingsService.updateSettings(dto);
        if (this.chatGateway.server) {
            this.chatGateway.server.emit('settingsUpdated', updated);
            if (dto.maintenanceMode !== undefined) {
                this.chatGateway.server.emit('notification', {
                    id: `notif-maint-${Date.now()}`,
                    title: updated.maintenanceMode ? '🛠️ Maintenance Mode Activated' : '✅ Store Restored Online',
                    body: updated.maintenanceMode
                        ? 'The public catalog is temporarily restricted for updates.'
                        : 'Welcome back! FreeProducts.online is fully active.',
                    isBroadcast: true,
                    type: 'system',
                    timestamp: 'Just now',
                    link: '/',
                });
            }
        }
        return updated;
    }
};
__decorate([
    Get(),
    Public(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettings", null);
__decorate([
    Patch(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateSettings", null);
SettingsController = __decorate([
    Controller('settings'),
    __metadata("design:paramtypes", [SettingsService,
        ChatGateway])
], SettingsController);
export { SettingsController };
//# sourceMappingURL=settings.controller.js.map