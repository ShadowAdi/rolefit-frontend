"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";

interface OnboardingBannerProps {
  isOnboarded: boolean;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  isOnboarded,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (isOnboarded || dismissed) return null;

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
