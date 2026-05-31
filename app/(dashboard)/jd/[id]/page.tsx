"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GetJDAction, DeleteJDsAction } from "@/action/job-description/jd.action";
import { JobDescriptionResponse } from "@/types/jobDescription.types";
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
import { ChevronLeft, MapPin, DollarSign, Calendar, ChevronDown, Trash2, Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const JDDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token, isLoading: authLoading } = useAuth();
  const jdId = params.id as string;

  const [jd, setJd] = useState<JobDescriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRawJDOpen, setIsRawJDOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJD = async () => {
      if (!token || authLoading || !jdId) return;

      try {
        setIsLoading(true);
        setError(null);

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
        setIsLoading(false);
      }
    };

    fetchJD();
  }, [token, authLoading, jdId]);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const result = await DeleteJDsAction(jdId, token!);

      if (result.success) {
        toast.success("Job description deleted successfully");
        router.push("/jd");
      } else {
        toast.error(result.message || "Failed to delete job description");
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete job description";
      toast.error(errorMsg);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoading) {
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
            variant="outline"
            className="mb-6 gap-2"
            onClick={() => router.push("/jd")}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-red-600 font-medium">{error || "Job description not found"}</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/jd")}
            >
              Return to Job Descriptions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const capitalizedRole = (jd.role_name || "Untitled Role")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const capitalizedCompany = (jd.company || "Company not specified")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/jd")}
            className="hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/jd/${jdId}/edit`)}
              className="hover:bg-gray-200"
            >
              <Edit className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {capitalizedRole}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{capitalizedCompany}</p>

            {/* Key Info Row */}
            <div className="flex flex-wrap gap-6">
              {jd.role_type && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700">
                    {jd.role_type}
                  </span>
                </div>
              )}

              {jd.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{jd.location}</span>
                </div>
              )}

              {jd.location_city && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{jd.location_city}</span>
                </div>
              )}

              {(jd.salary_min || jd.salary_max) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {jd.salary_min && `${jd.salary_min}`}
                    {jd.salary_min && jd.salary_max && " - "}
                    {jd.salary_max && `${jd.salary_max}`}
                    {jd.salary_currency && ` ${jd.salary_currency}`}
                  </span>
                </div>
              )}

              {jd.duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{jd.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Summary */}
            {jd.summary && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{jd.summary}</p>
              </section>
            )}

            {/* Experience Required */}
            {jd.experience_required && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience Required</h2>
                <p className="text-gray-700">{jd.experience_required}</p>
              </section>
            )}

            {/* Tech Stack */}
            {jd.tech_stack && jd.tech_stack.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {jd.tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Required Skills */}
            {jd.required_skills && jd.required_skills.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {jd.required_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Company Information */}
            {jd.company_information && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h2>
                <p className="text-gray-700 leading-relaxed">{jd.company_information}</p>
              </section>
            )}

            {/* Company Website */}
            {jd.company_website_url && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Company Website</h2>
                <a
                  href={jd.company_website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium underline break-all"
                >
                  {jd.company_website_url}
                </a>
              </section>
            )}

            {/* Full Job Description - Collapsible */}
            {jd.raw_jd && (
              <section>
                <button
                  onClick={() => setIsRawJDOpen(!isRawJDOpen)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Full Job Description</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      isRawJDOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                {isRawJDOpen && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{jd.raw_jd}</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Description</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job description? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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

export default JDDetailPage;
