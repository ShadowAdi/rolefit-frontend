"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useContentGenerationStatus } from "@/hooks/useContentGenerationStatus";
import {
  GetContentResumeAction,
  DeleteContentAction,
} from "@/action/content/content.action";
import { GeneratedDocumentResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Copy,
  RefreshCw,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  DownloadResumePdfAction,
  ListTemplates as ListResumeTemplates,
} from "@/action/resume_pdf/resume_pdf.action";
import {
  DownloadCoverLetterPdfAction,
  ListTemplates as ListCoverLetterTemplates,
} from "@/action/cover_letter_pdf/cover_letter_pdf.action";

const ContentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token, isLoading: authLoading } = useAuth();
  const contentId = params.contentId as string;

  const [content, setContent] = useState<GeneratedDocumentResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [templates, setTemplates] = useState<
    { id: string; name: string; description?: string }[]
  >([]);

  // Resolve the document type from `document_type` (optional) with a fallback
  // to `gen_doc_type` ("Resume" / "Cover-letter"), which is always present.
  const resolveIsResume = (doc: GeneratedDocumentResponse) =>
    !(
      doc.document_type === "Cover-letter" ||
      doc.gen_doc_type === "Cover-letter"
    );

  const formatContentDisplay = (rawText: string | null | undefined): string => {
    if (!rawText) return "";
    try {
      const parsed = JSON.parse(rawText);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return rawText;
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      if (!token || authLoading || !contentId) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await GetContentResumeAction(contentId, token);

        if (result.success && result.data) {
          const contentWithStatus = {
            ...result.data,
            status:
              result.data.status ||
              (result.data.resume_text || result.data.cover_letter_text
                ? "completed"
                : "pending"),
          };
          setContent(contentWithStatus);
        } else {
          setError(result.message || "Failed to fetch content");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [token, authLoading, contentId]);

  useContentGenerationStatus(
    contentId,
    (event) => {
      console.log("[WS] Received event:", event);
      setContent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: event.status,
        };
      });
    },
    () => {
      toast.success("Content generation completed!");
      GetContentResumeAction(contentId, token!).then((result) => {
        if (result.success && result.data) {
          setContent(result.data);
        }
      });
    },
    (error) => {
      toast.error(error || "Content generation failed");
    },
  );

  // Load the available PDF templates once we know whether this is a resume or
  // a cover letter (each has its own template set).
  useEffect(() => {
    const loadTemplates = async () => {
      if (!token || !content) return;

      const fallback = [
        { id: "classic", name: "Classic", description: "Clean, single-column" },
        {
          id: "minimalist",
          name: "Minimalist",
          description: "Generous white space",
        },
        { id: "bold", name: "Bold", description: "Dark header, vivid accents" },
      ];

      try {
        const res = resolveIsResume(content)
          ? await ListResumeTemplates(token)
          : await ListCoverLetterTemplates(token);

        const list = (res as any)?.data?.templates;
        const resolved =
          Array.isArray(list) && list.length > 0 ? list : fallback;

        setTemplates(resolved);
        setSelectedTemplate((prev) =>
          resolved.some((t: { id: string }) => t.id === prev)
            ? prev
            : resolved[0].id,
        );
      } catch {
        setTemplates(fallback);
      }
    };

    loadTemplates();
    // Re-run only when the resolved document type changes, not on every content update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, content ? resolveIsResume(content) : null]);

  const handleRefresh = async () => {
    if (!token) return;

    try {
      setIsRefreshing(true);
      const result = await GetContentResumeAction(contentId, token);

      if (result.success && result.data) {
        setContent(result.data);
        toast.success("Content refreshed");
      } else {
        toast.error(result.message || "Failed to refresh");
      }
    } catch (err) {
      toast.error("Failed to refresh content");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    try {
      setIsDeleting(true);
      const result = await DeleteContentAction(token, contentId);

      if (result.success) {
        toast.success("Content deleted successfully");
        router.back();
      } else {
        toast.error(result.message || "Failed to delete content");
      }
    } catch (err) {
      toast.error("Failed to delete content");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyToClipboard = () => {
    const rawText =
      content?.resume_text ||
      content?.cover_letter_text ||
      (content as any)?.content;
    if (rawText) {
      try {
        const parsed = JSON.parse(rawText);
        const formatted = JSON.stringify(parsed, null, 2);
        navigator.clipboard.writeText(formatted);
      } catch {
        navigator.clipboard.writeText(rawText);
      }
      toast.success("Copied to clipboard!");
    } else {
      toast.error("No content to copy");
    }
  };

  const handleGeneratePdf = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    if (!content) {
      toast.error("No content available");
      return;
    }

    if (content.status !== "completed") {
      toast.error(
        "Content is not ready yet. Please wait for generation to complete.",
      );
      return;
    }

    const isCoverLetter =
      content.document_type === "Cover-letter" ||
      content.gen_doc_type === "Cover-letter";

    const documentText = isCoverLetter
      ? content.cover_letter_text
      : content.resume_text;

    if (!documentText) {
      toast.error(
        isCoverLetter
          ? "No cover letter content to generate PDF from"
          : "No resume content to generate PDF from",
      );
      return;
    }

    try {
      setIsGeneratingPdf(true);
      toast.loading("Generating PDF...", { id: "pdf-generation" });
      const result = isCoverLetter
        ? await DownloadCoverLetterPdfAction(contentId, token, selectedTemplate)
        : await DownloadResumePdfAction(contentId, token, selectedTemplate);

      if (result.success && result.data) {
        const blob = result.data as Blob;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const filename = `${isCoverLetter ? "cover-letter" : "resume"}_${selectedTemplate}_${new Date().getTime()}.pdf`;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        toast.success("PDF generated successfully!", { id: "pdf-generation" });
      } else {
        toast.error(result.message || "Failed to generate PDF", {
          id: "pdf-generation",
        });
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate PDF. Please try again.", {
        id: "pdf-generation",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownload = () => {
    const rawText =
      content?.resume_text ||
      content?.cover_letter_text ||
      (content as any)?.content;
    if (!rawText || !content) {
      toast.error("No content to download");
      return;
    }

    let text = rawText;
    try {
      const parsed = JSON.parse(rawText);
      text = JSON.stringify(parsed, null, 2);
    } catch {
      text = rawText;
    }

    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${(content as any)?.document_type || content?.gen_doc_type}-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded!");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-red-600 font-medium">
              {error || "Content not found"}
            </p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing =
    content.status === "processing" || content.status === "pending";
  const isFailed = content.status === "failed";
  const isReady = content.status === "completed";

  // Resolve the document type robustly: `document_type` is optional, so fall
  // back to `gen_doc_type` ("Resume" / "Cover-letter") which is always present.
  const isResume = !(
    content.document_type === "Cover-letter" ||
    content.gen_doc_type === "Cover-letter"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyToClipboard}
              disabled={isProcessing || isFailed}
            >
              <Copy className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={isProcessing || isFailed}
              className="hover:bg-blue-50"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {isResume ? "Resume" : "Cover Letter"}
                </h1>
                <p className="text-sm text-gray-600">
                  Created: {new Date(content.created_at).toLocaleDateString()}{" "}
                  at {new Date(content.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  content.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : content.status === "processing" ||
                        content.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {content.status === "completed"
                  ? "Ready"
                  : content.status === "processing" ||
                      content.status === "pending"
                    ? "Generating..."
                    : "Failed"}
              </div>
            </div>

            {content.user_specifications && (
              <div className="mt-2 rounded-lg border border-gray-200 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Your instructions
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {content.user_specifications}
                </p>
              </div>
            )}
          </div>

          <div className="p-8">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">
                  Your {isResume ? "resume" : "cover letter"} is being
                  generated...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take a few minutes
                </p>
              </div>
            ) : isFailed ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-800 font-medium">
                  Failed to generate content
                </p>
                <p className="text-red-700 text-sm mt-2">
                  Please try creating again
                </p>
              </div>
            ) : content?.resume_text ||
              content?.cover_letter_text ||
              (content as any)?.content ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsContentExpanded((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {isContentExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {isContentExpanded
                    ? "Hide raw content"
                    : "Show raw content (JSON)"}
                </button>
                {isContentExpanded && (
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-800 leading-relaxed text-sm font-mono max-h-[28rem] overflow-auto">
                      {formatContentDisplay(
                        content?.resume_text ||
                          content?.cover_letter_text ||
                          (content as any)?.content,
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-800">No content available yet</p>
              </div>
            )}
          </div>

          {isReady && (
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Generate PDF {isResume ? "Resume" : "Cover Letter"}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {templates.length > 0 && (
                      <Select
                        value={selectedTemplate}
                        onValueChange={setSelectedTemplate}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Button
                      onClick={handleGeneratePdf}
                      disabled={isGeneratingPdf}
                      className="bg-lime-600 hover:bg-lime-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {isGeneratingPdf ? "Generating PDF..." : "Generate PDF"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {isResume
                      ? "Choose a template style for your resume PDF"
                      : "Choose a template style for your cover letter PDF"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {content.document_type}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentDetailPage;
