import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const clerkId = user.id;
  const email = user.primaryEmailAddress?.emailAddress ?? null;

  const row = await prisma.user.upsert({
    where: { clerkId },
    update: { email },
    create: { 
      clerkId, 
      email,
      subscriptionStatus: "inactive",
      jdQuota: 3
    },
    select: { id: true, clerkId: true, email: true },
  });

  return row;
}