"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { GetJDsAction } from "@/action/job-description/jd.action";
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
import {
  ChevronDown,
  FileText,
  Trash2,
  Eye,
  Plus,
  Loader2,
  X,
  Search,
  Briefcase,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { ApiKeyCombobox } from "@/components/global/ApiKeySelector";

const ContentPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const { subscribe } = useWebSocket();

  const getDocumentType = (content: any): "resume" | "cover_letter" => {
    if (content.document_type) return content.document_type;
    if (content.gen_doc_type === "Resume") return "resume";
    if (content.gen_doc_type === "Cover-letter") return "cover_letter";
    return "resume";
  };

  const [jds, setJds] = useState<JobDescriptionResponse[]>([]);
  const [isLoadingJDs, setIsLoadingJDs] = useState(false);
  const [selectedJD, setSelectedJD] = useState<JobDescriptionResponse | null>(
    null,
  );
  const [comboOpen, setComboOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const comboRef = useRef<HTMLDivElement>(null);

  const [contents, setContents] = useState<GeneratedDocumentResponse[]>([]);
  const [isLoadingContents, setIsLoadingContents] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<
    "resume" | "cover_letter" | null
  >(null);
  const [userSpecifications, setUserSpecifications] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContentToDelete, setSelectedContentToDelete] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string>("");
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Fetch all JDs on mount
  useEffect(() => {
    const fetchJDs = async () => {
      if (!token || authLoading) return;
      try {
        setIsLoadingJDs(true);
        const result = await GetJDsAction(token);
        if (result.success && result.data) {
          setJds(result.data);
        }
      } catch (err) {
        console.error("Error fetching JDs:", err);
      } finally {
        setIsLoadingJDs(false);
      }
    };
    fetchJDs();
  }, [token, authLoading]);

  // Close combobox on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setComboOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch contents when JD is selected
  useEffect(() => {
    const fetchContents = async () => {
      if (!token || !selectedJD) return;
      try {
        setIsLoadingContents(true);
        const result = await GetAllContentsAction(selectedJD.id, token);
        if (result.success && result.data) {
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
  }, [token, selectedJD]);

  // WebSocket listener
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      setContents((prev) =>
        prev.map((c) => {
          if (c.id === event.doc_id) return { ...c, status: event.status };
          return c;
        }),
      );
      if (event.status === "completed")
        toast.success("Content generated successfully!");
      if (event.status === "failed")
        toast.error(`Generation failed: ${event.error || event.message}`);
    });
    return unsubscribe;
  }, [subscribe]);

  const filteredJDs = jds.filter(
    (jd) =>
      jd?.role_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jd?.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const resumeCount = contents.filter(
    (c) => getDocumentType(c) === "resume",
  ).length;
  const coverLetterCount = contents.filter(
    (c) => getDocumentType(c) === "cover_letter",
  ).length;
  const canCreateResume = resumeCount < 3;
  const canCreateCoverLetter = coverLetterCount < 3;

  const handleSelectJD = (jd: JobDescriptionResponse) => {
    setSelectedJD(jd);
    setContents([]);
    setComboOpen(false);
    setSearchQuery("");
  };

  const handleCreateContent = async () => {
    if (!selectedJD) {
      toast.error("Please select a job description first");
      return;
    }

    if (!selectedApiKeyId) {
      setApiKeyError("Please select an API key");
      toast.error("Please select an API key");
      return;
    }

    try {
      setIsCreating(true);
      const payload = {
        user_specifications: userSpecifications || "",
        api_key_id: selectedApiKeyId, 
      };

      let result;
      if (contentType === "resume") {
        result = await CreateResumeContentAction(
          payload,
          selectedJD.id,
          token!,
        );
      } else {
        result = await CreateCoverLetterContentAction(
          payload,
          selectedJD.id,
          token!,
        );
      }

      if (result.success && result.data) {
        toast.success(
          `${contentType === "resume" ? "Resume" : "Cover Letter"} generation started`,
        );
        setIsCreateDialogOpen(false);
        setUserSpecifications("");
        setContentType(null);
        setSelectedApiKeyId(""); 
        setApiKeyError(null);

        const newContent: GeneratedDocumentResponse = {
          id: result.data.doc_id,
          resume_text: null,
          cover_letter_text: null,
          userId: "" as any,
          jobId: selectedJD.id as any,
          gen_doc_type: contentType === "resume" ? "Resume" : "Cover-letter",
          user_specifications: userSpecifications || null,
          created_at: new Date().toISOString() as any,
          updated_at: new Date().toISOString() as any,
          status: result.data.status || "pending",
          document_type: (contentType === "resume"
            ? "resume"
            : "Cover-letter") as "resume" | "Cover-letter",
        };

        setContents([newContent, ...contents]);
      } else {
        toast.error((result as any)?.message || "Failed to generate content");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate content",
      );
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
        setContents(contents.filter((c) => c.id !== selectedContentToDelete));
        setIsDeleteDialogOpen(false);
        setSelectedContentToDelete(null);
      } else {
        toast.error((result as any)?.message || "Failed to delete content");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete content",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Generated Content
          </h1>
          <p className="text-gray-500 text-sm">
            Select a job description to manage its resumes and cover letters
          </p>
        </div>

        {/* JD Combobox */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Job Description
          </label>

          <div className="relative" ref={comboRef}>
            <button
              type="button"
              onClick={() => setComboOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md bg-white text-left hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            >
              {selectedJD ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded bg-lime-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-lime-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedJD.role_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedJD.company}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">
                  {isLoadingJDs ? "Loading jobs..." : "Search for a job..."}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-150 ${comboOpen ? "rotate-180" : ""}`}
              />
            </button>

            {comboOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {/* Search input */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                  <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search role or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm outline-none placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Options list */}
                <div className="max-h-56 overflow-y-auto py-1">
                  {isLoadingJDs ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : filteredJDs.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-6">
                      {searchQuery
                        ? "No results found"
                        : "No job descriptions available"}
                    </p>
                  ) : (
                    filteredJDs.map((jd) => (
                      <button
                        key={jd.id}
                        type="button"
                        onClick={() => handleSelectJD(jd)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                          selectedJD?.id === jd.id ? "bg-lime-50" : ""
                        }`}
                      >
                        <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium truncate ${selectedJD?.id === jd.id ? "text-lime-700" : "text-gray-800"}`}
                          >
                            {jd.role_name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {jd.company}
                          </p>
                        </div>
                        {selectedJD?.id === jd.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-lime-500 flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content area — only shown after JD is selected */}
        {selectedJD ? (
          <>
            {/* Create buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Resume
                    </h3>
                    <p className="text-xs text-gray-500">
                      {resumeCount}/3 created
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setContentType("resume");
                    setIsCreateDialogOpen(true);
                  }}
                  disabled={!canCreateResume}
                  className={`w-full rounded-none text-sm ${canCreateResume ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
                  variant={canCreateResume ? "default" : "outline"}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {canCreateResume ? "Create Resume" : "Limit Reached"}
                </Button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-lime-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Cover Letter
                    </h3>
                    <p className="text-xs text-gray-500">
                      {coverLetterCount}/3 created
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setContentType("cover_letter");
                    setIsCreateDialogOpen(true);
                  }}
                  disabled={!canCreateCoverLetter}
                  className={`w-full rounded-none text-sm ${canCreateCoverLetter ? "bg-lime-500 hover:bg-lime-600 text-white" : ""}`}
                  variant={canCreateCoverLetter ? "default" : "outline"}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {canCreateCoverLetter
                    ? "Create Cover Letter"
                    : "Limit Reached"}
                </Button>
              </div>
            </div>

            {/* Content list */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Generated Content
              </h2>

              {isLoadingContents ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"></div>
                    <p className="text-sm text-gray-500">Loading content...</p>
                  </div>
                </div>
              ) : contents.length === 0 ? (
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
                  <p className="text-gray-500 text-sm">
                    No content yet. Create your first resume or cover letter!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {contents.map((content) => (
                    <div
                      key={content.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`p-2.5 rounded ${getDocumentType(content) === "resume" ? "bg-blue-50" : "bg-lime-50"}`}
                        >
                          <FileText
                            className={`w-4 h-4 ${getDocumentType(content) === "resume" ? "text-blue-600" : "text-lime-600"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {getDocumentType(content) === "resume"
                              ? "Resume"
                              : "Cover Letter"}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {new Date(content.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                            content.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : content.status === "processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {content.status}
                        </span>
                      </div>

                      <div className="flex gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/content/${content.id}`)}
                          className="h-8 w-8 hover:bg-blue-50"
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
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-16 text-center">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Select a job description above to get started
            </p>
          </div>
        )}
      </div>

      {/* Create dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsCreateDialogOpen(false)}
          ></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Create {contentType === "resume" ? "Resume" : "Cover Letter"}
              </h2>
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <ApiKeyCombobox
                onApiKeySelect={(keyId: string) => {
                  setSelectedApiKeyId(keyId);
                  setApiKeyError(null);
                }}
                selectedApiKeyId={selectedApiKeyId}
                required={true}
                label="Select API Key"
              />

              {/* User Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Specifications{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <Textarea
                  placeholder="Add any specific requirements or details you'd like included"
                  value={userSpecifications}
                  onChange={(e) => setUserSpecifications(e.target.value)}
                  className="min-h-28 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Skills, achievements, or preferences to highlight.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setUserSpecifications("");
                    setContentType(null);
                    setSelectedApiKeyId("");
                    setApiKeyError(null);
                  }}
                  disabled={isCreating}
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateContent}
                  disabled={isCreating || !selectedApiKeyId}
                  className="bg-lime-500 hover:bg-lime-600 text-white text-sm"
                >
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

      {/* Delete dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
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

export default ContentPage;
