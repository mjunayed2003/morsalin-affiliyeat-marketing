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

  /**
   * Strictly isolated message fetching:
   * - Clients can ONLY see messages matching their exact userId
   * - Admins can see a specific user's thread (if userId passed) or all messages (for admin inbox)
   * - Unauthenticated guests without a userId get []
   */
  async getMessages(
    userId?: string, 
    isAdmin: boolean = false, 
    page?: number, 
    limit?: number
  ) {
    const emptyResult = {
      messages: [],
      total: 0,
      page: 1,
      limit: limit || 50,
      totalPages: 0,
      hasMore: false,
    };

    if (!isAdmin && !userId) {
      return emptyResult;
    }

    const where: any = {};
    if (userId) {
      where.userId = userId;
    } else if (!isAdmin) {
      return emptyResult;
    }

    const pageNum = Math.max(1, page || 1);
    const take = limit ? Math.min(100, Math.max(1, limit)) : 50;
    const skip = (pageNum - 1) * take;

    const [rawMessages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.chatMessage.count({ where }),
    ]);

    // Reverse descending slice into ascending chronological order for chat view
    const messages = rawMessages.reverse().map((m) => this.formatMessage(m));
    const totalPages = Math.ceil(total / take);
    const hasMore = skip + rawMessages.length < total;

    return {
      messages,
      total,
      page: pageNum,
      limit: take,
      totalPages,
      hasMore,
    };
  }

  async createMessage(dto: SendMessageDto) {
    let validUserId: string | null = null;
    if (dto.userId) {
      try {
        const existingUser = await this.prisma.user.findUnique({
          where: { id: dto.userId },
          select: { id: true },
        });
        if (existingUser) {
          validUserId = existingUser.id;
        }
      } catch {
        validUserId = null;
      }
    }

    const created = await this.prisma.chatMessage.create({
      data: {
        sender: dto.sender,
        senderName: dto.senderName || (dto.sender === 'customer' ? 'Reviewer' : 'FreeProducts Support'),
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

  async getLastCustomerMessage(userId?: string) {
    const where: any = { sender: 'customer' };
    if (userId) {
      where.userId = userId;
    }
    return this.prisma.chatMessage.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
    });
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
