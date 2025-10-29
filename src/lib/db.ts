import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { db as fallbackDb } from './dbClient'

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

// Check if we should use the new database client with fallback
const USE_FALLBACK = process.env.USE_MOCK_DB === 'true' || !process.env.DATABASE_URL;

let prismaInstance: any;

if (USE_FALLBACK) {
  console.log('⚠️ Database fallback mode enabled - using mock filesystem database');
  prismaInstance = fallbackDb;
} else {
  // Original Prisma setup with Accelerate
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    }).$extends(withAccelerate())

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance;
