import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-emerald-800 tracking-tight">
              Rolefit
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shadow-sm"
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
