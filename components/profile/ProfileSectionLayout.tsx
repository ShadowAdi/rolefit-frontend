"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProfileSectionLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const ProfileSectionLayout: React.FC<ProfileSectionLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [token, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-white/60">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-lime-700 font-medium transition-colors mb-3"
            >
              <ChevronLeft className="size-4" />
              Back to profile
            </Link>
            <h1 className="text-2xl font-bold text-gray-950">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-center px-4 py-12">
          <div className="w-full max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
};
