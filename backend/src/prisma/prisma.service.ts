import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = 
      process.env.DATABASE_URL || 
      'postgresql://postgres:postgres@localhost:5432/freeproducts?schema=public';
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to PostgreSQL via Prisma 7 PG Driver Adapter.');

      // Ensure message read/delivery receipt columns and call history table exist
      try {
        await this.$executeRawUnsafe(`
          ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE';
          ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);
          ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;
          ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
          UPDATE "users" SET "status" = 'ACTIVE' WHERE "status" IS NULL;
          CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users"("status");

          ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'SENT';
          ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3);
          ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "seenAt" TIMESTAMP(3);

          CREATE TABLE IF NOT EXISTS "calls" (
            "id" TEXT PRIMARY KEY,
            "callerId" TEXT NOT NULL,
            "callerName" TEXT,
            "callerRole" TEXT DEFAULT 'customer',
            "receiverId" TEXT,
            "receiverName" TEXT,
            "status" TEXT NOT NULL DEFAULT 'COMPLETED',
            "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "endedAt" TIMESTAMP(3),
            "duration" INTEGER NOT NULL DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS "notifications" (
            "id" TEXT PRIMARY KEY,
            "title" TEXT NOT NULL,
            "body" TEXT NOT NULL,
            "type" TEXT NOT NULL DEFAULT 'SYSTEM',
            "recipientId" TEXT,
            "sender" TEXT,
            "image" TEXT,
            "link" TEXT,
            "read" BOOLEAN NOT NULL DEFAULT FALSE,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
          CREATE INDEX IF NOT EXISTS "idx_notifications_recipientId" ON "notifications"("recipientId");
          CREATE INDEX IF NOT EXISTS "idx_notifications_createdAt" ON "notifications"("createdAt");

          CREATE TABLE IF NOT EXISTS "device_tokens" (
            "id" TEXT PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "token" TEXT NOT NULL UNIQUE,
            "platform" TEXT DEFAULT 'web',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
          CREATE INDEX IF NOT EXISTS "idx_device_tokens_userId" ON "device_tokens"("userId");

          CREATE TABLE IF NOT EXISTS "user_notifications_read" (
            "id" TEXT PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "notificationId" TEXT NOT NULL,
            "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE("userId", "notificationId")
          );
          CREATE INDEX IF NOT EXISTS "idx_user_notifications_read_user" ON "user_notifications_read"("userId");

          CREATE TABLE IF NOT EXISTS "broadcast_audit_logs" (
            "id" TEXT PRIMARY KEY,
            "adminId" TEXT NOT NULL,
            "adminName" TEXT,
            "title" TEXT NOT NULL,
            "body" TEXT NOT NULL,
            "targetGroup" TEXT NOT NULL DEFAULT 'ALL',
            "recipientsCount" INTEGER NOT NULL DEFAULT 0,
            "fcmSuccessCount" INTEGER NOT NULL DEFAULT 0,
            "fcmFailureCount" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
          CREATE INDEX IF NOT EXISTS "idx_broadcast_audit_logs_createdAt" ON "broadcast_audit_logs"("createdAt");
        `);
        this.logger.log('✅ Database schema verified: notifications, device_tokens, and broadcast tables active.');
      } catch (schemaErr: any) {
        this.logger.warn(`Schema sync note: ${schemaErr?.message || schemaErr}`);
      }
    } catch (error) {
      this.logger.warn(
        `⚠️ Database connection notice: ${error instanceof Error ? error.message : error}. ` +
        `Ensure your PostgreSQL database is running and DATABASE_URL in .env is configured.`
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
