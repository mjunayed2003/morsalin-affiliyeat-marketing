import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly reflector;
    private readonly prisma;
    constructor(jwtService: JwtService, reflector: Reflector, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
