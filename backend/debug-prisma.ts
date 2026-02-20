import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
    const prisma = new PrismaClient({
        // @ts-ignore
        datasourceUrl: process.env.DATABASE_URL
    });
    console.log('Client initialized with datasourceUrl');
} catch (e) {
    console.log('Failed with datasourceUrl:', e.message);
}

try {
    const prisma = new PrismaClient({
        // @ts-ignore
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });
    console.log('Client initialized with datasources.db.url');
} catch (e) {
    console.log('Failed with datasources.db.url:', e.message);
}
