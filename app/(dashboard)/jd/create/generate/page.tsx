"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GenerateJDAction } from "@/action/job-description/jd.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const GenerateJDPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [rawJD, setRawJD] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    try {
      if (!rawJD.trim()) {
        toast.error("Please enter a job description");
        return;
      }

      setIsLoading(true);
      setError(null);

      const result = await GenerateJDAction(rawJD, token);

      if (result.success) {
        setSuccess(true);
        toast.success("Job description generated successfully!");
        setTimeout(() => {
          router.push("/jd");
        }, 2000);
      } else {
        setError(result.message || "Failed to generate job description");
        toast.error(result.message || "Failed to generate job description");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            className="mb-6 gap-2 text-gray-600"
            onClick={() => router.push("/jd/create")}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <h1 className="text-4xl font-bold text-gray-950 mb-2">
            Generate Job Description
          </h1>
          <p className="text-lg text-gray-600">
            Paste a job description and we'll automatically extract all the key information
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-lime-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Job Description Generated!
              </h2>
              <p className="text-gray-600 mb-6">
                Your job description has been successfully created. Redirecting...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error State */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Text Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Job Description Text
                </label>
                <p className="text-sm text-gray-600">
                  Paste the complete job description from LinkedIn, company website, or any job board
                </p>
                <Textarea
                  placeholder="Paste job description here... e.g., 'Senior Full-Stack Developer at TechCorp. We are looking for a skilled developer with 5+ years experience in React, Node.js, and PostgreSQL...'"
                  value={rawJD}
                  onChange={(e) => setRawJD(e.target.value)}
                  disabled={isLoading}
                  className="min-h-96 text-base resize-vertical"
                />
                <p className="text-xs text-gray-500">
                  Minimum length: 50 characters | Current: {rawJD.length} characters
                </p>
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-900 text-sm mb-2">
                  💡 For best results:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Include complete job descriptions with all details</li>
                  <li>• Include role, company, responsibilities, and requirements</li>
                  <li>• The more detail provided, the better the extraction</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !rawJD.trim()}
                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Job Description"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/jd/create")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateJDPage;
