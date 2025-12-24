"use client";

import { SignOutButton } from "@clerk/nextjs";

export function SignOutClient() {
  return (
    <div className="inline-block rounded border px-3 py-2">
      <SignOutButton />
    </div>
  );
}
