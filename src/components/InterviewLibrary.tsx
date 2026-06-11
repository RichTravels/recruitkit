"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { deleteInterview } from "@/app/actions/deleteInterview";
import type { DeleteInterviewState } from "@/app/actions/generateInterview.types";
import CopyButton from "@/components/CopyButton";

export type LibraryInterviewQuestion = {
  id: string;
  roleTitle: string;
  seniority: string;
  questionCount: number;
  categories: string;
  questions: string;
  createdAt: string;
};

type InterviewLibraryProps = {
  banks: LibraryInterviewQuestion[];
};

const deleteInitialState: DeleteInterviewState = {};

export default function InterviewLibrary({ banks }: InterviewLibraryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteState, deleteAction] = useFormState(deleteInterview, deleteInitialState);

  if (banks.length === 0) {
    return (
      <section className="border-t pt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Your Interview Library</h2>
        <p className="text-sm text-slate-500">
          No question banks yet. Generate your first one above.
        </p>
      </section>
    );
  }

  return (
    <section className="border-t pt-8">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Your Interview Library</h2>

      {deleteState.error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteState.error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {banks.map((bank) => {
          const isExpanded = expandedId === bank.id;
          const categoryList = bank.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

          return (
            <article key={bank.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{bank.roleTitle}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 px-2 py-1 capitalize text-blue-700">
                      {bank.seniority}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                      {bank.questionCount} questions
                    </span>
                    {categoryList.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full bg-slate-50 px-2 py-1 capitalize text-slate-500"
                      >
                        {cat}
                      </span>
                    ))}
                    <span className="text-slate-400">{bank.createdAt}</span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : bank.id)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={bank.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              {isExpanded ? (
                <div className="mt-4 border-t pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">Question Bank</h4>
                    <CopyButton
                      text={bank.questions}
                      copyKey={`${bank.id}-questions`}
                      label="Copy All"
                    />
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                    {bank.questions}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
