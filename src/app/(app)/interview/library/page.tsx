import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import InterviewLibrary from "@/components/InterviewLibrary";
import { db, ensureUser } from "@/lib/db";

export default async function InterviewLibraryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Interview Library</h1>
        <p className="mt-2 text-gray-500">Please sign in to view your question banks.</p>
      </div>
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await ensureUser(userId, user.emailAddresses[0].emailAddress);

  const u = await db.user.findUnique({
    where: { clerkId: userId },
    include: { interviewQuestions: { orderBy: { createdAt: "desc" } } },
  });

  const banks =
    u?.interviewQuestions.map((q) => ({
      id: q.id,
      roleTitle: q.roleTitle,
      seniority: q.seniority,
      questionCount: q.questionCount,
      categories: q.categories,
      questions: q.questions,
      createdAt: new Date(q.createdAt).toLocaleDateString(),
    })) ?? [];

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Library</h1>
          <p className="text-slate-500">All your saved interview question banks.</p>
        </div>
        <Link
          href="/interview/generate"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          New Question Bank
        </Link>
      </section>

      <InterviewLibrary banks={banks} />
    </div>
  );
}
