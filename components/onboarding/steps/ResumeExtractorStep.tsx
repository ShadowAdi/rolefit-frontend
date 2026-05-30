"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ResumeExtractAction } from "@/action/resume-extractor/resumeExtractor.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResumeExtractorStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

type ExtractorStatus = "idle" | "loading" | "success" | "error";

const ResumeExtractorStep = ({ onNext, onSkip }: ResumeExtractorStepProps) => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [status, setStatus] = useState<ExtractorStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedCounts, setExtractedCounts] = useState<Record<
    string,
    number
  > | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  const handleExtract = async () => {
    try {
      if (!token) {
        toast.error(`User is Unauthorized`);
        router.push("/login");
        return;
      }

      if (!resumeUrl || resumeUrl.trim() !== "") {
        toast.error(`Resume Url Not Given`);
        return;
      }

      const { success, data, errors, message } = await ResumeExtractAction(
        { resume_url: resumeUrl.trim() },
        token,
      );

      if (!success) {
        toast.error(
          `${errors?.[0] || message || "Failed to extract resume url"}`,
        );
      }
      
    } catch (error) {
      console.error(`Error extracting resume url: `, error);
      toast.error(`An error occurred while extracting resume url`);
    }
  };

  const handleSkip = () => {
    setResumeUrl("");
    setStatus("idle");
    setErrorMessage("");
    setExtractedCounts(null);
    onSkip?.();
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Resume Link
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Paste a direct link to your resume. We support Google Drive,
            Dropbox, and direct PDF links.
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="url"
            placeholder="https://drive.google.com/... or https://example.com/resume.pdf"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            disabled={isLoading || isSuccess}
            className="text-base"
          />

          {isError && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-800 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {isSuccess && extractedCounts && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-lime-50 border border-lime-200">
              <CheckCircle className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-lime-900">
                  Resume Extracted Successfully!
                </p>
                <div className="text-sm text-lime-800 mt-2 space-y-1">
                  {extractedCounts.experience > 0 && (
                    <p>✓ {extractedCounts.experience} experience entries</p>
                  )}
                  {extractedCounts.academics > 0 && (
                    <p>✓ {extractedCounts.academics} academic qualifications</p>
                  )}
                  {extractedCounts.skills > 0 && (
                    <p>✓ {extractedCounts.skills} skills</p>
                  )}
                  {extractedCounts.tools > 0 && (
                    <p>✓ {extractedCounts.tools} tools</p>
                  )}
                  {extractedCounts.projects > 0 && (
                    <p>✓ {extractedCounts.projects} projects</p>
                  )}
                  {extractedCounts.publications > 0 && (
                    <p>✓ {extractedCounts.publications} publications</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleExtract}
              disabled={isLoading || !resumeUrl.trim() || isSuccess}
              className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : isSuccess ? (
                "Continuing..."
              ) : (
                "Extract Resume"
              )}
            </Button>

            {!isSuccess && (
              <Button
                onClick={handleSkip}
                variant="outline"
                disabled={isLoading}
                className="w-full border-gray-300"
              >
                Skip & Fill Manually
              </Button>
            )}
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mt-6">
            <h4 className="font-medium text-blue-900 text-sm mb-2">
              📝 Tips for best results:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure your resume link is publicly accessible</li>
              <li>• Use direct links (end with .pdf)</li>
              <li>• For Google Drive links, make sure sharing is enabled</li>
              <li>• PDF files work best (not Word or images)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeExtractorStep;
