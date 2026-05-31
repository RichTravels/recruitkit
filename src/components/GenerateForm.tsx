"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
    >
      {pending ? "Generating..." : "Generate Job Description"}
    </button>
  );
}

interface GenerateFormProps {
  action: (formData: FormData) => Promise<void>;
}

export default function GenerateForm({ action }: GenerateFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-2xl mx-auto">
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
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Remote, US"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
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
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
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
          className="p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none text-black"
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
          className="p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none text-black"
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
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="bold">Bold</option>
          <option value="inclusive">Inclusive</option>
        </select>
      </div>

      <SubmitButton />
    </form>
  );
}
