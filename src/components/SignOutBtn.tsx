"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function SignOutBtn() {
  return (
    <SignOutButton>
      <button className="rounded border px-3 py-2">Sign out</button>
    </SignOutButton>
  );
}
