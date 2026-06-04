"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { GetAllGeneratedContentAction } from "@/action/content/getAllContent.action";
import {
  DownloadResumePdfAction,
  ListTemplates,
} from "@/action/resume_pdf/resume_pdf.action";
import { GeneratedDocumentResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader,
  Loader2,
  LayoutTemplate,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { usePdfGenerationStatus } from "@/hooks/usePdfGenerationStatus";


interface Template {
  id: string;
  name: string;
  description: string;
}


const getStatus = (doc: GeneratedDocumentResponse) => {
  if (doc.status) return doc.status;
  if (doc.resume_text) return "completed";
  return "pending";
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    completed: {
      label: "Ready",
      icon: <CheckCircle2 className="w-3 h-3" />,
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    processing: {
      label: "Processing",
      icon: <Loader className="w-3 h-3 animate-spin" />,
      cls: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    pending: {
      label: "Pending",
      icon: <Clock className="w-3 h-3" />,
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    failed: {
      label: "Failed",
      icon: <AlertCircle className="w-3 h-3" />,
      cls: "bg-red-50 text-red-700 border border-red-200",
    },
  };
  const cfg = map[status] ?? { label: status, icon: null, cls: "bg-gray-100 text-gray-600 border border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}


export default function ResumeDownloadPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [resumes, setResumes] = useState<GeneratedDocumentResponse[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [isDownloading, setIsDownloading] = useState(false);

  // Live PDF generation status for the resume currently being downloaded
  usePdfGenerationStatus(isDownloading ? selectedId : null, {
    onProcessing: (event) =>
      toast.loading(event.message || "Generating PDF…", { id: "pdf" }),
    onCompleted: () =>
      toast.success("Resume PDF generated", { id: "pdf" }),
    onFailed: (error) =>
      toast.error(error || "Resume PDF generation failed", { id: "pdf" }),
  });

  useEffect(() => {
    const load = async () => {
      if (!token || authLoading) return;
      setIsLoading(true);
      try {
        const [contentRes, tmplRes] = await Promise.all([
          GetAllGeneratedContentAction(token),
          ListTemplates(token),
        ]);

        if (contentRes.success && contentRes.data) {
          const all = contentRes.data as GeneratedDocumentResponse[];
          setResumes(
            all.filter(
              (d) => d.gen_doc_type === "Resume" || d.document_type === "resume"
            )
          );
        }

        const tmplData = (tmplRes as any)?.data?.templates;
        if (Array.isArray(tmplData) && tmplData.length > 0) {
          setTemplates(tmplData);
          setSelectedTemplate(tmplData[0].id);
        } else {
          setTemplates([
            { id: "classic", name: "Classic", description: "Clean single-column layout" },
            { id: "minimalist", name: "Minimalist", description: "Generous white space, very readable" },
            { id: "bold", name: "Bold", description: "Dark header, vivid accent rules" },
          ]);
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [token, authLoading]);


  const handleDownload = async () => {
    if (!token || !selectedId) return;

    const doc = resumes.find((r) => r.id === selectedId);
    if (!doc || getStatus(doc) !== "completed") {
      toast.error("Selected resume is not ready yet");
      return;
    }

    try {
      setIsDownloading(true);
      toast.loading("Generating PDF…", { id: "pdf" });

      const result = await DownloadResumePdfAction(selectedId, token, selectedTemplate);

      if (result.success && result.data) {
        const blob = result.data as Blob;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume_${selectedTemplate}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Resume downloaded!", { id: "pdf" });
      } else {
        toast.error((result as any)?.message ?? "Failed to generate PDF", { id: "pdf" });
      }
    } catch {
      toast.error("Download failed", { id: "pdf" });
    } finally {
      setIsDownloading(false);
    }
  };


  const selectedDoc = resumes.find((r) => r.id === selectedId) ?? null;
  const canDownload =
    selectedId !== null &&
    selectedDoc !== null &&
    getStatus(selectedDoc) === "completed" &&
    !isDownloading;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-lime-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Download Resume</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a generated resume, choose a template, and download your PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Step 1 — Choose a resume
            </p>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-9 h-9 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">No resumes found</p>
                <p className="text-xs text-gray-400">
                  Generate a resume from the content page first.
                </p>
              </div>
            ) : (
              resumes.map((doc, idx) => {
                const status = getStatus(doc);
                const isReady = status === "completed";
                const isSelected = selectedId === doc.id;
                const created = new Date(doc.created_at);

                return (
                  <button
                    key={doc.id}
                    onClick={() => isReady && setSelectedId(doc.id)}
                    disabled={!isReady}
                    className={`w-full text-left bg-white border rounded-lg p-4 transition-all ${
                      isSelected
                        ? "border-lime-500 ring-1 ring-lime-500 shadow-sm"
                        : isReady
                        ? "border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                        : "border-gray-200 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded shrink-0 ${isSelected ? "bg-lime-50" : "bg-gray-50"}`}>
                        <FileText className={`w-4 h-4 ${isSelected ? "text-lime-600" : "text-gray-400"}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">
                            Resume <span className="text-gray-400 font-mono text-xs">#{String(idx + 1).padStart(2, "0")}</span>
                          </span>
                          <StatusBadge status={status} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {created.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}
                          {created.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {doc.user_specifications && (
                          <p className="text-xs text-gray-500 italic mt-1 truncate">
                            "{doc.user_specifications}"
                          </p>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-lime-500 bg-lime-500" : "border-gray-200"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <LayoutTemplate className="w-3.5 h-3.5 text-lime-600" />
                  Step 2 — Template
                </p>
                <div className="space-y-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`w-full text-left px-3 py-2.5 rounded border text-sm transition-colors ${
                        selectedTemplate === t.id
                          ? "border-lime-500 bg-lime-50 text-lime-800"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t.name}</span>
                        {selectedTemplate === t.id && (
                          <Check className="w-3.5 h-3.5 text-lime-600" strokeWidth={3} />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Step 3 — Download
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Resume</span>
                    <span className="text-gray-700 font-medium">
                      {selectedDoc
                        ? `#${String(resumes.findIndex((r) => r.id === selectedId) + 1).padStart(2, "0")}`
                        : <span className="text-gray-300">Not selected</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Template</span>
                    <span className="text-gray-700 font-medium capitalize">{selectedTemplate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Format</span>
                    <span className="text-gray-700 font-medium">PDF</span>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  disabled={!canDownload}
                  className={`w-full rounded-none text-sm flex items-center gap-2 ${
                    canDownload
                      ? "bg-lime-500 hover:bg-lime-600 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </>
                  )}
                </Button>

                {!selectedId && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Select a resume to continue
                  </p>
                )}
                {selectedId && selectedDoc && getStatus(selectedDoc) !== "completed" && (
                  <p className="text-xs text-amber-500 text-center mt-2">
                    Resume is not ready yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}