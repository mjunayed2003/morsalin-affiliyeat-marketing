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
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { GuestLoginDto } from './dto/guest-login.dto.js';
import { SendRegisterOtpDto, VerifyRegisterOtpDto, SendForgotPasswordOtpDto, ResetPasswordDto, } from './dto/otp-auth.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async sendRegisterOtp(dto) {
        return this.authService.sendRegisterOtp(dto);
    }
    async verifyRegisterOtp(dto) {
        return this.authService.verifyRegisterOtp(dto);
    }
    async sendForgotPasswordOtp(dto) {
        return this.authService.sendForgotPasswordOtp(dto);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async guestLogin(dto) {
        return this.authService.guestLogin(dto);
    }
    async getProfile(currentUser) {
        return this.authService.getProfile(currentUser.id);
    }
};
__decorate([
    Post('send-register-otp'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendRegisterOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendRegisterOtp", null);
__decorate([
    Post('verify-register-otp'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyRegisterOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyRegisterOtp", null);
__decorate([
    Post('send-forgot-password-otp'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendForgotPasswordOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendForgotPasswordOtp", null);
__decorate([
    Post('reset-password'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    Post('register'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Post('login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('guest'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuestLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "guestLogin", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map