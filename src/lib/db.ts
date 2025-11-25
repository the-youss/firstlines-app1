import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../../prisma/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const client = new PrismaClient({
  adapter,
  // omit: {
  //   user: {
  //     password: true
  //   }
  // },
  errorFormat: 'pretty',
  transactionOptions: {
    maxWait: 10 * 60 * 1000,
    timeout: 10 * 60 * 1000,
  }
});

const globalForPrisma = globalThis as unknown as { db: typeof client };
export const db = globalForPrisma.db || client;

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export * from "../../prisma/generated/prisma/client";


