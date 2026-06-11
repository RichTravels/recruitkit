import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// This creates the database connection
export const db = globalForPrisma.prisma ?? new PrismaClient();

globalForPrisma.prisma = db;

export async function ensureUser(clerkId: string, email: string) {
  await db.user.upsert({
    where: { clerkId },
    create: { clerkId, email, jdQuota: 3 },
    update: {},
  });
}