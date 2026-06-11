import { auth, clerkClient } from "@clerk/nextjs/server";
import GenerateOutreachForm from "@/components/GenerateOutreachForm";
import { ensureUser } from "@/lib/db";

export default async function OutreachGeneratePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Outreach Generator</h1>
        <p className="mt-2 text-gray-500">Please sign in to generate outreach messages.</p>
      </div>
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await ensureUser(userId, user.emailAddresses[0].emailAddress);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Outreach Generator</h1>
        <p className="text-slate-500">
          LinkedIn DMs and cold emails for candidate outreach in seconds.
        </p>
      </section>

      <GenerateOutreachForm />
    </div>
  );
}
