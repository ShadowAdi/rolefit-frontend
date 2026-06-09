"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Remove useSearchParams
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/action/verification/verification.action";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // Get token from URL params on client-side only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    setToken(tokenParam);
  }, []);

  useEffect(() => {
    if (token === null) return; // Wait for token to be extracted
    
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const handleVerification = async () => {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus("success");
        setMessage(result.data.message);
        toast.success(result.data.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(result.message);
        toast.error(result.message);
      }
    };

    handleVerification();
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center">
            <Loader2 className="size-10 animate-spin text-lime-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verifying your email…</h2>
          <p className="text-gray-600">Please wait while we confirm your email address.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-lime-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Email Verified!</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting you to login…</p>
          </div>

          <Link href="/login" className="block">
            <Button className="w-full h-11 bg-lime-400 hover:bg-lime-500 text-gray-950 font-semibold">
              Continue to Login
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Verification Failed</h1>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="space-y-3">
          <Link href="/verify-email-pending" className="block">
            <Button className="w-full h-11 bg-lime-400 hover:bg-lime-500 text-gray-950 font-semibold">
              Request a new link
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full h-11">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}