import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OutreachLibrary from "@/components/OutreachLibrary";
import { db, ensureUser } from "@/lib/db";

export default async function OutreachLibraryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Outreach Library</h1>
        <p className="mt-2 text-gray-500">Please sign in to view your outreach messages.</p>
      </div>
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await ensureUser(userId, user.emailAddresses[0].emailAddress);

  const u = await db.user.findUnique({
    where: { clerkId: userId },
    include: { outreachMessages: { orderBy: { createdAt: "desc" } } },
  });

  const messages =
    u?.outreachMessages.map((message) => ({
      id: message.id,
      roleTitle: message.roleTitle,
      companyName: message.companyName,
      tone: message.tone,
      linkedinDm: message.linkedinDm,
      coldEmailSubject: message.coldEmailSubject,
      coldEmailBody: message.coldEmailBody,
      createdAt: new Date(message.createdAt).toLocaleDateString(),
    })) ?? [];

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Outreach Library</h1>
          <p className="text-slate-500">All your saved candidate outreach messages.</p>
        </div>
        <Link
          href="/outreach/generate"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          New Outreach
        </Link>
      </section>

      <OutreachLibrary messages={messages} />
    </div>
  );
}
