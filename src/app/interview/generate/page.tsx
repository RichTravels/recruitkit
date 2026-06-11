import { auth, clerkClient } from "@clerk/nextjs/server";
import GenerateInterviewForm from "@/components/GenerateInterviewForm";
import { ensureUser } from "@/lib/db";

export default async function InterviewGeneratePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Interview Generator</h1>
        <p className="mt-2 text-gray-500">Please sign in to generate interview questions.</p>
      </div>
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await ensureUser(userId, user.emailAddresses[0].emailAddress);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Generator</h1>
        <p className="text-slate-500">
          Structured interview question banks tailored to role and seniority in seconds.
        </p>
      </section>

      <GenerateInterviewForm />
    </div>
  );
}
