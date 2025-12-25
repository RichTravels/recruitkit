"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function GenerateForm() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The Security Gate: Redirect if not logged in
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    
    try {
      // Your existing AI generation logic goes here
      console.log("User is authenticated. Starting AI generation...");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border">
        {/* Your input fields (Job Title, Company, etc.) stay here */}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "AI is working..." : "Generate Job Description"}
        </button>
      </form>
    </div>
  );
}