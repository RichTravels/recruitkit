import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// This creates the database connection
export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export async function ensureUser(clerkId: string, email: string) {
  // If this line has a red error, npx prisma generate will fix it
  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    await db.user.create({
      data: {
        clerkId,
        email,
        jdQuota: 3,
      },
    });
  }
}