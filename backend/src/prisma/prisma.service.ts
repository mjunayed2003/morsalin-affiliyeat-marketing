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
