"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { GetJDAction } from "@/action/job-description/jd.action";
import {
  CreateResumeContentAction,
  CreateCoverLetterContentAction,
  GetAllContentsAction,
  DeleteContentAction,
} from "@/action/content/content.action";
import { JobDescriptionResponse } from "@/types/jobDescription.types";
import { GeneratedDocumentResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, FileText, Trash2, Eye, Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const JDContentPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token, isLoading: authLoading } = useAuth();
  const { subscribe } = useWebSocket();
  const jdId = params.id as string;

  // Helper function to normalize document type
  const getDocumentType = (content: any): "resume" | "cover_letter" => {
    if (content.document_type) return content.document_type;
    if (content.gen_doc_type === "Resume") return "resume";
    if (content.gen_doc_type === "Cover-letter") return "cover_letter";
    return "resume";
  };

  const [jd, setJd] = useState<JobDescriptionResponse | null>(null);
  const [contents, setContents] = useState<GeneratedDocumentResponse[]>([]);
  const [isLoadingJD, setIsLoadingJD] = useState(true);
  const [isLoadingContents, setIsLoadingContents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<"resume" | "cover_letter" | null>(null);
  const [userSpecifications, setUserSpecifications] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContentToDelete, setSelectedContentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJD = async () => {
      if (!token || authLoading || !jdId) return;

      try {
        setIsLoadingJD(true);
        const result = await GetJDAction(jdId, token);

        if (result.success && result.data) {
          setJd(result.data);
        } else {
          setError(result.message || "Failed to fetch job description");
        }
      } catch (err) {
        console.error("Error fetching JD:", err);
        setError("Failed to load job description");
      } finally {
        setIsLoadingJD(false);
      }
    };

    fetchJD();
  }, [token, authLoading, jdId]);

  useEffect(() => {
    const fetchContents = async () => {
      if (!token || authLoading || !jdId) return;

      try {
        setIsLoadingContents(true);
        const result = await GetAllContentsAction(jdId, token);
        console.log("Results ", result);

        if (result.success && result.data) {
          // Ensure document_type is set from gen_doc_type
          const contentsWithType = (result.data as any[]).map((item) => ({
            ...item,
            document_type:
              item.gen_doc_type === "Resume"
                ? "resume"
                : item.gen_doc_type === "Cover-letter"
                  ? "cover_letter"
                  : item.document_type,
          }));
          setContents(contentsWithType);
        }
      } catch (err) {
        console.error("Error fetching contents:", err);
      } finally {
        setIsLoadingContents(false);
      }
    };

    fetchContents();
  }, [token, authLoading, jdId]);

  // WebSocket listener for real-time content updates
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      console.log("[WS] Content update event:", event);
      
      // Update the content status in real-time
      setContents((prev) =>
        prev.map((c) => {
          if (c.id === event.doc_id) {
            return { ...c, status: event.status };
          }
          return c;
        })
      );

      // If completed, show success
      if (event.status === "completed") {
        toast.success("Content generated successfully!");
      }
      // If failed, show error
      if (event.status === "failed") {
        toast.error(`Generation failed: ${event.error || event.message}`);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  const resumeCount = contents.filter((c) => getDocumentType(c) === "resume").length;
  const coverLetterCount = contents.filter((c) => getDocumentType(c) === "cover_letter").length;

  const canCreateResume = resumeCount < 3;
  const canCreateCoverLetter = coverLetterCount < 3;

  const handleCreateContent = async () => {
    try {
      setIsCreating(true);

      const payload = {
        user_specifications: userSpecifications || "",
      };

      let result;
      if (contentType === "resume") {
        result = await CreateResumeContentAction(payload, jdId, token!);
      } else {
        result = await CreateCoverLetterContentAction(payload, jdId, token!);
      }

      if (result.success && result.data) {
        toast.success(`${contentType === "resume" ? "Resume" : "Cover Letter"} generation started`);
        setIsCreateDialogOpen(false);
        setUserSpecifications("");
        setContentType(null);
        
        // Add the newly created content to the list with initial status from response
        const newContent: GeneratedDocumentResponse = {
          id: result.data.doc_id,
          resume_text: null,
          cover_letter_text: null,
          userId: "" as any,
          jobId: jdId as any,
          gen_doc_type: contentType === "resume" ? "Resume" : "Cover-letter",
          user_specifications: userSpecifications || null,
          created_at: new Date().toISOString() as any,
          updated_at: new Date().toISOString() as any,
          status: result.data.status || "pending",
          document_type: (contentType === "resume" ? "resume" : "cover_letter") as "resume" | "cover_letter",
        };
        
        setContents([newContent, ...contents]);
      } else {
        toast.error((result as any)?.message || "Failed to generate content");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate content";
      toast.error(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!selectedContentToDelete) return;

    try {
      setIsDeleting(true);
      const result = await DeleteContentAction(token!, selectedContentToDelete);

      if (result.success) {
        toast.success("Content deleted successfully");
        setContents(contents.filter((c: GeneratedDocumentResponse) => c.id !== selectedContentToDelete));
        setIsDeleteDialogOpen(false);
        setSelectedContentToDelete(null);
      } else {
        toast.error((result as any)?.message || "Failed to delete content");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete content";
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoadingJD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !jd) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/jd")}
            className="mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-red-600 font-medium">{error || "Job description not found"}</p>
            <Button className="mt-4" onClick={() => router.push("/jd")}>
              Return to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/jd/${jdId}`)}
          className="mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generated Content for {jd.role_name}
          </h1>
          <p className="text-gray-600">{jd.company}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Resume</h3>
                  <p className="text-sm text-gray-600">{resumeCount}/3 created</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Generate a tailored resume for this job description
            </p>
            <Button
              onClick={() => {
                setContentType("resume");
                setIsCreateDialogOpen(true);
              }}
              disabled={!canCreateResume}
              className={`w-full ${canCreateResume ? "bg-blue-500 hover:bg-blue-600" : ""} rounded-none`}
              variant={canCreateResume ? "default" : "outline"}
            >
              <Plus className="w-4 h-4 mr-2" />
              {canCreateResume ? "Create Resume" : "Limit Reached"}
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-lime-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Cover Letter</h3>
                  <p className="text-sm text-gray-600">{coverLetterCount}/3 created</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Generate a tailored cover letter for this job
            </p>
            <Button
              onClick={() => {
                setContentType("cover_letter");
                setIsCreateDialogOpen(true);
              }}
              disabled={!canCreateCoverLetter}
              className={`w-full ${canCreateCoverLetter ? "bg-lime-500 hover:bg-lime-600" : ""} rounded-none`}
              variant={canCreateCoverLetter ? "default" : "outline"}
            >
              <Plus className="w-4 h-4 mr-2" />
              {canCreateCoverLetter ? "Create Cover Letter" : "Limit Reached"}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Content</h2>

          {isLoadingContents ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600">Loading content...</p>
              </div>
            </div>
          ) : contents.length === 0 ? (
            <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-600">No content generated yet. Create your first resume or cover letter!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded ${
                    getDocumentType(content) === "resume" ? "bg-blue-100" : "bg-green-100"
                  }`}>
                    <FileText
                      className={`w-5 h-5 ${
                        getDocumentType(content) === "resume" ? "text-blue-600" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {getDocumentType(content) === "resume" ? "Resume" : "Cover Letter"}
                    </h3>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(content.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      content.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : content.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {content.status}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/content/${content.id}`)}
                      className="hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedContentToDelete(content.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsCreateDialogOpen(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Create {contentType === "resume" ? "Resume" : "Cover Letter"}
              </h2>
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Specifications (Optional)</label>
                <Textarea
                  placeholder="Add any specific requirements or details you'd like included"
                  value={userSpecifications}
                  onChange={(e) => setUserSpecifications(e.target.value)}
                  className="min-h-32"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Share any additional skills, achievements, or preferences you want highlighted.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setUserSpecifications("");
                    setContentType(null);
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateContent} disabled={isCreating} className="bg-lime-500 hover:bg-lime-600 text-white">
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContent}
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

export default JDContentPage;
