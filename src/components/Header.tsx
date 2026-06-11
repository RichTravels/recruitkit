import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
            <span className="text-xl font-bold tracking-tight text-white">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight">RecruitKit</span>
        </Link>

        <SignedIn>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 sm:flex">
            <Link href="/dashboard" className="transition hover:text-slate-900">
              JD Generator
            </Link>
            <Link href="/outreach/generate" className="transition hover:text-slate-900">
              Outreach Generator
            </Link>
            <Link href="/outreach/library" className="transition hover:text-slate-900">
              Outreach Library
            </Link>
            <Link href="/interview/generate" className="transition hover:text-slate-900">
              Interview Generator
            </Link>
            <Link href="/interview/library" className="transition hover:text-slate-900">
              Interview Library
            </Link>
          </nav>
        </SignedIn>
      </div>

      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}