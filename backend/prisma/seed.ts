import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = 
  process.env.DATABASE_URL || 
  'postgresql://postgres:postgres@localhost:5432/freeproducts?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Clean initial products - products are created through the admin console directly into the database.
const INITIAL_PRODUCTS: any[] = [];

async function main() {
  console.log('🌱 Checking database product catalog...');

  for (const item of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
