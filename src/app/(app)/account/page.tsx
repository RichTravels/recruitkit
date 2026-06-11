export const dynamic = "force-dynamic";

import { UserProfile } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { db, ensureUser } from "@/lib/db";

const clerkAppearance = {
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
};

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="mt-2 text-gray-500">Please sign in to view your account.</p>
      </div>
    );
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  await ensureUser(userId, clerkUser.emailAddresses[0].emailAddress);

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { isPro: true, email: true },
  });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account</h1>
        <p className="text-slate-500">Manage your profile and subscription.</p>
      </section>

      <SubscriptionStatus isPro={user?.isPro ?? false} />

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <UserProfile appearance={clerkAppearance} />
      </section>
    </div>
  );
}
