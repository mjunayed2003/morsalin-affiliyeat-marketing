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
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';
let UsersService = class UsersService {
    prisma;
    notificationsService;
    chatGateway;
    constructor(prisma, notificationsService, chatGateway) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.chatGateway = chatGateway;
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
                amazonProfileUrl: true,
                paypalEmail: true,
                verified: true,
                verifiedAt: true,
                role: true,
                status: true,
                reviewedAt: true,
                reviewedBy: true,
                rejectionReason: true,
                canReview: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPendingRegistrations(page = 1, limit = 10, search = '') {
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
        const skip = (pageNum - 1) * limitNum;
        const where = {
            status: 'PENDING',
        };
        if (search && search.trim()) {
            const q = search.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
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
                    amazonProfileUrl: true,
                    paypalEmail: true,
                    verified: true,
                    verifiedAt: true,
                    role: true,
                    status: true,
                    reviewedAt: true,
                    reviewedBy: true,
                    rejectionReason: true,
                    canReview: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum) || 1,
        };
    }
    async getPendingCount() {
        const count = await this.prisma.user.count({
            where: { status: 'PENDING' },
        });
        return { count };
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
                amazonProfileUrl: true,
                paypalEmail: true,
                verified: true,
                verifiedAt: true,
                role: true,
                status: true,
                reviewedAt: true,
                reviewedBy: true,
                rejectionReason: true,
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
    async approveRegistration(id, adminUser) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found.`);
        }
        if (user.status === 'ACTIVE') {
            throw new BadRequestException('This account is already approved and active.');
        }
        const reviewerName = adminUser.name || adminUser.email || adminUser.id || 'Admin';
        const now = new Date();
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                status: 'ACTIVE',
                reviewedAt: now,
                reviewedBy: reviewerName,
                rejectionReason: null,
            },
        });
        try {
            await this.notificationsService.createNotification({
                recipientId: updated.id,
                title: 'Account Approved! 🎉',
                body: 'Congratulations! Your account registration has been approved by an administrator. You can now log in.',
                type: 'SYSTEM',
                link: '/login',
            });
        }
        catch { }
        if (this.chatGateway?.server) {
            this.chatGateway.server.to(`room_${updated.id}`).emit('registration:status', {
                status: 'ACTIVE',
                message: 'Your registration has been approved by an administrator!',
                reviewedAt: updated.reviewedAt,
                reviewedBy: updated.reviewedBy,
            });
            this.chatGateway.server.to('admin_room').emit('registration:approved', {
                userId: updated.id,
                status: 'ACTIVE',
                reviewedBy: reviewerName,
                user: {
                    id: updated.id,
                    name: updated.name,
                    email: updated.email,
                    status: updated.status,
                },
            });
        }
        return {
            success: true,
            message: `Registration for ${updated.name} has been approved successfully.`,
            user: updated,
        };
    }
    async rejectRegistration(id, adminUser, reason) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found.`);
        }
        const reviewerName = adminUser.name || adminUser.email || adminUser.id || 'Admin';
        const rejectionReason = reason?.trim() || 'Registration criteria not met. Please contact support.';
        const now = new Date();
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                status: 'REJECTED',
                reviewedAt: now,
                reviewedBy: reviewerName,
                rejectionReason,
            },
        });
        try {
            await this.notificationsService.createNotification({
                recipientId: updated.id,
                title: 'Registration Status: Not Approved',
                body: `Your registration was not approved. Reason: ${rejectionReason}`,
                type: 'SYSTEM',
                link: '/pending-approval',
            });
        }
        catch { }
        if (this.chatGateway?.server) {
            this.chatGateway.server.to(`room_${updated.id}`).emit('registration:status', {
                status: 'REJECTED',
                message: `Your registration was not approved: ${rejectionReason}`,
                rejectionReason,
                reviewedAt: updated.reviewedAt,
                reviewedBy: updated.reviewedBy,
            });
            this.chatGateway.server.to('admin_room').emit('registration:rejected', {
                userId: updated.id,
                status: 'REJECTED',
                rejectionReason,
                reviewedBy: reviewerName,
                user: {
                    id: updated.id,
                    name: updated.name,
                    email: updated.email,
                    status: updated.status,
                },
            });
        }
        return {
            success: true,
            message: `Registration for ${updated.name} has been rejected.`,
            user: updated,
        };
    }
    async updateRole(id, role) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
    async updateStatus(id, status, adminUser) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: {
                status,
                reviewedAt: new Date(),
                reviewedBy: adminUser?.name || 'Admin',
            },
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
    async updateFcmToken(id, fcmToken) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { fcmToken },
        });
    }
};
UsersService = __decorate([
    Injectable(),
    __param(2, Inject(forwardRef(() => ChatGateway))),
    __metadata("design:paramtypes", [PrismaService,
        NotificationsService,
        ChatGateway])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map