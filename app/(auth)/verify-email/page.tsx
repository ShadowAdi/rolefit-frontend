"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/action/verification/verification.action";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="size-12 animate-spin text-lime-500 mx-auto" />
          <h2 className="text-xl font-semibold">Verifying your email...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your email address.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Email Verified!</h1>
            <p className="text-gray-600">{message}</p>
          </div>
          
          <div className="space-y-3">
            <Link href="/login">
              <Button className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950">
                Go to Login
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Verification Failed</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="space-y-3">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            Need a new link?{" "}
            <Link href="/verify-email-pending" className="text-lime-600 hover:text-lime-700 font-medium">
              Request a new verification email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}