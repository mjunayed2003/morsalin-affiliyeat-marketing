import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNotificationDto, BroadcastNotificationDto } from './dto/create-notification.dto.js';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getMessaging, type MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private firebaseApp: App | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.initFirebaseAdmin();
  }

  /**
   * Safe Firebase Admin SDK Initialization
   * Loads credentials securely from environment variables without exposing secrets.
   */
  private initFirebaseAdmin() {
    try {
      const apps = getApps();
      if (apps.length > 0) {
        this.firebaseApp = apps[0] || null;
        return;
      }

      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'free-products-online';
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (clientEmail && rawPrivateKey) {
        const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
        this.firebaseApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        this.logger.log(`🔥 Firebase Admin SDK initialized successfully for project: ${projectId}`);
      } else {
        // Fallback to Application Default Credentials if provided, or passive mode
        try {
          this.firebaseApp = initializeApp({
            projectId,
          });
          this.logger.log(`🔥 Firebase Admin SDK initialized with project ID: ${projectId}`);
        } catch {
          this.logger.warn(
            '⚠️ Firebase Admin SDK initialized in mock/passive mode. ' +
            'Provide FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env for production APNs/FCM delivery.'
          );
        }
      }
    } catch (err: any) {
      this.logger.warn(`Firebase Admin init notice: ${err?.message || err}`);
    }
  }

  /**
   * Register or update an FCM device token (supports multiple devices per user)
   */
  async registerDeviceToken(userId: string, token: string, platform = 'web') {
    if (!token || !userId) return { success: false };

    try {
      const existing = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id FROM "device_tokens" WHERE token = $1 LIMIT 1`,
        token
      );

      const now = new Date();
      if (existing && existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `UPDATE "device_tokens" SET "userId" = $1, "platform" = $2, "updatedAt" = $3 WHERE token = $4`,
          userId,
          platform,
          now,
          token
        );
      } else {
        const id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "device_tokens" ("id", "userId", "token", "platform", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`,
          id,
          userId,
          token,
          platform,
          now,
          now
        );
      }

      this.logger.log(`📱 Device token registered for user: ${userId} (${platform})`);
      return { success: true };
    } catch (err: any) {
      this.logger.error(`Error registering device token: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Unregister / delete a device token (e.g. on user logout)
   */
  async unregisterDeviceToken(token: string) {
    if (!token) return { success: false };
    try {
      await this.prisma.$executeRawUnsafe(`DELETE FROM "device_tokens" WHERE token = $1`, token);
      this.logger.log(`🗑️ Device token removed.`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Fetch device tokens for a specific user
   */
  async getUserDeviceTokens(userId: string): Promise<string[]> {
    try {
      const rows = await this.prisma.$queryRawUnsafe<{ token: string }[]>(
        `SELECT token FROM "device_tokens" WHERE "userId" = $1`,
        userId
      );
      return rows.map((r) => r.token);
    } catch {
      return [];
    }
  }

  /**
   * Fetch device tokens for an entire recipient group ('ALL' | 'CLIENT' | 'ADMIN')
   */
  async getGroupDeviceTokens(group = 'ALL'): Promise<string[]> {
    try {
      let query = `SELECT dt.token FROM "device_tokens" dt`;
      if (group === 'CLIENT' || group === 'ADMIN') {
        query += ` INNER JOIN "users" u ON u.id = dt."userId" WHERE u.role = '${group}'`;
      }
      const rows = await this.prisma.$queryRawUnsafe<{ token: string }[]>(query);
      return rows.map((r) => r.token);
    } catch {
      return [];
    }
  }

  /**
   * Delete invalid or expired tokens returned by FCM delivery errors
   */
  async pruneInvalidTokens(tokens: string[]) {
    if (!tokens || tokens.length === 0) return;
    try {
      const placeholders = tokens.map((_, i) => `$${i + 1}`).join(',');
      await this.prisma.$executeRawUnsafe(
        `DELETE FROM "device_tokens" WHERE token IN (${placeholders})`,
        ...tokens
      );
      this.logger.log(`🧹 Pruned ${tokens.length} invalid/expired device token(s).`);
    } catch (err: any) {
      this.logger.warn(`Failed to prune invalid tokens: ${err.message}`);
    }
  }

  /**
   * Send Push Notification via Firebase Admin SDK in batches of up to 500
   */
  async sendPushNotification(
    tokens: string[],
    payload: {
      title: string;
      body: string;
      image?: string;
      link?: string;
      data?: Record<string, string>;
    }
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!tokens || tokens.length === 0 || !this.firebaseApp) {
      return { successCount: 0, failureCount: 0 };
    }

    const uniqueTokens = Array.from(new Set(tokens.filter(Boolean)));
    if (uniqueTokens.length === 0) return { successCount: 0, failureCount: 0 };

    let totalSuccess = 0;
    let totalFailure = 0;
    const invalidTokens: string[] = [];

    // Chunk in batches of 500 (FCM multicast limit)
    const chunkSize = 500;
    for (let i = 0; i < uniqueTokens.length; i += chunkSize) {
      const batchTokens = uniqueTokens.slice(i, i + chunkSize);

      try {
        const message: MulticastMessage = {
          tokens: batchTokens,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.image || undefined,
          },
          data: {
            url: payload.link || '/chat',
            title: payload.title,
            body: payload.body,
            ...(payload.image ? { image: payload.image } : {}),
            ...(payload.data || {}),
          },
          webpush: {
            fcmOptions: {
              link: payload.link || '/chat',
            },
            notification: {
              icon: '/browser-icon.png',
              badge: '/browser-icon.png',
              ...(payload.image ? { image: payload.image } : {}),
            },
          },
        };

        const messaging = getMessaging(this.firebaseApp);
        const response = await messaging.sendEachForMulticast(message);
        totalSuccess += response.successCount;
        totalFailure += response.failureCount;

        response.responses.forEach((resp: any, idx: number) => {
          if (!resp.success && resp.error) {
            const errorCode = resp.error.code;
            if (
              errorCode === 'messaging/invalid-registration-token' ||
              errorCode === 'messaging/registration-token-not-registered'
            ) {
              const badToken = batchTokens[idx];
              if (badToken) invalidTokens.push(badToken);
            }
          }
        });
      } catch (err: any) {
        this.logger.warn(`Push batch dispatch exception: ${err.message}`);
        totalFailure += batchTokens.length;
      }
    }

    if (invalidTokens.length > 0) {
      await this.pruneInvalidTokens(invalidTokens);
    }

    this.logger.log(`📨 FCM Push results: ${totalSuccess} sent, ${totalFailure} failed.`);
    return { successCount: totalSuccess, failureCount: totalFailure };
  }

  /**
   * Persist a notification and optionally trigger push delivery
   */
  async createNotification(dto: CreateNotificationDto) {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO "notifications" ("id", "title", "body", "type", "recipientId", "sender", "image", "link", "read", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, $9, $10)`,
        id,
        dto.title,
        dto.body,
        dto.type || 'SYSTEM',
        dto.recipientId || null,
        dto.sender || null,
        dto.image || null,
        dto.link || null,
        now,
        now
      );

      const created = {
        id,
        title: dto.title,
        body: dto.body,
        type: dto.type || 'SYSTEM',
        recipientId: dto.recipientId || null,
        sender: dto.sender || null,
        image: dto.image || null,
        link: dto.link || null,
        read: false,
        timestamp: 'Just now',
        createdAt: now.toISOString(),
      };

      // If user-targeted notification, attempt FCM push dispatch
      if (dto.recipientId) {
        const tokens = await this.getUserDeviceTokens(dto.recipientId);
        if (tokens.length > 0) {
          this.sendPushNotification(tokens, {
            title: dto.title,
            body: dto.body,
            image: dto.image,
            link: dto.link,
          }).catch(() => {});
        }
      }

      return created;
    } catch (err: any) {
      this.logger.error(`Error creating notification: ${err.message}`);
      throw err;
    }
  }

  /**
   * Admin broadcast notification to all users or target group
   */
  async broadcastNotification(
    adminUser: { id: string; name?: string; role: string },
    dto: BroadcastNotificationDto
  ) {
    const targetGroup = dto.targetGroup || 'ALL';
    const notifId = `notif_bcast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();

    // 1. Save Announcement in notifications table (recipientId: null indicates broadcast to all)
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "notifications" ("id", "title", "body", "type", "recipientId", "sender", "image", "link", "read", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'ANNOUNCEMENT', NULL, $4, $5, $6, FALSE, $7, $8)`,
      notifId,
      dto.title,
      dto.body,
      adminUser.name || 'Admin',
      dto.image || null,
      dto.link || null,
      now,
      now
    );

    const announcement = {
      id: notifId,
      title: dto.title,
      body: dto.body,
      type: 'ANNOUNCEMENT' as const,
      sender: adminUser.name || 'Admin',
      image: dto.image || null,
      link: dto.link || null,
      isBroadcast: true,
      timestamp: 'Just now',
      createdAt: now.toISOString(),
    };

    // 2. Fetch device tokens for the selected recipient group
    const tokens = await this.getGroupDeviceTokens(targetGroup);

    // 3. Dispatch FCM Push Notifications in background chunks
    let fcmSuccessCount = 0;
    let fcmFailureCount = 0;

    if (tokens.length > 0) {
      const res = await this.sendPushNotification(tokens, {
        title: dto.title,
        body: dto.body,
        image: dto.image,
        link: dto.link || '/',
        data: { broadcastId: notifId },
      });
      fcmSuccessCount = res.successCount;
      fcmFailureCount = res.failureCount;
    }

    // 4. Record audit log
    const auditId = `audit_bcast_${Date.now()}`;
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "broadcast_audit_logs" ("id", "adminId", "adminName", "title", "body", "targetGroup", "recipientsCount", "fcmSuccessCount", "fcmFailureCount", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      auditId,
      adminUser.id,
      adminUser.name || 'Admin',
      dto.title,
      dto.body,
      targetGroup,
      tokens.length,
      fcmSuccessCount,
      fcmFailureCount,
      now
    );

    this.logger.log(`📢 Admin broadcast sent to ${tokens.length} devices (${fcmSuccessCount} delivered)`);

    return {
      success: true,
      notification: announcement,
      recipientsCount: tokens.length,
      fcmSuccessCount,
      fcmFailureCount,
    };
  }

  /**
   * Get user notifications with pagination and per-user read tracking for broadcasts
   */
  async getUserNotifications(userId?: string, page = 1, limit = 30) {
    const offset = (page - 1) * limit;

    try {
      // Query notifications targeted to this user OR global broadcasts (recipientId IS NULL)
      const query = `
        SELECT 
          n.id,
          n.title,
          n.body,
          n.type,
          n."recipientId",
          n.sender,
          n.image,
          n.link,
          CASE 
            WHEN n."recipientId" IS NOT NULL THEN n.read
            WHEN unr.id IS NOT NULL THEN TRUE
            ELSE FALSE
          END AS read,
          n."createdAt",
          n."updatedAt"
        FROM "notifications" n
        LEFT JOIN "user_notifications_read" unr 
          ON unr."notificationId" = n.id AND unr."userId" = $1
        WHERE n."recipientId" = $1 OR n."recipientId" IS NULL
        ORDER BY n."createdAt" DESC
        LIMIT $2 OFFSET $3
      `;

      const rows = await this.prisma.$queryRawUnsafe<any[]>(query, userId || '', limit, offset);

      // Total count
      const totalRows = await this.prisma.$queryRawUnsafe<{ count: string }[]>(
        `SELECT COUNT(*) as count FROM "notifications" WHERE "recipientId" = $1 OR "recipientId" IS NULL`,
        userId || ''
      );
      const total = parseInt(totalRows[0]?.count || '0', 10);

      const formatted = rows.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        type: (r.type?.toLowerCase() || 'system') as any,
        sender: r.sender || 'system',
        image: r.image,
        link: r.link,
        read: Boolean(r.read),
        timestamp: this.formatRelativeTime(r.createdAt),
        createdAt: r.createdAt,
      }));

      return {
        notifications: formatted,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + rows.length < total,
      };
    } catch (err: any) {
      this.logger.warn(`Error getting user notifications: ${err.message}`);
      return { notifications: [], total: 0, page: 1, totalPages: 0, hasMore: false };
    }
  }

  /**
   * Get total unread notifications count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    if (!userId) return 0;
    try {
      const rows = await this.prisma.$queryRawUnsafe<{ count: string }[]>(
        `
        SELECT COUNT(*) as count
        FROM "notifications" n
        LEFT JOIN "user_notifications_read" unr 
          ON unr."notificationId" = n.id AND unr."userId" = $1
        WHERE (n."recipientId" = $1 AND n.read = FALSE)
           OR (n."recipientId" IS NULL AND unr.id IS NULL)
      `,
        userId
      );
      return parseInt(rows[0]?.count || '0', 10);
    } catch {
      return 0;
    }
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    if (!notificationId || !userId) return { success: false };

    try {
      const notifs = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, "recipientId" FROM "notifications" WHERE id = $1 LIMIT 1`,
        notificationId
      );

      if (!notifs || notifs.length === 0) return { success: false };
      const notif = notifs[0];

      if (notif.recipientId) {
        await this.prisma.$executeRawUnsafe(
          `UPDATE "notifications" SET "read" = TRUE, "updatedAt" = $1 WHERE id = $2`,
          new Date(),
          notificationId
        );
      } else {
        // Broadcast notification: record user read receipt
        const id = `read_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "user_notifications_read" ("id", "userId", "notificationId", "readAt")
           VALUES ($1, $2, $3, $4)
           ON CONFLICT ("userId", "notificationId") DO NOTHING`,
          id,
          userId,
          notificationId,
          new Date()
        );
      }

      return { success: true, notificationId };
    } catch (err: any) {
      this.logger.error(`Error marking notification read: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    if (!userId) return { success: false };

    try {
      const now = new Date();

      // 1. Mark all personal notifications as read
      await this.prisma.$executeRawUnsafe(
        `UPDATE "notifications" SET "read" = TRUE, "updatedAt" = $1 WHERE "recipientId" = $2 AND "read" = FALSE`,
        now,
        userId
      );

      // 2. Mark all broadcast notifications as read in user_notifications_read
      const unreadBroadcasts = await this.prisma.$queryRawUnsafe<{ id: string }[]>(
        `
        SELECT n.id FROM "notifications" n
        LEFT JOIN "user_notifications_read" unr ON unr."notificationId" = n.id AND unr."userId" = $1
        WHERE n."recipientId" IS NULL AND unr.id IS NULL
      `,
        userId
      );

      for (const b of unreadBroadcasts) {
        const id = `read_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "user_notifications_read" ("id", "userId", "notificationId", "readAt")
           VALUES ($1, $2, $3, $4)
           ON CONFLICT ("userId", "notificationId") DO NOTHING`,
          id,
          userId,
          b.id,
          now
        );
      }

      return { success: true };
    } catch (err: any) {
      this.logger.error(`Error marking all notifications read: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Get past broadcast audit logs for admin
   */
  async getBroadcastLogs(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    try {
      const logs = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM "broadcast_audit_logs" ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`,
        limit,
        offset
      );
      const totalRows = await this.prisma.$queryRawUnsafe<{ count: string }[]>(
        `SELECT COUNT(*) as count FROM "broadcast_audit_logs"`
      );
      const total = parseInt(totalRows[0]?.count || '0', 10);

      return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      return { logs: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  private formatRelativeTime(dateInput: any): string {
    if (!dateInput) return 'Just now';
    const date = new Date(dateInput);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
