"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateInterview } from "@/app/actions/generateInterview";
import type { GenerateInterviewState } from "@/app/actions/generateInterview.types";
import CopyButton from "@/components/CopyButton";
import MarkdownContent from "@/components/MarkdownContent";
import { GenerationError } from "@/components/UpgradePrompt";

const initialState: GenerateInterviewState = {};

const CATEGORIES = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "situational", label: "Situational" },
  { value: "culture fit", label: "Culture Fit" },
  { value: "role specific", label: "Role Specific" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? "Generating..." : "Generate Interview Questions"}
    </button>
  );
}

export default function GenerateInterviewForm() {
  const [state, formAction] = useFormState(generateInterview, initialState);
  const [displayState, setDisplayState] = useState<GenerateInterviewState>(initialState);
  const prevStateRef = useRef<GenerateInterviewState>(initialState);

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

        <fieldset className="flex flex-col gap-3">
          <legend className="font-medium">Seniority Level</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(["junior", "mid", "senior"] as const).map((level) => (
              <label
                key={level}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 capitalize"
              >
                <input
                  type="radio"
                  name="seniority"
                  value={level}
                  defaultChecked={level === "mid"}
                  required
                  className="text-blue-600 focus:ring-blue-500"
                />
                {level}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="questionCount" className="font-medium">
            Number of Questions
          </label>
          <select
            id="questionCount"
            name="questionCount"
            defaultValue="10"
            className="rounded-lg border p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-medium">Categories</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CATEGORIES.map(({ value, label }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={value}
                  defaultChecked={value === "technical" || value === "behavioral"}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <SubmitButton />
      </form>

      {displayState.error ? <GenerationError error={displayState.error} /> : null}

      {displayState.questions && displayState.roleTitle ? (
        <section className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Generated Questions</h2>
            <Link
              href="/interview/library"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Library →
            </Link>
          </div>

          <article className="rounded-xl border bg-white p-6 shadow-sm">
            <header className="mb-4 border-b pb-4">
              <h3 className="text-xl font-bold text-slate-900">{displayState.roleTitle}</h3>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="capitalize">Seniority: {displayState.seniority}</span>
                <span>{displayState.questionCount} questions</span>
                {displayState.categories ? (
                  <span>
                    {displayState.categories
                      .split(",")
                      .map((c) => c.trim())
                      .join(" · ")}
                  </span>
                ) : null}
              </div>
            </header>

            <div className="mb-4 flex justify-end">
              <CopyButton
                text={displayState.questions}
                copyKey="interview-questions"
                label="Copy All Questions"
              />
            </div>

            <MarkdownContent content={displayState.questions} />
          </article>
        </section>
      ) : null}
    </div>
  );
}
