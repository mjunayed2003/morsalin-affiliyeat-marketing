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
        `);
        this.logger.log('✅ Database schema verified: chat_messages status/receipts and calls history active.');
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
