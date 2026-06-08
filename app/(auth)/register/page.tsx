"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Zap,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/action/register/register.action";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const registerSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const onSubmit = async (createUserData: RegisterFormData) => {
    try {
      const result = await registerUser({
        email: createUserData.email,
        password: createUserData.password,
      });
      
      if (result.success) {
        toast.success("Registration successful! Redirecting to login...");
      router.push(`/verify-email-pending?email=${encodeURIComponent(createUserData.email)}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    }
  };

    if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gray-200/40 blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="size-10 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Zap className="size-5 text-gray-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-950">
              RoleFit
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 mb-2">
              Create account
            </h1>
            <p className="text-base text-gray-600">
              Start tailoring resumes in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Mail className="size-4 text-lime-600" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-11 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors"
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 flex items-center gap-2"
              >
                <Lock className="size-4 text-lime-600" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className="h-11 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                At least 3 characters
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-lime-400 hover:bg-lime-500 text-gray-950 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-6"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-gray-950 hover:text-lime-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-lime-400 items-center justify-center p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-md relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
              <CheckCircle2 className="size-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
              Tailor faster
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              One master profile. Unlimited tailored applications. Watch your
              interview rate skyrocket.
            </p>
          </div>

          <div className="space-y-5 mt-10">
            {[
              {
                title: "Smart Matching",
                desc: "AI matches your skills to job requirements",
              },
              {
                title: "Multiple Templates",
                desc: "Choose from professional resume styles",
              },
              {
                title: "ATS-Optimized",
                desc: "Passes applicant tracking systems",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
