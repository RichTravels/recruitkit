import { auth, clerkClient } from "@clerk/nextjs/server";
import GenerateForm from "@/components/GenerateForm";
import { db, ensureUser } from "@/lib/db";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Welcome to RecruitKit</h1>
        <p className="text-gray-500 mt-2">Please sign in to start generating JDs.</p>
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

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">RecruitKit</h1>
        <p className="text-slate-500">Professional, bias-aware job descriptions in seconds.</p>
      </section>

      <GenerateForm />

      {u?.jobs && u.jobs.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Your JD Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {u.jobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <p className="font-bold truncate text-slate-900">{job.title}</p>
                <p className="text-slate-400 text-xs mt-1">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
