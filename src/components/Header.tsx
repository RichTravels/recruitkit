import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 px-6 border-b bg-white">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">R</div>
        <span className="text-xl font-bold tracking-tight text-slate-800">RecruitKit</span>
      </div>
      
      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
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