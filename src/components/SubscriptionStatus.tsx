"use client";

import { useState } from "react";
import { openBillingPortal, startCheckout } from "@/lib/billing-client";

type SubscriptionStatusProps = {
  isPro: boolean;
  compact?: boolean;
};

export default function SubscriptionStatus({ isPro, compact = false }: SubscriptionStatusProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      await startCheckout();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout");
      setLoading(false);
    }
  }

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      await openBillingPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open billing portal");
      setLoading(false);
    }
  }

  if (isPro) {
    return (
      <div
        className={
          compact
            ? "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
            : "rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm"
        }
      >
        <div className={compact ? "flex flex-wrap items-center gap-3" : "space-y-2"}>
          <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Recruiter Pro
          </span>
          <p className={compact ? "text-sm text-green-900" : "text-slate-700"}>
            Active subscription — $79/month
          </p>
        </div>
        <button
          type="button"
          onClick={handleManage}
          disabled={loading}
          className={
            compact
              ? "rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-800 transition hover:bg-green-100 disabled:opacity-50"
              : "mt-4 rounded-lg border border-green-300 bg-white px-5 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-100 disabled:opacity-50"
          }
        >
          {loading ? "Opening..." : "Manage Subscription"}
        </button>
        {error ? <p className="w-full text-sm text-red-700">{error}</p> : null}
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
          : "rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
      }
    >
      <div className={compact ? "flex flex-wrap items-center gap-3" : "space-y-2"}>
        <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Free Plan
        </span>
        <p className={compact ? "text-sm text-slate-600" : "text-slate-600"}>
          3 generations per tool
        </p>
      </div>
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className={
          compact
            ? "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
            : "mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        }
      >
        {loading ? "Redirecting..." : "Upgrade to Pro"}
      </button>
      {error ? <p className="w-full text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
