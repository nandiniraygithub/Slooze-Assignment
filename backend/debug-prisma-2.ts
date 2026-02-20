import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
    const prisma = new PrismaClient();
    console.log('Client initialized with no options');
    prisma.$connect().then(() => console.log('Connected!')).catch(e => console.log('Connect failed:', e.message));
} catch (e) {
    console.log('Failed with no options:', e.message);
}
