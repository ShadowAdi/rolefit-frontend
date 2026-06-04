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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
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
        <div className="flex flex-row items-center  justify-between space-x-10">
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

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-lime-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filters & Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-lime-400 focus:ring-lime-400"
              />
            </div>

            <Select
              value={filterType}
              onValueChange={(value: any) => setFilterType(value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-lime-400 focus:ring-lime-400">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Resume">Resumes</SelectItem>
                <SelectItem value="Cover-letter">Cover Letters</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterStatus}
              onValueChange={(value: any) => setFilterStatus(value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-lime-400 focus:ring-lime-400">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortField}
              onValueChange={(value: any) => setSortField(value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-lime-400 focus:ring-lime-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="document_type">Document Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-lime-700">
              {filteredContent.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-lime-700">
              {content.length}
            </span>{" "}
            documents
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Loader className="w-12 h-12 text-lime-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading your content...</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-6 text-lg">No content found</p>
            <Link href="/jd">
              <Button className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-2">
                Create Your First Content
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 rounded-lg font-semibold text-sm text-gray-900 border border-gray-200">
              <button
                onClick={() => handleToggleSort("created_at")}
                className="flex items-center gap-2 hover:text-lime-600"
              >
                Date Created
                {sortField === "created_at" && (
                  <ArrowUpDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleToggleSort("document_type")}
                className="flex items-center gap-2 hover:text-lime-600"
              >
                Type
                {sortField === "document_type" && (
                  <ArrowUpDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleToggleSort("status")}
                className="flex items-center gap-2 hover:text-lime-600"
              >
                Status
                {sortField === "status" && <ArrowUpDown className="w-4 h-4" />}
              </button>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {filteredContent.map((doc) => {
              const docType = getDocumentType(doc);
              const docStatus = getDocumentStatus(doc);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/content/${doc.id}`)}
                >
                  <div className="md:hidden p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-6 h-6 text-gray-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-base">
                            {docType === "Resume" ? "Resume" : "Cover Letter"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(doc.created_at)}
                          </p>
                        </div>
                      </div>
                      {getStatusIcon(docStatus)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(
                          docStatus,
                        )}`}
                      >
                        {docStatus.charAt(0).toUpperCase() + docStatus.slice(1)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={docStatus !== "completed"}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="hidden md:grid grid-cols-4 gap-4 p-5 items-center transition-colors">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(docStatus)}
                      <span className="text-sm text-gray-700">
                        {formatDate(doc.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {docType === "Resume" ? "Resume" : "Cover Letter"}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadgeStyle(
                          docStatus,
                        )}`}
                      >
                        {docStatus.charAt(0).toUpperCase() + docStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={docStatus !== "completed"}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        title={
                          docStatus !== "completed"
                            ? "Download available when completed"
                            : "Download document"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        title="Delete document"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
