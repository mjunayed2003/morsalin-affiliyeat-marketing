var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(role) {
        const where = {};
        if (role) {
            where.role = role.toUpperCase();
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                city: true,
                avatar: true,
                selfieImage: true,
                verified: true,
                verifiedAt: true,
                role: true,
                canReview: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                city: true,
                avatar: true,
                selfieImage: true,
                verified: true,
                verifiedAt: true,
                role: true,
                canReview: true,
                createdAt: true,
                updatedAt: true,
                inquiries: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async updateRole(id, role) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
    async updateReviewPermission(id, canReview) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { canReview },
        });
    }
    async updateSelfie(id, selfieImage) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: {
                selfieImage,
                avatar: selfieImage
            },
        });
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map