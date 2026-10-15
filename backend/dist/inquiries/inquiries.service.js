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
let InquiriesService = class InquiriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.inquiry.create({
            data: {
                userId: dto.userId,
                productId: dto.productId,
                notes: dto.notes,
                amazonOrderId: dto.amazonOrderId,
                status: 'PENDING',
            },
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });
    }
    async findAll(userId) {
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        return this.prisma.inquiry.findMany({
            where,
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status) {
        const inquiry = await this.prisma.inquiry.findUnique({
            where: { id },
        });
        if (!inquiry) {
            throw new NotFoundException(`Inquiry with ID "${id}" not found`);
        }
        return this.prisma.inquiry.update({
            where: { id },
            data: { status },
            include: {
                product: true,
            },
        });
    }
};
InquiriesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], InquiriesService);
export { InquiriesService };
//# sourceMappingURL=inquiries.service.js.map