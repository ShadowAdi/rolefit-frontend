// app/verify-email-pending/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, ArrowRight, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail, checkVerificationStatus } from "@/action/verification/verification.action";
import { toast } from "sonner";

export default function VerifyEmailPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      const storedEmail = localStorage.getItem("pendingVerificationEmail");
      if (!storedEmail) {
        router.push("/login");
        return;
      }
      checkVerificationStatusWithEmail(storedEmail);
    } else {
      localStorage.setItem("pendingVerificationEmail", email);
      checkVerificationStatusWithEmail(email);
    }
  }, [email, router]);

  const checkVerificationStatusWithEmail = async (emailToCheck: string) => {
    setIsChecking(true);
    const status = await checkVerificationStatus(emailToCheck);

    if (status?.is_verified) {
      setIsVerified(true);
      toast.success("Email verified! Redirecting to login...");
      setTimeout(() => {
        localStorage.removeItem("pendingVerificationEmail");
        router.push("/login?verified=true");
      }, 2000);
    }
    setIsChecking(false);
  };

  const handleResendEmail = async () => {
    if (isResending || countdown > 0) return;

    const emailToUse = email || localStorage.getItem("pendingVerificationEmail");
    if (!emailToUse) {
      toast.error("Email address not found. Please try logging in again.");
      router.push("/login");
      return;
    }

    setIsResending(true);
    const result = await resendVerificationEmail(emailToUse);

    if (result.success) {
      toast.success(result.message);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      toast.error(result.message);
    }
    setIsResending(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="size-8 animate-spin text-lime-500 mx-auto" />
          <p className="text-muted-foreground">Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle2 className="size-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Email Verified!</h1>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const displayEmail = email || localStorage.getItem("pendingVerificationEmail");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">

        {/* Icon */}
        <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center">
          <Mail className="w-10 h-10 text-lime-600" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h1>
          <p className="text-gray-600">We've sent a verification link to</p>
          <p className="font-semibold text-gray-900 break-all">{displayEmail}</p>
        </div>

        {/* Info box */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-sm text-blue-800">
            ✉️ Click the link in the email to verify your account. The link expires in 24 hours.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={isResending || countdown > 0}
            className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950"
          >
            {isResending ? (
              <><Loader2 className="size-4 animate-spin mr-2" />Sending...</>
            ) : countdown > 0 ? (
              <><RefreshCw className="size-4 mr-2" />Resend available in {countdown}s</>
            ) : (
              <><RefreshCw className="size-4 mr-2" />Resend verification email</>
            )}
          </Button>

          <Link href="/login" className="block w-full">
            <Button variant="outline" className="w-full">
              Back to Login
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or{" "}
          <button
            onClick={handleResendEmail}
            disabled={countdown > 0}
            className="text-lime-600 hover:text-lime-700 font-medium disabled:opacity-50"
          >
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
}