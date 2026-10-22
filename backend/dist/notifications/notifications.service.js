var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    logger = new Logger(NotificationsService_1.name);
    firebaseApp = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        this.initFirebaseAdmin();
    }
    initFirebaseAdmin() {
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
            }
            else {
                try {
                    this.firebaseApp = initializeApp({
                        projectId,
                    });
                    this.logger.log(`🔥 Firebase Admin SDK initialized with project ID: ${projectId}`);
                }
                catch {
                    this.logger.warn('⚠️ Firebase Admin SDK initialized in mock/passive mode. ' +
                        'Provide FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env for production APNs/FCM delivery.');
                }
            }
        }
        catch (err) {
            this.logger.warn(`Firebase Admin init notice: ${err?.message || err}`);
        }
    }
    async registerDeviceToken(userId, token, platform = 'web') {
        if (!token || !userId)
            return { success: false };
        try {
            const existing = await this.prisma.$queryRawUnsafe(`SELECT id FROM "device_tokens" WHERE token = $1 LIMIT 1`, token);
            const now = new Date();
            if (existing && existing.length > 0) {
                await this.prisma.$executeRawUnsafe(`UPDATE "device_tokens" SET "userId" = $1, "platform" = $2, "updatedAt" = $3 WHERE token = $4`, userId, platform, now, token);
            }
            else {
                const id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                await this.prisma.$executeRawUnsafe(`INSERT INTO "device_tokens" ("id", "userId", "token", "platform", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`, id, userId, token, platform, now, now);
            }
            this.logger.log(`📱 Device token registered for user: ${userId} (${platform})`);
            return { success: true };
        }
        catch (err) {
            this.logger.error(`Error registering device token: ${err.message}`);
            return { success: false, error: err.message };
        }
    }
    async unregisterDeviceToken(token) {
        if (!token)
            return { success: false };
        try {
            await this.prisma.$executeRawUnsafe(`DELETE FROM "device_tokens" WHERE token = $1`, token);
            this.logger.log(`🗑️ Device token removed.`);
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }
    async getUserDeviceTokens(userId) {
        try {
            const rows = await this.prisma.$queryRawUnsafe(`SELECT token FROM "device_tokens" WHERE "userId" = $1`, userId);
            return rows.map((r) => r.token);
        }
        catch {
            return [];
        }
    }
    async getGroupDeviceTokens(group = 'ALL') {
        try {
            let query = `SELECT dt.token FROM "device_tokens" dt`;
            if (group === 'CLIENT' || group === 'ADMIN') {
                query += ` INNER JOIN "users" u ON u.id = dt."userId" WHERE u.role = '${group}'`;
            }
            const rows = await this.prisma.$queryRawUnsafe(query);
            return rows.map((r) => r.token);
        }
        catch {
            return [];
        }
    }
    async pruneInvalidTokens(tokens) {
        if (!tokens || tokens.length === 0)
            return;
        try {
            const placeholders = tokens.map((_, i) => `$${i + 1}`).join(',');
            await this.prisma.$executeRawUnsafe(`DELETE FROM "device_tokens" WHERE token IN (${placeholders})`, ...tokens);
            this.logger.log(`🧹 Pruned ${tokens.length} invalid/expired device token(s).`);
        }
        catch (err) {
            this.logger.warn(`Failed to prune invalid tokens: ${err.message}`);
        }
    }
    async sendPushNotification(tokens, payload) {
        if (!tokens || tokens.length === 0 || !this.firebaseApp) {
            return { successCount: 0, failureCount: 0 };
        }
        const uniqueTokens = Array.from(new Set(tokens.filter(Boolean)));
        if (uniqueTokens.length === 0)
            return { successCount: 0, failureCount: 0 };
        let totalSuccess = 0;
        let totalFailure = 0;
        const invalidTokens = [];
        const chunkSize = 500;
        for (let i = 0; i < uniqueTokens.length; i += chunkSize) {
            const batchTokens = uniqueTokens.slice(i, i + chunkSize);
            try {
                const message = {
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
                response.responses.forEach((resp, idx) => {
                    if (!resp.success && resp.error) {
                        const errorCode = resp.error.code;
                        if (errorCode === 'messaging/invalid-registration-token' ||
                            errorCode === 'messaging/registration-token-not-registered') {
                            const badToken = batchTokens[idx];
                            if (badToken)
                                invalidTokens.push(badToken);
                        }
                    }
                });
            }
            catch (err) {
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
    async createNotification(dto) {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date();
        try {
            await this.prisma.$executeRawUnsafe(`INSERT INTO "notifications" ("id", "title", "body", "type", "recipientId", "sender", "image", "link", "read", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, $9, $10)`, id, dto.title, dto.body, dto.type || 'SYSTEM', dto.recipientId || null, dto.sender || null, dto.image || null, dto.link || null, now, now);
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
            if (dto.recipientId) {
                const tokens = await this.getUserDeviceTokens(dto.recipientId);
                if (tokens.length > 0) {
                    this.sendPushNotification(tokens, {
                        title: dto.title,
                        body: dto.body,
                        image: dto.image,
                        link: dto.link,
                    }).catch(() => { });
                }
            }
            return created;
        }
        catch (err) {
            this.logger.error(`Error creating notification: ${err.message}`);
            throw err;
        }
    }
    async broadcastNotification(adminUser, dto) {
        const targetGroup = dto.targetGroup || 'ALL';
        const notifId = `notif_bcast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const now = new Date();
        await this.prisma.$executeRawUnsafe(`INSERT INTO "notifications" ("id", "title", "body", "type", "recipientId", "sender", "image", "link", "read", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'ANNOUNCEMENT', NULL, $4, $5, $6, FALSE, $7, $8)`, notifId, dto.title, dto.body, adminUser.name || 'Admin', dto.image || null, dto.link || null, now, now);
        const announcement = {
            id: notifId,
            title: dto.title,
            body: dto.body,
            type: 'ANNOUNCEMENT',
            sender: adminUser.name || 'Admin',
            image: dto.image || null,
            link: dto.link || null,
            isBroadcast: true,
            timestamp: 'Just now',
            createdAt: now.toISOString(),
        };
        const tokens = await this.getGroupDeviceTokens(targetGroup);
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
        const auditId = `audit_bcast_${Date.now()}`;
        await this.prisma.$executeRawUnsafe(`INSERT INTO "broadcast_audit_logs" ("id", "adminId", "adminName", "title", "body", "targetGroup", "recipientsCount", "fcmSuccessCount", "fcmFailureCount", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, auditId, adminUser.id, adminUser.name || 'Admin', dto.title, dto.body, targetGroup, tokens.length, fcmSuccessCount, fcmFailureCount, now);
        this.logger.log(`📢 Admin broadcast sent to ${tokens.length} devices (${fcmSuccessCount} delivered)`);
        return {
            success: true,
            notification: announcement,
            recipientsCount: tokens.length,
            fcmSuccessCount,
            fcmFailureCount,
        };
    }
    async getUserNotifications(userId, page = 1, limit = 30) {
        const offset = (page - 1) * limit;
        try {
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
            const rows = await this.prisma.$queryRawUnsafe(query, userId || '', limit, offset);
            const totalRows = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "notifications" WHERE "recipientId" = $1 OR "recipientId" IS NULL`, userId || '');
            const total = parseInt(totalRows[0]?.count || '0', 10);
            const formatted = rows.map((r) => ({
                id: r.id,
                title: r.title,
                body: r.body,
                type: (r.type?.toLowerCase() || 'system'),
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
        }
        catch (err) {
            this.logger.warn(`Error getting user notifications: ${err.message}`);
            return { notifications: [], total: 0, page: 1, totalPages: 0, hasMore: false };
        }
    }
    async getUnreadCount(userId) {
        if (!userId)
            return 0;
        try {
            const rows = await this.prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count
        FROM "notifications" n
        LEFT JOIN "user_notifications_read" unr 
          ON unr."notificationId" = n.id AND unr."userId" = $1
        WHERE (n."recipientId" = $1 AND n.read = FALSE)
           OR (n."recipientId" IS NULL AND unr.id IS NULL)
      `, userId);
            return parseInt(rows[0]?.count || '0', 10);
        }
        catch {
            return 0;
        }
    }
    async markAsRead(notificationId, userId) {
        if (!notificationId || !userId)
            return { success: false };
        try {
            const notifs = await this.prisma.$queryRawUnsafe(`SELECT id, "recipientId" FROM "notifications" WHERE id = $1 LIMIT 1`, notificationId);
            if (!notifs || notifs.length === 0)
                return { success: false };
            const notif = notifs[0];
            if (notif.recipientId) {
                await this.prisma.$executeRawUnsafe(`UPDATE "notifications" SET "read" = TRUE, "updatedAt" = $1 WHERE id = $2`, new Date(), notificationId);
            }
            else {
                const id = `read_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                await this.prisma.$executeRawUnsafe(`INSERT INTO "user_notifications_read" ("id", "userId", "notificationId", "readAt")
           VALUES ($1, $2, $3, $4)
           ON CONFLICT ("userId", "notificationId") DO NOTHING`, id, userId, notificationId, new Date());
            }
            return { success: true, notificationId };
        }
        catch (err) {
            this.logger.error(`Error marking notification read: ${err.message}`);
            return { success: false, error: err.message };
        }
    }
    async markAllAsRead(userId) {
        if (!userId)
            return { success: false };
        try {
            const now = new Date();
            await this.prisma.$executeRawUnsafe(`UPDATE "notifications" SET "read" = TRUE, "updatedAt" = $1 WHERE "recipientId" = $2 AND "read" = FALSE`, now, userId);
            const unreadBroadcasts = await this.prisma.$queryRawUnsafe(`
        SELECT n.id FROM "notifications" n
        LEFT JOIN "user_notifications_read" unr ON unr."notificationId" = n.id AND unr."userId" = $1
        WHERE n."recipientId" IS NULL AND unr.id IS NULL
      `, userId);
            for (const b of unreadBroadcasts) {
                const id = `read_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                await this.prisma.$executeRawUnsafe(`INSERT INTO "user_notifications_read" ("id", "userId", "notificationId", "readAt")
           VALUES ($1, $2, $3, $4)
           ON CONFLICT ("userId", "notificationId") DO NOTHING`, id, userId, b.id, now);
            }
            return { success: true };
        }
        catch (err) {
            this.logger.error(`Error marking all notifications read: ${err.message}`);
            return { success: false, error: err.message };
        }
    }
    async getBroadcastLogs(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        try {
            const logs = await this.prisma.$queryRawUnsafe(`SELECT * FROM "broadcast_audit_logs" ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`, limit, offset);
            const totalRows = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "broadcast_audit_logs"`);
            const total = parseInt(totalRows[0]?.count || '0', 10);
            return {
                logs,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch {
            return { logs: [], total: 0, page: 1, totalPages: 0 };
        }
    }
    formatRelativeTime(dateInput) {
        if (!dateInput)
            return 'Just now';
        const date = new Date(dateInput);
        const diff = Math.floor((Date.now() - date.getTime()) / 1000);
        if (diff < 60)
            return 'Just now';
        if (diff < 3600)
            return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400)
            return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
};
NotificationsService = NotificationsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map