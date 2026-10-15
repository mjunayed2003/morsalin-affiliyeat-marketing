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
import bcrypt from 'bcryptjs';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    normalizePhone(phone) {
        return phone.replace(/[\s\-()]/g, '').trim();
    }
    async register(dto) {
        const cleanPhone = this.normalizePhone(dto.phone);
        if (!cleanPhone || cleanPhone.length < 7) {
            throw new BadRequestException('Phone number must have at least 7 digits.');
        }
        if (!dto.password || dto.password.length < 4) {
            throw new BadRequestException('Password must be at least 4 characters.');
        }
        const existing = await this.prisma.user.findUnique({
            where: { phone: cleanPhone },
        });
        if (existing) {
            throw new BadRequestException('A client is already registered with this phone number. Please log in.');
        }
        const hashedPassword = bcrypt.hashSync(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                phone: cleanPhone,
                name: dto.name.trim(),
                password: hashedPassword,
                email: dto.email ? dto.email.trim() : null,
                address: dto.address ? dto.address.trim() : null,
                city: dto.city ? dto.city.trim() : 'Dhaka',
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
        const cleanPhone = this.normalizePhone(dto.phone);
        const user = await this.prisma.user.findUnique({
            where: { phone: cleanPhone },
        });
        if (!user) {
            throw new UnauthorizedException('No account found with this phone number. Please register.');
        }
        if (user.password) {
            const isMatch = bcrypt.compareSync(dto.password, user.password);
            if (!isMatch && dto.password !== user.password) {
                throw new UnauthorizedException('Incorrect password. Please try again.');
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
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map