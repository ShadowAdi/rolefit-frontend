"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to the console (replace with a reporting service later)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-gray-950 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-2">
          An unexpected error occurred while loading this page. You can try
          again or head back to your dashboard.
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-400 mb-8">
            Error reference: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-lime-500 hover:bg-lime-600 text-white font-medium px-5 h-11 transition-colors"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 h-11 transition-colors"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
