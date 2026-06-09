"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GetDashboardAction } from "@/action/dashboard/dashboard.action";
import { DashboardResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  FileText,
  FileCheck2,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  FolderGit2,
  GraduationCap,
  Wrench,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token || authLoading) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await GetDashboardAction(token);

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [token, authLoading]);

  
  if (!token) {
    router.push("/login");
    return;
  }


  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const profile = data?.profile;
  const recentJobs = data?.recentJobs ?? [];
  const recentDocuments = data?.recentDocuments ?? [];

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const titleCase = (value: string | null | undefined, fallback: string) =>
    (value || fallback)
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const statusStyles: Record<string, string> = {
    completed: "bg-lime-100 text-lime-700",
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
  };

  const primaryStats = [
    {
      label: "Job Descriptions",
      value: stats?.totalJobDescriptions ?? 0,
      icon: Briefcase,
    },
    {
      label: "Documents Generated",
      value: stats?.totalDocuments ?? 0,
      icon: FileText,
    },
    {
      label: "Resumes",
      value: stats?.totalResumes ?? 0,
      icon: FileCheck2,
    },
    {
      label: "Cover Letters",
      value: stats?.totalCoverLetters ?? 0,
      icon: Mail,
    },
  ];

  const docStatus = [
    {
      label: "Completed",
      value: stats?.completedDocuments ?? 0,
      icon: CheckCircle2,
      accent: "text-lime-600",
      bg: "bg-lime-50",
    },
    {
      label: "In Progress",
      value: stats?.pendingDocuments ?? 0,
      icon: Clock,
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Failed",
      value: stats?.failedDocuments ?? 0,
      icon: XCircle,
      accent: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const profileItems = [
    { label: "Projects", value: profile?.totalProjects ?? 0, icon: FolderGit2 },
    {
      label: "Experiences",
      value: profile?.totalExperiences ?? 0,
      icon: Briefcase,
    },
    { label: "Skills", value: profile?.totalSkills ?? 0, icon: Sparkles },
    { label: "Tools", value: profile?.totalTools ?? 0, icon: Wrench },
    {
      label: "Publications",
      value: profile?.totalPublications ?? 0,
      icon: BookOpen,
    },
    {
      label: "Academics",
      value: profile?.totalAcademics ?? 0,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-950 mb-2">
              Welcome back
              {profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}
            </h1>
            <p className="text-gray-600">
              {profile?.headline ||
                "Here's an overview of your job search activity"}
            </p>
          </div>
          <Button
            onClick={() => router.push("/jd/create")}
            className="bg-lime-500 hover:bg-lime-600 text-white gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            New Job Description
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {profile && !profile.isOnboarded && (
          <div className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-lime-200 bg-lime-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Complete your profile
                </p>
                <p className="text-sm text-gray-600">
                  Finish onboarding to generate better tailored resumes.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/profile")}
              variant="outline"
              className="border-lime-300 text-lime-700 hover:bg-lime-100 gap-1 shrink-0"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {primaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-950">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Document Status
            </h2>
            <p className="text-sm text-gray-600 mb-5">Generation breakdown</p>
            <div className="space-y-3">
              {docStatus.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between rounded-lg ${item.bg} px-4 py-3`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${item.accent}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Your Profile
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              {titleCase(profile?.fullName, "Profile")} · building blocks for
              your resume
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {profileItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lime-600 border border-gray-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-lg font-bold text-gray-900 leading-none">
                        {item.value}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
              <button
                onClick={() => router.push("/jd")}
                className="text-sm font-medium hover:underline cursor-pointer text-lime-600 hover:text-lime-700 flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {recentJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Briefcase className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-600">No job descriptions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/jd/${job.id}`)}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {titleCase(job.roleName, "Untitled Role")}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {titleCase(job.company, "Company not specified")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pl-3">
                      {job.location && (
                        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {job.location}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Recent Documents
            </h2>
            {recentDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-600">
                  No documents generated yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-50 text-lime-600 shrink-0">
                        {doc.type === "Cover-letter" ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <FileCheck2 className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {doc.type === "Cover-letter"
                            ? "Cover Letter"
                            : "Resume"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium capitalize ${
                        statusStyles[doc.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
