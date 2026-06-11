"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateJob } from "@/app/actions/generateJob";
import type { GenerateJobState } from "@/app/actions/generateJob.types";
import JobDescriptionView from "@/components/JobDescriptionView";

const initialState: GenerateJobState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? "Generating..." : "Generate Job Description"}
    </button>
  );
}

export default function GenerateForm() {
  const [state, formAction] = useFormState(generateJob, initialState);
  const [displayState, setDisplayState] = useState<GenerateJobState>(initialState);
  const prevStateRef = useRef<GenerateJobState>(initialState);

  useEffect(() => {
    if (state !== prevStateRef.current) {
      prevStateRef.current = state;
      setDisplayState(state);
    }
  }, [state]);

  return (
    <div className="space-y-8">
      <form
        action={formAction}
        onSubmit={() => setDisplayState(initialState)}
        className="mx-auto max-w-2xl space-y-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            Role Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Senior Software Engineer"
            className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Remote, US"
              className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="employment" className="font-medium">
              Employment Type
            </label>
            <select
              id="employment"
              name="employment"
              defaultValue="Full-time"
              className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="must" className="font-medium">
            Must-haves
          </label>
          <textarea
            id="must"
            name="must"
            placeholder="Comma-separated, e.g. 5+ years React, TypeScript"
            className="h-24 rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nice" className="font-medium">
            Nice-to-haves
          </label>
          <textarea
            id="nice"
            name="nice"
            placeholder="Comma-separated, e.g. AWS experience, startup background"
            className="h-24 rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tone" className="font-medium">
            Brand Tone
          </label>
          <select
            id="tone"
            name="tone"
            required
            defaultValue="professional"
            className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="bold">Bold</option>
            <option value="inclusive">Inclusive</option>
          </select>
        </div>

        <SubmitButton />
      </form>

      {displayState.error ? (
        <p className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {displayState.error}
        </p>
      ) : null}

      {displayState.content && displayState.title ? (
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Generated Job Description</h2>
          <JobDescriptionView
            title={displayState.title}
            content={displayState.content}
            tone={displayState.tone}
          />
        </section>
      ) : null}
    </div>
  );
}
