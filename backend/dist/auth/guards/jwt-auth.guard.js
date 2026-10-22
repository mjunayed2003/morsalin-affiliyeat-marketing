var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    reflector;
    prisma;
    constructor(jwtService, reflector, prisma) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            if (isPublic) {
                return true;
            }
            throw new UnauthorizedException('Authentication token is required to access this resource.');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'morsalin_affiliate_super_secure_jwt_token_secret_key_2026_x87123',
            });
            const userId = (payload.sub || payload.id);
            const dbUser = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    phone: true,
                    role: true,
                    name: true,
                    email: true,
                    status: true,
                    canReview: true,
                },
            });
            if (!dbUser) {
                if (isPublic)
                    return true;
                throw new UnauthorizedException('User account no longer exists.');
            }
            if (dbUser.role !== 'ADMIN') {
                if (dbUser.status === 'PENDING') {
                    throw new UnauthorizedException('Your account is awaiting administrator approval.');
                }
                if (dbUser.status === 'REJECTED') {
                    throw new UnauthorizedException('Your registration was not approved by the administrator.');
                }
                if (dbUser.status === 'BLOCKED') {
                    throw new UnauthorizedException('Your account has been suspended or blocked.');
                }
            }
            request.user = {
                id: dbUser.id,
                phone: dbUser.phone,
                role: dbUser.role,
                name: dbUser.name,
                email: dbUser.email,
                status: dbUser.status,
                canReview: dbUser.canReview,
            };
            return true;
        }
        catch (err) {
            if (isPublic) {
                return true;
            }
            if (err instanceof UnauthorizedException) {
                throw err;
            }
            throw new UnauthorizedException('Invalid, expired, or corrupted authentication token.');
        }
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (authHeader && typeof authHeader === 'string') {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer' && token) {
                return token;
            }
        }
        const customHeader = request.headers['x-access-token'];
        if (customHeader && typeof customHeader === 'string') {
            return customHeader;
        }
        return undefined;
    }
};
JwtAuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService,
        Reflector,
        PrismaService])
], JwtAuthGuard);
export { JwtAuthGuard };
//# sourceMappingURL=jwt-auth.guard.js.map