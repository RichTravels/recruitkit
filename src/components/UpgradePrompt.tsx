"use client";

import { useState } from "react";

export default function UpgradePrompt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-blue-200 bg-blue-50 p-6 text-center shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">
        You&apos;ve used your 3 free generations.
      </h3>
      <p className="mt-2 text-slate-600">
        Upgrade to Recruiter Pro for unlimited access to all three tools.
      </p>
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Redirecting..." : "Upgrade — $79/month"}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-red-700">{error}</p>
      ) : null}
    </div>
  );
}

function isQuotaError(message: string): boolean {
  return /quota|upgrade/i.test(message);
}

export function GenerationError({ error }: { error: string }) {
  if (isQuotaError(error)) {
    return <UpgradePrompt />;
  }

  return (
    <p className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  );
}
