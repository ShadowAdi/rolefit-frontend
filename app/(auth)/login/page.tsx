"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Zap, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })


  const onSubmit = async (loginUserData: LoginFormData) => {
    try {
      console.log("Login User Data ",{
        "email":loginUserData.email,
        "password":loginUserData.password
      })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      )
    }
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-90">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="size-8 rounded-lg bg-lime-400 flex items-center justify-center">
              <Zap className="size-4 text-gray-950" />
            </div>
            <span className="text-base font-semibold tracking-tight">RoleFit</span>
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-text-secondary mb-8">Sign in to tailor your resume</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-xs text-error">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-text-primary hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-lime-400 items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold text-gray-950 tracking-tight mb-4">
            Every application deserves a perfect fit
          </h2>
          <p className="text-gray-800 text-[15px] leading-relaxed mb-8">
            Paste a job description, select what to emphasize, and download
            clean, ATS-friendly PDFs. No fluff, just results.
          </p>
          <div className="space-y-4">
            {[
              "AI-powered content matching",
              "Multiple resume templates",
              "Cover letters included",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                   <svg className="size-3 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                <span className="text-gray-800 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}