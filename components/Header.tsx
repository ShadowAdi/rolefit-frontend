"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
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
import {
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  FileText,
  Download,
  Key,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

  const { isAuthenticated, isLoading: isAuthLoading, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on window resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const getDisplayName = () => {
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  return (
    <>
      <header
        className={`w-full border-b transition-all duration-300 sticky top-0 z-50 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors"
              >
                Rolefit
              </Link>
            </div>

               <div className="flex items-center gap-6">
        <Link 
          href="/" 
          className={`text-sm font-medium transition-colors ${
            pathname === '/' ? 'text-lime-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`text-sm font-medium transition-colors ${
            pathname === '/about' ? 'text-lime-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          About
        </Link>
        <Link 
          href="/contact" 
          className={`text-sm font-medium transition-colors ${
            pathname === '/contact' ? 'text-lime-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Contact
        </Link>
      </div>

            <nav className="hidden md:flex items-center gap-2">
              {isAuthLoading ? (
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg animate-pulse">
                  Loading...
                </div>
              ) : null}

              {isAuthLoading ? null : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 transition-all duration-200 rounded-lg px-3 py-2 text-gray-700 font-medium"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center text-gray-900 font-semibold">
                        {getDisplayName()[0].toUpperCase()}
                      </div>
                      <span className="hidden lg:inline">
                        {getDisplayName()}
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 mt-2 shadow-lg rounded-xl border-gray-100">
                    <DropdownMenuLabel className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-gray-900">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/profile">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/content">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Content</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/jd">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <FileText className="w-4 h-4" />
                          <span>Job Descriptions</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/resume-download">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <Download className="w-4 h-4" />
                          <span>Your Resumes</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/cover-letter-download">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <Download className="w-4 h-4" />
                          <span>Your Cover Letters</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/api-keys">
                        <DropdownMenuItem className="cursor-pointer px-3 py-2.5 gap-3">
                          <Key className="w-4 h-4" />
                          <span>API Keys</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer px-3 py-2.5 gap-3 text-red-600 focus:text-red-600"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-semibold text-gray-900 bg-lime-400 hover:bg-lime-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-xl z-40 md:hidden animate-in slide-in-from-top-5">
            <div className="px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {isAuthLoading ? (
                <div className="px-4 py-3 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg animate-pulse">
                  Loading...
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center text-gray-900 font-bold text-lg">
                      {getDisplayName()[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Profile
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/content"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <LayoutDashboard className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Content
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <LayoutDashboard className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Dashboard
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="space-y-1">
                    <Link href="/jd" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Job Descriptions
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/resume-download"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <Download className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Your Resumes
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/cover-letter-download"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <Download className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Your Cover Letters
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/api-keys"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                        <Key className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          API Keys
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors active:bg-red-100 text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 p-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-full px-4 py-3 text-center font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors active:scale-95">
                      Login
                    </div>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-full px-4 py-3 text-center font-semibold text-gray-900 bg-lime-400 rounded-lg hover:bg-lime-500 transition-colors active:scale-95">
                      Register
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
