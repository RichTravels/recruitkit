import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { syncUser } from "@/lib/syncUser";

export default async function Home() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const row = await syncUser();

  return (
    <main className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">RecruitKit</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

      <p className="text-gray-500">Auth works. DB sync works. Next step: build features.</p>

      <pre className="rounded border p-4 text-sm bg-white">
        {JSON.stringify({ syncedUserProfile: row }, null, 2)}
      </pre>
    </main>
  );
}
