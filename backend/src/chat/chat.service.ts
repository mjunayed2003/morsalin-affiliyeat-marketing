import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private formatMessage(msg: any) {
    const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      id: msg.id,
      sender: msg.sender,
      senderName: msg.senderName,
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

  async getMessages(userId?: string) {
    const where: any = {};
    if (userId) {
      where.OR = [{ userId }, { userId: null }];
    }

    const messages = await this.prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => this.formatMessage(m));
  }

  async createMessage(dto: SendMessageDto) {
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
        userId: dto.userId || null,
      },
    });

    return this.formatMessage(created);
  }

  async clearMessages(userId?: string) {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    await this.prisma.chatMessage.deleteMany({ where });

    return { success: true, message: 'Chat messages cleared successfully.' };
  }

  async markAsRead(ids?: string[]) {
    if (ids && ids.length > 0) {
      await this.prisma.chatMessage.updateMany({
        where: { id: { in: ids } },
        data: { read: true },
      });
    } else {
      await this.prisma.chatMessage.updateMany({
        data: { read: true },
      });
    }

    return { success: true };
  }
}
