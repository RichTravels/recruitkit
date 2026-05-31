"use client";

import { useState } from "react";
import JobDescriptionView from "@/components/JobDescriptionView";

export type LibraryJob = {
  id: string;
  title: string;
  content: string;
  tone: string;
  createdAt: string;
};

type JobLibraryProps = {
  jobs: LibraryJob[];
};

export default function JobLibrary({ jobs }: JobLibraryProps) {
  const [selectedJob, setSelectedJob] = useState<LibraryJob | null>(null);

  return (
    <>
      <section className="border-t pt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Your JD Library</h2>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => setSelectedJob(job)}
              className="rounded-xl border bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <p className="truncate font-bold text-slate-900">{job.title}</p>
              <p className="mt-1 text-xs capitalize text-slate-500">{job.tone}</p>
              <p className="mt-1 text-xs text-slate-400">{job.createdAt}</p>
            </button>
          ))}
        </div>
      </section>

      {selectedJob ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-md bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <JobDescriptionView
              title={selectedJob.title}
              content={selectedJob.content}
              tone={selectedJob.tone}
              createdAt={selectedJob.createdAt}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
