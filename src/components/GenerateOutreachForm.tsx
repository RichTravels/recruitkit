"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateOutreach } from "@/app/actions/generateOutreach";
import type { GenerateOutreachState } from "@/app/actions/generateOutreach.types";
import CopyButton from "@/components/CopyButton";

const initialState: GenerateOutreachState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? "Generating..." : "Generate Outreach Messages"}
    </button>
  );
}

export default function GenerateOutreachForm() {
  const [state, formAction] = useFormState(generateOutreach, initialState);
  const [displayState, setDisplayState] = useState<GenerateOutreachState>(initialState);
  const prevStateRef = useRef<GenerateOutreachState>(initialState);

  useEffect(() => {
    if (state !== prevStateRef.current) {
      prevStateRef.current = state;
      setDisplayState(state);
    }
  }, [state]);

  async function handleAction(formData: FormData) {
    setDisplayState(initialState);
    try {
      await formAction(formData);
    } catch {
      // Server action ID is stale — a new deployment happened while this page was
      // open. Reload to get fresh action IDs from the latest build.
      window.location.reload();
    }
  }

  return (
    <div className="space-y-8">
      <form
        action={handleAction}
        className="mx-auto max-w-2xl space-y-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="roleTitle" className="font-medium">
            Role Title
          </label>
          <input
            id="roleTitle"
            name="roleTitle"
            type="text"
            required
            placeholder="e.g. Senior Software Engineer"
            className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="companyName" className="font-medium">
            Company Name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            placeholder="e.g. Acme Corp"
            className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="keySkills" className="font-medium">
            Key Skills
          </label>
          <textarea
            id="keySkills"
            name="keySkills"
            required
            placeholder="e.g. React, TypeScript, 5+ years SaaS experience"
            className="h-24 rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-medium">Tone</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(["professional", "conversational", "direct"] as const).map((tone) => (
              <label
                key={tone}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 capitalize"
              >
                <input
                  type="radio"
                  name="tone"
                  value={tone}
                  defaultChecked={tone === "professional"}
                  required
                  className="text-blue-600 focus:ring-blue-500"
                />
                {tone}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="additionalContext" className="font-medium">
            Additional Context <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="additionalContext"
            name="additionalContext"
            placeholder="e.g. Remote role, Series B startup, equity offered"
            className="h-24 rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <SubmitButton />
      </form>

      {displayState.error ? (
        <p className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {displayState.error}
        </p>
      ) : null}

      {displayState.linkedinDm && displayState.coldEmailSubject && displayState.coldEmailBody ? (
        <section className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Generated Outreach</h2>
            <Link
              href="/outreach/library"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Library →
            </Link>
          </div>

          <article className="rounded-xl border bg-white p-6 shadow-sm">
            <header className="mb-4 border-b pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {displayState.roleTitle} at {displayState.companyName}
              </h3>
              <p className="mt-1 text-xs capitalize text-slate-500">Tone: {displayState.tone}</p>
            </header>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">LinkedIn DM</h4>
                  <CopyButton text={displayState.linkedinDm} copyKey="linkedin" label="Copy DM" />
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {displayState.linkedinDm}
                </p>
                <p className="mt-1 text-xs text-slate-400">{displayState.linkedinDm.length}/300 chars</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">Cold Email</h4>
                  <CopyButton
                    text={`Subject: ${displayState.coldEmailSubject}\n\n${displayState.coldEmailBody}`}
                    copyKey="email"
                    label="Copy Email"
                  />
                </div>
                <p className="text-sm font-medium text-slate-800">{displayState.coldEmailSubject}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {displayState.coldEmailBody}
                </p>
              </div>
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}
