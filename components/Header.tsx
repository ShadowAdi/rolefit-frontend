import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-semibold text-gray-950 tracking-tight"
            >
              Rolefit
            </Link>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="ml-1 sm:ml-2 px-4 py-2 text-sm font-semibold text-gray-950 bg-lime-400 hover:bg-lime-300 rounded-md transition-colors shadow-sm"
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
