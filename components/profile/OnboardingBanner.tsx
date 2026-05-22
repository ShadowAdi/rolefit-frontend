"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import {
  isOnboardingCompleted,
  ONBOARDING_COMPLETED_KEY,
} from "@/lib/postLoginRedirect";

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === ONBOARDING_COMPLETED_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
};

export const OnboardingBanner: React.FC = () => {
  const completed = useSyncExternalStore(
    subscribe,
    isOnboardingCompleted,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);

  if (completed || dismissed) return null;

  return (
    <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-lime-100 flex items-center justify-center shrink-0">
        <Sparkles className="size-4 text-lime-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-950 text-sm">
          Finish setting up your profile
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          Walk through each section to build a complete background. You can
          edit anytime later.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1 text-sm font-semibold text-lime-700 hover:text-lime-800 mt-2"
        >
          Continue setup
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-gray-400 hover:text-gray-600 shrink-0 p-1 rounded hover:bg-white/60"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};
