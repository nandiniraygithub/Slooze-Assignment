import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // Always update passwords to ensure they are bcrypt-hashed correctly
  const managerPassword = await bcrypt.hash('password123', 10);
  const keeperPassword = await bcrypt.hash('password123', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@slooze.com' },
    update: {
      password: managerPassword,
      role: 'MANAGER',
    },
    create: {
      email: 'manager@slooze.com',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  const storeKeeper = await prisma.user.upsert({
    where: { email: 'store@slooze.com' },
    update: {
      password: keeperPassword,
      role: 'STORE_KEEPER',
    },
    create: {
      email: 'store@slooze.com',
      password: keeperPassword,
      role: 'STORE_KEEPER',
    },
  });

  console.log('✅ Created/updated users:', {
    manager: manager.email,
    storeKeeper: storeKeeper.email,
  });

  //   // Create sample products only if they don't exist
  //   const existingProducts = await prisma.product.count();
  //   if (existingProducts === 0) {
  //     const products = [
  //       { name: 'Wheat', price: 50, quantity: 100, createdById: manager.id },
  //       { name: 'Rice', price: 60, quantity: 80, createdById: manager.id },
  //       { name: 'Corn', price: 45, quantity: 120, createdById: storeKeeper.id },
  //       { name: 'Barley', price: 55, quantity: 60, createdById: storeKeeper.id },
  //     ];
  //     for (const product of products) {
  //       await prisma.product.create({ data: product });
  //     }
  //     console.log('✅ Created products:', products.length);
  //   } else {
  //     console.log('ℹ️  Products already exist, skipping product seed.');
  //   }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
