"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { deleteOutreach } from "@/app/actions/deleteOutreach";
import type { DeleteOutreachState } from "@/app/actions/generateOutreach.types";
import CopyButton from "@/components/CopyButton";

export type LibraryOutreachMessage = {
  id: string;
  roleTitle: string;
  companyName: string;
  tone: string;
  linkedinDm: string;
  coldEmailSubject: string;
  coldEmailBody: string;
  createdAt: string;
};

type OutreachLibraryProps = {
  messages: LibraryOutreachMessage[];
};

const deleteInitialState: DeleteOutreachState = {};

export default function OutreachLibrary({ messages }: OutreachLibraryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteState, deleteAction] = useFormState(deleteOutreach, deleteInitialState);

  if (messages.length === 0) {
    return (
      <section className="border-t pt-8">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Your Outreach Library</h2>
        <p className="text-sm text-slate-500">No outreach messages yet. Generate your first one above.</p>
      </section>
    );
  }

  return (
    <section className="border-t pt-8">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Your Outreach Library</h2>

      {deleteState.error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteState.error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {messages.map((message) => {
          const isExpanded = expandedId === message.id;

          return (
            <article
              key={message.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{message.roleTitle}</p>
                  <p className="text-sm text-slate-600">{message.companyName}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 px-2 py-1 capitalize text-blue-700">
                      {message.tone}
                    </span>
                    <span className="text-slate-400">{message.createdAt}</span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : message.id)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={message.id} />
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
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800">LinkedIn DM</h4>
                      <CopyButton
                        text={message.linkedinDm}
                        copyKey={`${message.id}-linkedin`}
                        label="Copy DM"
                      />
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-800">{message.linkedinDm}</p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800">Cold Email</h4>
                      <CopyButton
                        text={`Subject: ${message.coldEmailSubject}\n\n${message.coldEmailBody}`}
                        copyKey={`${message.id}-email`}
                        label="Copy Email"
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-800">{message.coldEmailSubject}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                      {message.coldEmailBody}
                    </p>
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
