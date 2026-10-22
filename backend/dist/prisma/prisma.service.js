var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
let PrismaService = PrismaService_1 = class PrismaService extends PrismaClient {
    logger = new Logger(PrismaService_1.name);
    constructor() {
        const connectionString = process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/freeproducts?schema=public';
        const adapter = new PrismaPg({ connectionString });
        super({ adapter });
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Successfully connected to PostgreSQL via Prisma 7 PG Driver Adapter.');
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
            }
            catch (schemaErr) {
                this.logger.warn(`Schema sync note: ${schemaErr?.message || schemaErr}`);
            }
        }
        catch (error) {
            this.logger.warn(`⚠️ Database connection notice: ${error instanceof Error ? error.message : error}. ` +
                `Ensure your PostgreSQL database is running and DATABASE_URL in .env is configured.`);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
PrismaService = PrismaService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PrismaService);
export { PrismaService };
//# sourceMappingURL=prisma.service.js.map