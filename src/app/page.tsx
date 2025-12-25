import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GenerateForm from "@/components/GenerateForm";
import { db, ensureUser } from "@/lib/db";
import { openai, STAGE_1_5_PROMPT } from "@/lib/openai";
import { EEOC_FOOTER } from "@/lib/utils";

export default async function Home() {
  // Fix: await the auth() call
  const { userId } = await auth();
  
  if (!userId) {
    // This allows users to see the page but shows a "Sign In" state 
    // rather than forcing a redirect loop
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Welcome to RecruitKit</h1>
        <p className="text-gray-500 mt-2">Please sign in to start generating JDs.</p>
      </div>
    );
  }

  // Fix: await the clerkClient() call
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await ensureUser(userId, user.emailAddresses[0].emailAddress);

  async function generate(fd: any) {
    "use server";
    const { userId: activeId } = await auth();
    const u = await db.user.findUnique({ where: { clerkId: activeId as string } });
    
    if (u?.subscriptionStatus !== "active" && (u?.jdQuota ?? 0) <= 0) return { error: "quota" };

    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: STAGE_1_5_PROMPT(fd.title, fd.location, fd.employment, fd.must, fd.nice, fd.tone) }],
    });

    const jd = (chat.choices[0].message.content || "") + EEOC_FOOTER;

    await db.job.create({
      data: { userId: activeId as string, title: fd.title, content: jd, tone: fd.tone }
    });

    if (u?.subscriptionStatus !== "active") {
      await db.user.update({ where: { clerkId: activeId as string }, data: { jdQuota: { decrement: 1 } } });
    }
    return jd;
  }

  const u = await db.user.findUnique({ 
    where: { clerkId: userId }, 
    include: { jobs: { orderBy: { createdAt: 'desc' } } } 
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">RecruitKit</h1>
        <p className="text-slate-500">Professional, bias-aware job descriptions in seconds.</p>
      </section>

      <GenerateForm onGenerate={generate} />

      {u?.jobs && u.jobs.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Your JD Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {u.jobs.map(job => (
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