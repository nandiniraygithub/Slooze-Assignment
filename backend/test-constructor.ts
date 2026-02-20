import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const attempts = [
    { name: 'no options', opts: {} },
    { name: 'datasource singular', opts: { datasource: { url: process.env.DATABASE_URL } } },
    { name: 'datasources plural', opts: { datasources: { db: { url: process.env.DATABASE_URL } } } },
    { name: 'datasourceUrl', opts: { datasourceUrl: process.env.DATABASE_URL } },
    { name: 'accelerateUrl', opts: { accelerateUrl: process.env.DATABASE_URL } },
];

async function test() {
    for (const attempt of attempts) {
        try {
            console.log(`--- Testing ${attempt.name} ---`);
            // @ts-ignore
            const prisma = new PrismaClient(attempt.opts);
            console.log('Constructor OK');
            await prisma.$connect();
            console.log('Connection OK');
            await prisma.$disconnect();
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

test();
