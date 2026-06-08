"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { resendVerificationEmail } from "@/action/verification/verification.action";
import { toast } from "sonner";

interface ResendVerificationButtonProps {
  email: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function ResendVerificationButton({
  email,
  variant = "outline",
  className = "",
}: ResendVerificationButtonProps) {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    if (isResending || countdown > 0) return;

    setIsResending(true);
    const result = await resendVerificationEmail(email);

    if (result.success) {
      toast.success(result.message);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      toast.error(result.message);
    }
    setIsResending(false);
  };

  return (
    <Button
      onClick={handleResend}
      disabled={isResending || countdown > 0}
      variant={variant}
      className={className}
    >
      {isResending ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          Sending...
        </>
      ) : countdown > 0 ? (
        <>
          <RefreshCw className="size-4 mr-2" />
          Resend in {countdown}s
        </>
      ) : (
        <>
          <RefreshCw className="size-4 mr-2" />
          Resend Verification Email
        </>
      )}
    </Button>
  );
}