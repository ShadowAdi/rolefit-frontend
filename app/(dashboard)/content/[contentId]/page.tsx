"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GetContentResumeAction, ContentStatussAction, DeleteContentAction } from "@/action/content/content.action";
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
import { ChevronLeft, Download, Trash2, Share2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const ContentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token, isLoading: authLoading } = useAuth();
  const contentId = params.contentId as string;

  const [content, setContent] = useState<GeneratedDocumentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      if (!token || authLoading || !contentId) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await GetContentResumeAction(contentId, token);

        if (result.success && result.data) {
          setContent(result.data);
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

  // Poll for status updates if processing
  useEffect(() => {
    if (!content || content.status !== "processing" || !token) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      if (!isMounted) return;
      
      try {
        const result = await ContentStatussAction(token, contentId);
        if (result.success && result.data && isMounted) {
          setContent((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              status: (result.data?.status as any) || prev.status,
            };
          });

          if (result.data?.status === "completed") {
            toast.success("Content generation completed!");
          } else if (result.data?.status === "failed") {
            toast.error("Content generation failed");
          }
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [content?.status, token, contentId]);

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
    if ((content as any)?.content) {
      navigator.clipboard.writeText((content as any).content);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!(content as any)?.content || !content) return;

    const element = document.createElement("a");
    const file = new Blob([(content as any).content], { type: "text/plain" });
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
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mb-6">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-red-600 font-medium">{error || "Content not found"}</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = content.status === "processing";
  const isFailed = content.status === "failed";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} disabled={isProcessing || isFailed}>
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

        {/* Content Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Info */}
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {content.document_type === "resume" ? "Resume" : "Cover Letter"}
                </h1>
                <p className="text-sm text-gray-600">
                  Created: {new Date(content.created_at).toLocaleDateString()} at{" "}
                  {new Date(content.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                content.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : content.status === "processing"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}>
                {content.status === "completed"
                  ? "Ready"
                  : content.status === "processing"
                    ? "Generating..."
                    : "Failed"}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Your {content.document_type === "resume" ? "resume" : "cover letter"} is being generated...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few minutes</p>
              </div>
            ) : isFailed ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-800 font-medium">Failed to generate content</p>
                <p className="text-red-700 text-sm mt-2">Please try creating again</p>
              </div>
            ) : (content as any)?.content ? (
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-800 leading-relaxed text-sm font-mono">
                  {(content as any).content}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-800">No content available yet</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            {!isProcessing && !isFailed && (content as any)?.content && (
              <>
                <Button
                  onClick={handleCopyToClipboard}
                  className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {content.document_type}? This action cannot be undone.
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
