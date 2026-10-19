var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    formatMessage(msg) {
        const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        return {
            id: msg.id,
            sender: msg.sender,
            senderName: msg.user?.name || msg.senderName,
            userPhone: msg.user?.phone || undefined,
            userEmail: msg.user?.email || undefined,
            text: msg.text,
            image: msg.image || undefined,
            productInfo: msg.productTitle
                ? {
                    id: msg.productId || undefined,
                    title: msg.productTitle,
                    price: msg.productPrice || 0,
                    image: msg.productImage || '',
                }
                : undefined,
            timestamp: timeString,
            read: msg.read,
            userId: msg.userId,
            createdAt: msg.createdAt,
        };
    }
    async getMessages(userId) {
        const where = {};
        if (userId) {
            where.OR = [{ userId }, { userId: null }];
        }
        const messages = await this.prisma.chatMessage.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return messages.map((m) => this.formatMessage(m));
    }
    async createMessage(dto) {
        let validUserId = null;
        if (dto.userId) {
            try {
                const existingUser = await this.prisma.user.findUnique({
                    where: { id: dto.userId },
                    select: { id: true },
                });
                if (existingUser) {
                    validUserId = existingUser.id;
                }
            }
            catch {
                validUserId = null;
            }
        }
        const created = await this.prisma.chatMessage.create({
            data: {
                sender: dto.sender,
                senderName: dto.senderName || (dto.sender === 'customer' ? 'Reviewer' : 'ProductPerks Admin'),
                text: dto.text,
                image: dto.image || null,
                productId: dto.productInfo?.id || null,
                productTitle: dto.productInfo?.title || null,
                productPrice: dto.productInfo?.price !== undefined ? dto.productInfo.price : null,
                productImage: dto.productInfo?.image || null,
                read: dto.sender === 'admin',
                userId: validUserId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        });
        return {
            ...this.formatMessage(created),
            localId: dto.localId,
        };
    }
    async getLastCustomerMessage(userId) {
        const where = { sender: 'customer' };
        if (userId) {
            where.userId = userId;
        }
        return this.prisma.chatMessage.findFirst({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async clearMessages(userId) {
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        await this.prisma.chatMessage.deleteMany({ where });
        return { success: true, message: 'Chat messages cleared successfully.' };
    }
    async markAsRead(ids) {
        if (ids && ids.length > 0) {
            await this.prisma.chatMessage.updateMany({
                where: { id: { in: ids } },
                data: { read: true },
            });
        }
        else {
            await this.prisma.chatMessage.updateMany({
                data: { read: true },
            });
        }
        return { success: true };
    }
};
ChatService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ChatService);
export { ChatService };
//# sourceMappingURL=chat.service.js.map