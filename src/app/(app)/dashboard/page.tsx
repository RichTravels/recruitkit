import { auth, clerkClient } from "@clerk/nextjs/server";
import GenerateForm from "@/components/GenerateForm";
import JobLibrary from "@/components/JobLibrary";
import { db, ensureUser } from "@/lib/db";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Welcome to RecruitKit</h1>
        <p className="mt-2 text-gray-500">Please sign in to start generating JDs.</p>
      </div>
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await ensureUser(userId, user.emailAddresses[0].emailAddress);

  const u = await db.user.findUnique({
    where: { clerkId: userId },
    include: { jobs: { orderBy: { createdAt: "desc" } } },
  });

  const jobs =
    u?.jobs.map((job) => ({
      id: job.id,
      title: job.title,
      content: job.content,
      tone: job.tone,
      createdAt: new Date(job.createdAt).toLocaleDateString(),
    })) ?? [];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">JD Generator</h1>
        <p className="text-slate-500">Professional, bias-aware job descriptions in seconds.</p>
      </section>

      <GenerateForm />

      {jobs.length > 0 ? <JobLibrary jobs={jobs} /> : null}
    </div>
  );
}
