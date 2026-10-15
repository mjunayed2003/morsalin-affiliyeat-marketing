import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto) {
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

  async findAll(userId?: string) {
    const where: any = {};
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

  async updateStatus(id: string, status: any) {
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
}
