"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function Header() {
  const { isAuthenticated, isLoading: isAuthLoading, user, logout } = useAuth();

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
            {isAuthLoading ? (
              <div className="ml-1 sm:ml-2 px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded-md animate-pulse shadow-sm">
                Loading...
              </div>
            ) : null}
            {isAuthLoading ? null : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Hi, {user?.email}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <Link href={`/profile`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/content`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Content
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`dashboard`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href={`/jd`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Job Descriptions
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/resume-download`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Your Resumes
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/cover-letter-download`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Your Cover Letters
                      </DropdownMenuItem>
                    </Link>
                     <Link href={`api-keys`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Api Keys
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        logout();
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                 
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
