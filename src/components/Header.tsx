import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 px-6 border-b">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-white">R</span>
        </div>
        <span className="text-xl font-bold tracking-tight">RecruitKit</span>
      </Link>

      <div>
        {/* This shows ONLY when the user is logged out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        {/* This shows ONLY when the user is logged in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}