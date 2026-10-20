import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(role?: string) {
    const where: any = {};
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

  async findOne(id: string) {
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

  async updateRole(id: string, role: 'CLIENT' | 'ADMIN') {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateReviewPermission(id: string, canReview: boolean) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { canReview },
    });
  }

  async updateSelfie(id: string, selfieImage: string) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { 
        selfieImage, 
        avatar: selfieImage 
      },
    });
  }
}
