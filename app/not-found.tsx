import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 text-white">
          <Search className="h-8 w-8" />
        </div>

        <p className="text-7xl font-bold text-lime-500 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-950 mb-2">
          Page not found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-lime-500 hover:bg-lime-600 text-white font-medium px-5 h-11 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
