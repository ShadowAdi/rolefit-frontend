"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GetAllGeneratedContentAction } from "@/action/content/getAllContent.action";
import { GeneratedDocumentResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Filter,
  SearchIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type SortField = "created_at" | "document_type" | "status";
type SortOrder = "asc" | "desc";

export default function AllContentPage() {
  const router = useRouter();
  const { token, isLoading: authLoading, user } = useAuth();
  const [content, setContent] = useState<GeneratedDocumentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<
    "all" | "Resume" | "Cover-letter"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "processing" | "completed" | "failed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const fetchContent = async () => {
      if (!token || authLoading) return;

      try {
        setIsLoading(true);
        const result = await GetAllGeneratedContentAction(token);
        if (result.success && result.data) {
          setContent(result.data);
        } else {
          toast.error(result.errors?.[0].message || "Failed to load content");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        toast.error("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [token, authLoading]);

  const getDocumentStatus = (doc: GeneratedDocumentResponse) => {
    if (doc.status) return doc.status;
    if (doc.cover_letter_text || doc.resume_text) return "completed";
    return "pending";
  };

  const getDocumentType = (doc: GeneratedDocumentResponse) => {
    return doc.gen_doc_type || doc.document_type || "unknown";
  };

  const filteredContent = content
    .filter((doc) => {
      const docType = getDocumentType(doc);
      const docStatus = getDocumentStatus(doc);
      const typeMatch = filterType === "all" || docType === filterType;
      const statusMatch = filterStatus === "all" || docStatus === filterStatus;
      const searchMatch =
        searchQuery === "" ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        docType.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && statusMatch && searchMatch;
    })
    .sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";

      if (sortField === "created_at") {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      } else if (sortField === "document_type") {
        aVal = getDocumentType(a);
        bVal = getDocumentType(b);
      } else if (sortField === "status") {
        aVal = getDocumentStatus(a);
        bVal = getDocumentStatus(b);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (
    status: string,
  ): "default" | "success" | "warning" | "error" | "secondary" => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "secondary";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-lime-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-lime-600" />
    );
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          style: "bg-emerald-50 text-emerald-700 border border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "processing":
        return {
          icon: <Loader className="w-3.5 h-3.5 animate-spin" />,
          style: "bg-blue-50 text-blue-700 border border-blue-200",
          dot: "bg-blue-500",
        };
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          style: "bg-amber-50 text-amber-700 border border-amber-200",
          dot: "bg-amber-400",
        };
      case "failed":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          style: "bg-red-50 text-red-700 border border-red-200",
          dot: "bg-red-500",
        };
      default:
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          style: "bg-gray-50 text-gray-600 border border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col mb-4 sm:mb-0 items-start sm:flex-row sm:items-center  justify-between space-10">
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Your Documents
            </h1>
            <p className="text-gray-600 text-lg">
              View and manage all your AI-generated resumes and cover letters
            </p>
          </div>
          <Link href={"/content/add"}>
            <Button className="bg-lime-500 hover:bg-lime-600 px-4 py-5 rounded-none text-base  cursor-pointer text-white">
              Create Content
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-8 mb-10">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {content.length}
            </span>
            <span className="text-gray-600">Documents</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-lime-600">
              {
                content.filter((c) => getDocumentStatus(c) === "completed")
                  .length
              }
            </span>
            <span className="text-gray-600">Ready</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {
                content.filter((c) => getDocumentStatus(c) === "processing")
                  .length
              }
            </span>
            <span className="text-gray-600">Processing</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm border-gray-200 focus:border-lime-400 focus:ring-lime-400 rounded-md"
              />
            </div>

            {/* Type filter */}
            <Select
              value={filterType}
              onValueChange={(v: any) => setFilterType(v)}
            >
              <SelectTrigger className="h-9 text-sm border-gray-200 w-full sm:w-36 rounded-md">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Resume">Resume</SelectItem>
                <SelectItem value="Cover-letter">Cover Letter</SelectItem>
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select
              value={filterStatus}
              onValueChange={(v: any) => setFilterStatus(v)}
            >
              <SelectTrigger className="h-9 text-sm border-gray-200 w-full sm:w-36 rounded-md">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortField}
              onValueChange={(v: any) => setSortField(v)}
            >
              <SelectTrigger className="h-9 text-sm border-gray-200 w-full sm:w-36 rounded-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="document_type">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredContent.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {content.length}
            </span>{" "}
            documents
          </p>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
            <Loader className="w-8 h-8 text-lime-500 mx-auto mb-3 animate-spin" />
            <p className="text-sm text-gray-500">Loading your documents...</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-16 text-center">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600 mb-1">
              No documents found
            </p>
            <p className="text-xs text-gray-400 mb-5">
              {searchQuery || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Create your first resume or cover letter to get started"}
            </p>
            {!searchQuery && filterType === "all" && filterStatus === "all" && (
              <Link href="/content/add">
                <Button className="bg-lime-500 hover:bg-lime-600 text-white text-sm rounded-none">
                  Create Content
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <button
                onClick={() => handleToggleSort("document_type")}
                className="col-span-3 flex items-center gap-1.5 hover:text-gray-800 transition-colors text-left"
              >
                Type <SortIcon field="document_type" />
              </button>
              <button
                onClick={() => handleToggleSort("status")}
                className="col-span-2 flex items-center gap-1.5 hover:text-gray-800 transition-colors text-left"
              >
                Status <SortIcon field="status" />
              </button>
              <div className="col-span-2 text-gray-500">Specs</div>
              <button
                onClick={() => handleToggleSort("created_at")}
                className="col-span-3 flex items-center gap-1.5 hover:text-gray-800 transition-colors text-left"
              >
                Created <SortIcon field="created_at" />
              </button>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredContent.map((doc) => {
                const docType = getDocumentType(doc);
                const docStatus = getDocumentStatus(doc);
                const statusConfig = getStatusConfig(docStatus);
                const { date, time } = formatDate(doc.created_at);
                const isResume = docType === "Resume";

                return (
                  <div
                    key={doc.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/content/${doc.id}`)}
                  >
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded ${isResume ? "bg-blue-50" : "bg-lime-50"} flex-shrink-0`}
                      >
                        <FileText
                          className={`w-4 h-4 ${isResume ? "text-blue-500" : "text-lime-600"}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {isResume ? "Resume" : "Cover Letter"}
                        </p>
                        <p className="text-xs text-gray-400 truncate font-mono">
                          #{doc.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.style}`}
                      >
                        {statusConfig.icon}
                        {docStatus.charAt(0).toUpperCase() + docStatus.slice(1)}
                      </span>
                    </div>

                    <div className="col-span-2">
                      {doc.user_specifications ? (
                        <span
                          className="text-xs text-gray-500 line-clamp-1 truncate block max-w-[120px]"
                          title={doc.user_specifications}
                        >
                          {doc.user_specifications}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>

                    <div className="col-span-3">
                      <p className="text-sm text-gray-700">{date}</p>
                      <p className="text-xs text-gray-400">{time}</p>
                    </div>

                    <div
                      className="col-span-2 flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => router.push(`/content/${doc.id}`)}
                        className="p-1.5 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        disabled={docStatus !== "completed"}
                        className="p-1.5 rounded hover:bg-lime-50 hover:text-lime-600 text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={
                          docStatus !== "completed"
                            ? "Available when completed"
                            : "Download"
                        }
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                {filteredContent.length} document
                {filteredContent.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
