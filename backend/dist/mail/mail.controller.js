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
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let MailController = class MailController {
    mailService;
    constructor(mailService) {
        this.mailService = mailService;
    }
    async testResend(body) {
        const to = body.to || 'delivered@resend.dev';
        const subject = body.subject || 'Test Email from FreeProducts.online via Resend';
        const html = body.html || `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #1b3b2b;">🎉 Resend Email Integration is Working!</h2>
        <p>This email was successfully dispatched using the official Resend Node.js SDK on FreeProducts.online.</p>
        <p style="font-size: 13px; color: #64748b;">Timestamp: ${new Date().toISOString()}</p>
      </div>
    `;
        const result = await this.mailService.sendEmail({
            to,
            subject,
            html,
            text: body.text || 'Resend Email Integration is working!',
            idempotencyKey: `test-${Date.now()}`,
        });
        return {
            message: result.success ? 'Email dispatched successfully' : 'Email dispatch encountered an issue',
            ...result,
        };
    }
    async sendCustomMail(body) {
        return this.mailService.sendEmail({
            to: body.to,
            subject: body.subject,
            html: body.html,
            text: body.text,
            idempotencyKey: `custom-${Date.now()}`,
        });
    }
};
__decorate([
    Post('test-resend'),
    Public(),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "testResend", null);
__decorate([
    Post('send'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendCustomMail", null);
MailController = __decorate([
    Controller('mail'),
    __metadata("design:paramtypes", [MailService])
], MailController);
export { MailController };
//# sourceMappingURL=mail.controller.js.map