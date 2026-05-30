"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { GetJDAction, UpdateJDAction } from "@/action/job-description/jd.action";
import { JobDescriptionResponse, JobDescriptionUpdateRequest } from "@/types/jobDescription.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const salaryRegex = /^[\d\s\-/.]*$/;

const jdSchema = z
  .object({
    role_name: z.string().min(2, "Role name must be at least 2 characters"),
    company: z.string().min(2, "Company name must be at least 2 characters"),
    role_type: z.enum(["Full-time", "Internship", "Contract"]),
    location: z.enum(["Remote", "Hybrid", "On-site"]),
    location_city: z.string().optional().nullable(),
    salary_min: z
      .string()
      .optional()
      .refine(
        (val) => !val || salaryRegex.test(val.replace(/[$€£¥]/g, "")),
        "Invalid salary format. Use numbers, dashes, or slashes"
      ),
    salary_max: z
      .string()
      .optional()
      .refine(
        (val) => !val || salaryRegex.test(val.replace(/[$€£¥]/g, "")),
        "Invalid salary format. Use numbers, dashes, or slashes"
      ),
    salary_currency: z.string().optional().nullable(),
    duration: z.string().optional().nullable(),
    tech_stack: z.string().optional().nullable(),
    required_skills: z.string().optional().nullable(),
    experience_required: z.string().optional().nullable(),
    summary: z.string().min(20, "Summary must be at least 20 characters"),
    raw_jd: z.string().min(50, "Raw JD must be at least 50 characters"),
    company_name: z.string().optional().nullable(),
    company_information: z
      .string()
      .max(1000, "Company information cannot exceed 1000 characters")
      .optional()
      .nullable(),
    company_website_url: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !val ||
          val === "" ||
          /^https?:\/\/.+\..+/.test(val),
        "Invalid URL. Must start with http:// or https://"
      ),
  })
  .refine(
    (data) => {
      if (data.role_type === "Internship") {
        return (
          (data.salary_min && data.salary_min.trim()) ||
          (data.duration && data.duration.trim())
        );
      }
      return true;
    },
    {
      message:
        "Internships require either a salary range or duration to be specified",
      path: ["duration"],
    }
  );

type JDFormData = z.infer<typeof jdSchema>;

const EditJDPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token, isLoading: authLoading } = useAuth();
  const jdId = params.id as string;

  const [jd, setJd] = useState<JobDescriptionResponse | null>(null);
  const [isLoadingJD, setIsLoadingJD] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<JDFormData>({
    resolver: zodResolver(jdSchema),
  });

  const companyInfo = watch("company_information");

  useEffect(() => {
    const fetchJD = async () => {
      if (!token || authLoading || !jdId) return;

      try {
        setIsLoadingJD(true);
        setFetchError(null);

        const result = await GetJDAction(jdId, token);

        if (result.success && result.data) {
          setJd(result.data);
          reset({
            role_name: result.data.role_name || "",
            company: result.data.company || "",
            role_type: (result.data.role_type as "Full-time" | "Internship" | "Contract") || "Full-time",
            location: (result.data.location as "Remote" | "Hybrid" | "On-site") || "Remote",
            location_city: result.data.location_city || "",
            salary_min: result.data.salary_min || "",
            salary_max: result.data.salary_max || "",
            salary_currency: result.data.salary_currency || "",
            duration: result.data.duration || "",
            tech_stack: result.data.tech_stack?.join(", ") || "",
            required_skills: result.data.required_skills?.join(", ") || "",
            experience_required: result.data.experience_required || "",
            summary: result.data.summary || "",
            raw_jd: result.data.raw_jd || "",
            company_name: result.data.company_name || "",
            company_information: result.data.company_information || "",
            company_website_url: result.data.company_website_url || "",
          });
        } else {
          setFetchError(result.message || "Failed to fetch job description");
        }
      } catch (err) {
        console.error("Error fetching JD:", err);
        setFetchError("Failed to load job description");
      } finally {
        setIsLoadingJD(false);
      }
    };

    fetchJD();
  }, [token, authLoading, jdId, reset]);

  if (authLoading || isLoadingJD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
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
            <p className="text-red-600 font-medium">{fetchError}</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/jd")}
            >
              Return to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!jd) {
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
            <p className="text-gray-600 font-medium">Job description not found</p>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: JDFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload: JobDescriptionUpdateRequest = {
        ...data,
        tech_stack: data.tech_stack
          ? data.tech_stack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        required_skills: data.required_skills
          ? data.required_skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const result = await UpdateJDAction(jdId, payload, token!);

      if (result.success) {
        toast.success("Job description updated successfully");
        router.push(`/jd/${jdId}`);
      } else {
        const errorMsg = result.message || "Failed to update job description";
        setSubmitError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="outline"
          className="mb-6 gap-2"
          onClick={() => router.push(`/jd/${jdId}`)}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">Edit Job Description</h1>
        <p className="text-gray-600 mb-8">Update the job details</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg border">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {submitError}
            </div>
          )}

          <section>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role Name *</label>
                  <Input
                    placeholder="Senior Full-Stack Developer"
                    {...register("role_name")}
                  />
                  {errors.role_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.role_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
                  <Input
                    placeholder="Company name"
                    {...register("company")}
                  />
                  {errors.company && (
                    <p className="text-red-600 text-sm mt-1">{errors.company.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Type *</label>
                  <Controller
                    control={control}
                    name="role_type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location Type *</label>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="On-site">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location Details</label>
                <Input
                  placeholder="City, State"
                  {...register("location_city")}
                />
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Compensation</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Salary Min</label>
                  <Input
                    placeholder="100000"
                    {...register("salary_min")}
                  />
                  {errors.salary_min && (
                    <p className="text-red-600 text-sm mt-1">{errors.salary_min.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Salary Max</label>
                  <Input
                    placeholder="150000"
                    {...register("salary_max")}
                  />
                  {errors.salary_max && (
                    <p className="text-red-600 text-sm mt-1">{errors.salary_max.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <Input
                    placeholder="USD"
                    {...register("salary_currency")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration
                  {watch("role_type") === "Internship" && (
                    <span className="text-red-600 ml-1">*</span>
                  )}
                </label>
                <Input
                  placeholder="6 months, 1 year, Permanent"
                  {...register("duration")}
                />
                {errors.duration && (
                  <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
                )}
                {watch("role_type") === "Internship" && !watch("duration") && (
                  <p className="text-xs text-orange-600 mt-1">
                    Required for internships: provide either duration or salary range
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Experience Required</label>
                <Input
                  placeholder="5+ years experience"
                  {...register("experience_required")}
                />
                <p className="text-xs text-gray-600 mt-1">e.g., "5+ years", "3 years", "Senior (5+ years)"</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tech Stack</label>
                <p className="text-xs text-gray-600 mb-2">Comma-separated (e.g., React, Node.js, PostgreSQL)</p>
                <Textarea
                  placeholder="React, Node.js, PostgreSQL"
                  {...register("tech_stack")}
                  className="min-h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Required Skills</label>
                <p className="text-xs text-gray-600 mb-2">Comma-separated (e.g., Problem solving, System design)</p>
                <Textarea
                  placeholder="Problem solving, System design"
                  {...register("required_skills")}
                  className="min-h-24"
                />
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Description & Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <Input
                  placeholder="Official company name"
                  {...register("company_name")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Website</label>
                <Input
                  placeholder="https://example.com"
                  {...register("company_website_url")}
                />
                {errors.company_website_url && (
                  <p className="text-red-600 text-sm mt-1">{errors.company_website_url.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Information</label>
                <Textarea
                  placeholder="About the company, mission, values..."
                  {...register("company_information")}
                  className="min-h-24"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-600">
                    {(companyInfo?.length || 0)} / 1000 characters
                  </p>
                  {(companyInfo?.length || 0) > 900 && (
                    <p className="text-xs text-orange-600 font-medium">⚠️ Approaching limit</p>
                  )}
                </div>
                {errors.company_information && (
                  <p className="text-red-600 text-sm mt-1">{errors.company_information.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Summary *
                </label>
                <Textarea
                  placeholder="Brief summary of the job role"
                  {...register("summary")}
                  className="min-h-20"
                />
                <p className="text-xs text-gray-600 mt-1">
                  {watch("summary")?.length || 0} / 20+ characters (minimum 20)
                </p>
                {errors.summary && (
                  <p className="text-red-600 text-sm mt-1">{errors.summary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Job Description *
                </label>
                <Textarea
                  placeholder="Complete job description with responsibilities, qualifications, benefits, etc."
                  {...register("raw_jd")}
                  className="min-h-40"
                />
                <p className="text-xs text-gray-600 mt-1">
                  {watch("raw_jd")?.length || 0} / 50+ characters (minimum 50)
                </p>
                {errors.raw_jd && (
                  <p className="text-red-600 text-sm mt-1">{errors.raw_jd.message}</p>
                )}
              </div>
            </div>
          </section>

          <div className="border-t pt-8 flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/jd/${jdId}`)}
              disabled={isSubmitting}
              className="flex-1 rounded-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJDPage;
