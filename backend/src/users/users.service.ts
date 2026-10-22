import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

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

  /**
   * List registrations awaiting admin approval with pagination & search
   */
  async findPendingRegistrations(page = 1, limit = 10, search = '') {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
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

  /**
   * Pending registrations count badge for admin panel navigation
   */
  async getPendingCount() {
    const count = await this.prisma.user.count({
      where: { status: 'PENDING' },
    });
    return { count };
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

  /**
   * Admin approves a pending user registration
   */
  async approveRegistration(id: string, adminUser: { id: string; name?: string; email?: string }) {
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

    // 1. Create in-app and FCM push notification for the approved user
    try {
      await this.notificationsService.createNotification({
        recipientId: updated.id,
        title: 'Account Approved! 🎉',
        body: 'Congratulations! Your account registration has been approved by an administrator. You can now log in.',
        type: 'SYSTEM',
        link: '/login',
      });
    } catch {}

    // 2. Real-time Socket.IO notification
    if (this.chatGateway?.server) {
      // Direct to user's personal room
      this.chatGateway.server.to(`room_${updated.id}`).emit('registration:status', {
        status: 'ACTIVE',
        message: 'Your registration has been approved by an administrator!',
        reviewedAt: updated.reviewedAt,
        reviewedBy: updated.reviewedBy,
      });

      // Update admin room
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

  /**
   * Admin rejects a pending user registration
   */
  async rejectRegistration(id: string, adminUser: { id: string; name?: string; email?: string }, reason?: string) {
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

    // 1. In-app and push notification
    try {
      await this.notificationsService.createNotification({
        recipientId: updated.id,
        title: 'Registration Status: Not Approved',
        body: `Your registration was not approved. Reason: ${rejectionReason}`,
        type: 'SYSTEM',
        link: '/pending-approval',
      });
    } catch {}

    // 2. Real-time Socket.IO notification
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

  async updateRole(id: string, role: 'CLIENT' | 'ADMIN') {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'BLOCKED', adminUser?: { id: string; name?: string }) {
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

  async updateFcmToken(id: string, fcmToken: string) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { fcmToken },
    });
  }
}

