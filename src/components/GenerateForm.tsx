"use client";

import React, { useState } from "react";

// 1. We define an "Interface" to tell TypeScript exactly what props to expect.
interface GenerateFormProps {
  onGenerate: (formData: FormData) => Promise<string | { error: string }>;
}

// 2. We apply that interface to the function.
export default function GenerateForm({ onGenerate }: GenerateFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await onGenerate(formData);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-medium">
          Job Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Paste the job description here..."
          className="p-3 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? "Generating..." : "Generate Interview Prep"}
      </button>
    </form>
  );
}