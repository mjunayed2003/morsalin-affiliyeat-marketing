var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { validateAndFormatUsaPhone, formatUsaPhoneDisplay } from './utils/phone.util.js';
import bcrypt from 'bcryptjs';
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    normalizePhone(phone) {
        return phone.replace(/[\s\-()]/g, '').trim();
    }
    async sendRegisterOtp(dto) {
        if (!dto.name || !dto.name.trim()) {
            throw new BadRequestException('Please enter your full name.');
        }
        if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email.trim())) {
            throw new BadRequestException('Please provide a valid Gmail / email address.');
        }
        const cleanEmail = dto.email.trim().toLowerCase();
        const phoneCheck = validateAndFormatUsaPhone(dto.phone);
        if (!phoneCheck.isValid) {
            throw new BadRequestException(phoneCheck.error || 'Only USA phone numbers are allowed (+1 followed by 10 US digits).');
        }
        const cleanPhone = phoneCheck.formatted;
        if (!dto.password || dto.password.length < 4) {
            throw new BadRequestException('Password must be at least 4 characters long.');
        }
        const existingPhone = await this.prisma.user.findUnique({
            where: { phone: cleanPhone },
        });
        if (existingPhone) {
            throw new BadRequestException(`An account is already registered with ${formatUsaPhoneDisplay(cleanPhone)}. Please sign in instead.`);
        }
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: cleanEmail },
        });
        if (existingEmail) {
            throw new BadRequestException(`An account is already registered with ${cleanEmail}. Please sign in or use forgot password.`);
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPassword = bcrypt.hashSync(dto.password, 10);
        const pendingData = {
            name: dto.name.trim(),
            phone: cleanPhone,
            email: cleanEmail,
            password: hashedPassword,
            address: dto.address?.trim() || null,
            city: dto.city?.trim() || 'New York',
        };
        await this.prisma.emailOtp.deleteMany({
            where: { email: cleanEmail, type: 'REGISTER' },
        });
        await this.prisma.emailOtp.create({
            data: {
                email: cleanEmail,
                code: otpCode,
                type: 'REGISTER',
                data: JSON.stringify(pendingData),
                expiresAt,
            },
        });
        await this.mailService.sendRegisterOtp(cleanEmail, otpCode, dto.name);
        return {
            success: true,
            message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox or spam folder.`,
            email: cleanEmail,
            phone: cleanPhone,
        };
    }
    async verifyRegisterOtp(dto) {
        if (!dto.email || !dto.code) {
            throw new BadRequestException('Email and verification code are required.');
        }
        const cleanEmail = dto.email.trim().toLowerCase();
        const cleanCode = dto.code.trim();
        const otpRecord = await this.prisma.emailOtp.findFirst({
            where: {
                email: cleanEmail,
                type: 'REGISTER',
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!otpRecord) {
            throw new BadRequestException('No pending verification found for this email. Please request a new verification code.');
        }
        if (new Date() > otpRecord.expiresAt) {
            await this.prisma.emailOtp.delete({ where: { id: otpRecord.id } });
            throw new BadRequestException('Verification code has expired. Please request a new one.');
        }
        if (otpRecord.code !== cleanCode) {
            throw new BadRequestException('Incorrect verification code. Please check your email and try again.');
        }
        const pendingData = JSON.parse(otpRecord.data || '{}');
        if (!pendingData.phone || !pendingData.email) {
            throw new BadRequestException('Registration session corrupted. Please start registration again.');
        }
        const duplicatePhone = await this.prisma.user.findUnique({
            where: { phone: pendingData.phone },
        });
        if (duplicatePhone) {
            throw new BadRequestException('An account with this phone number already exists.');
        }
        const user = await this.prisma.user.create({
            data: {
                phone: pendingData.phone,
                name: pendingData.name,
                email: pendingData.email,
                password: pendingData.password,
                address: pendingData.address,
                city: pendingData.city,
                verified: true,
                verifiedAt: new Date(),
                role: 'CLIENT',
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                city: true,
                avatar: true,
                verified: true,
                role: true,
                createdAt: true,
            },
        });
        await this.prisma.emailOtp.deleteMany({
            where: { email: cleanEmail, type: 'REGISTER' },
        });
        const token = await this.jwtService.signAsync({
            sub: user.id,
            phone: user.phone,
            role: user.role,
            name: user.name,
            email: user.email,
        });
        return {
            success: true,
            message: `Account verified and created successfully! Welcome to ProductPerks, ${user.name}.`,
            user,
            token,
        };
    }
    async sendForgotPasswordOtp(dto) {
        if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email.trim())) {
            throw new BadRequestException('Please provide a valid registered Gmail / email address.');
        }
        const cleanEmail = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: cleanEmail },
        });
        if (!user) {
            throw new BadRequestException('No registered account was found with this email address.');
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.emailOtp.deleteMany({
            where: { email: cleanEmail, type: 'FORGOT_PASSWORD' },
        });
        await this.prisma.emailOtp.create({
            data: {
                email: cleanEmail,
                code: otpCode,
                type: 'FORGOT_PASSWORD',
                data: JSON.stringify({ userId: user.id, name: user.name }),
                expiresAt,
            },
        });
        await this.mailService.sendForgotPasswordOtp(cleanEmail, otpCode, user.name);
        return {
            success: true,
            message: `Password reset OTP has been sent to ${cleanEmail}. Please enter the 6-digit code.`,
            email: cleanEmail,
        };
    }
    async resetPassword(dto) {
        if (!dto.email || !dto.code || !dto.newPassword) {
            throw new BadRequestException('Email, verification code, and new password are required.');
        }
        if (dto.newPassword.length < 4) {
            throw new BadRequestException('New password must be at least 4 characters long.');
        }
        const cleanEmail = dto.email.trim().toLowerCase();
        const cleanCode = dto.code.trim();
        const otpRecord = await this.prisma.emailOtp.findFirst({
            where: {
                email: cleanEmail,
                type: 'FORGOT_PASSWORD',
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!otpRecord) {
            throw new BadRequestException('No password reset request found for this email. Please request a new code.');
        }
        if (new Date() > otpRecord.expiresAt) {
            await this.prisma.emailOtp.delete({ where: { id: otpRecord.id } });
            throw new BadRequestException('Reset code has expired. Please request a new one.');
        }
        if (otpRecord.code !== cleanCode) {
            throw new BadRequestException('Incorrect verification code. Please check your email.');
        }
        const hashedPassword = bcrypt.hashSync(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { email: cleanEmail },
            data: { password: hashedPassword },
        });
        await this.prisma.emailOtp.deleteMany({
            where: { email: cleanEmail, type: 'FORGOT_PASSWORD' },
        });
        return {
            success: true,
            message: 'Password has been reset successfully! You can now log in with your new password.',
        };
    }
    async register(dto) {
        const phoneCheck = validateAndFormatUsaPhone(dto.phone);
        if (!phoneCheck.isValid) {
            throw new BadRequestException(phoneCheck.error || 'Only USA phone numbers are allowed (+1).');
        }
        const cleanPhone = phoneCheck.formatted;
        if (!dto.password || dto.password.length < 4) {
            throw new BadRequestException('Password must be at least 4 characters.');
        }
        const existing = await this.prisma.user.findUnique({
            where: { phone: cleanPhone },
        });
        if (existing) {
            throw new BadRequestException(`A client is already registered with ${formatUsaPhoneDisplay(cleanPhone)}. Please log in.`);
        }
        const cleanEmail = dto.email ? dto.email.trim().toLowerCase() : null;
        if (cleanEmail) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: cleanEmail },
            });
            if (existingEmail) {
                throw new BadRequestException('An account is already registered with this email address.');
            }
        }
        const hashedPassword = bcrypt.hashSync(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                phone: cleanPhone,
                name: dto.name.trim(),
                password: hashedPassword,
                email: cleanEmail,
                address: dto.address ? dto.address.trim() : null,
                city: dto.city ? dto.city.trim() : 'New York',
                verified: true,
                verifiedAt: new Date(),
                role: 'CLIENT',
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                city: true,
                avatar: true,
                verified: true,
                role: true,
                createdAt: true,
            },
        });
        const token = await this.jwtService.signAsync({
            sub: user.id,
            phone: user.phone,
            role: user.role,
            name: user.name,
            email: user.email,
        });
        return {
            success: true,
            message: 'Account created successfully! Welcome to ProductPerks.',
            user,
            token,
        };
    }
    async login(dto) {
        const input = (dto.phoneOrEmail || dto.phone || dto.email || '').trim();
        if (!input) {
            throw new BadRequestException('Please enter your USA phone number or registered email.');
        }
        if (!dto.password) {
            throw new BadRequestException('Please enter your password.');
        }
        let user = null;
        if (input.includes('@')) {
            user = await this.prisma.user.findUnique({
                where: { email: input.toLowerCase() },
            });
        }
        else {
            const phoneCheck = validateAndFormatUsaPhone(input);
            const searchPhone = phoneCheck.isValid ? phoneCheck.formatted : this.normalizePhone(input);
            user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: searchPhone },
                        { phone: this.normalizePhone(input) },
                        { phone: `+1${this.normalizePhone(input).replace(/^\+?1/, '')}` },
                    ],
                },
            });
        }
        if (!user) {
            throw new UnauthorizedException('No account found with these credentials. Please check or register.');
        }
        if (user.password) {
            const isMatch = bcrypt.compareSync(dto.password, user.password);
            if (!isMatch && dto.password !== user.password) {
                throw new UnauthorizedException('Incorrect password. Please try again or use Forgot Password.');
            }
        }
        const sanitizedUser = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address,
            city: user.city,
            avatar: user.avatar,
            verified: user.verified,
            role: user.role,
            createdAt: user.createdAt,
        };
        const token = await this.jwtService.signAsync({
            sub: user.id,
            phone: user.phone,
            role: user.role,
            name: user.name,
            email: user.email,
        });
        return {
            success: true,
            message: `Welcome back, ${user.name}!`,
            user: sanitizedUser,
            token,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { phone: this.normalizePhone(userId) },
                    { email: userId.toLowerCase() },
                ],
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                city: true,
                avatar: true,
                verified: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found.');
        }
        return user;
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        MailService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map