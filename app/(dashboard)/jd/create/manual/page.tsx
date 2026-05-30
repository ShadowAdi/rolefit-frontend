"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { CreateJDAction } from "@/action/job-description/jd.action";
import { JobDescriptionCreateRequest } from "@/types/jobDescription.types";
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

const jdSchema = z.object({
  role_name: z.string().min(2, "Role name is required"),
  company: z.string().min(2, "Company name is required"),
  role_type: z.enum(["Full-time", "Internship", "Contract"]),
  location: z.enum(["Remote", "Hybrid", "On-site"]),
  location_city: z.string().optional(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  salary_currency: z.string().optional(),
  duration: z.string().optional(),
  tech_stack: z.string().optional(),
  required_skills: z.string().optional(),
  experience_required: z.string().optional(),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  raw_jd: z.string().min(50, "Raw JD must be at least 50 characters"),
  company_name: z.string().optional(),
  company_information: z.string().max(1000, "Maximum 1000 characters").optional(),
  company_website_url: z.string().url().optional().or(z.literal("")),
});

type JDFormData = z.infer<typeof jdSchema>;

const ManualJDPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JDFormData>({
    resolver: zodResolver(jdSchema),
    defaultValues: {
      role_type: "Full-time",
      location: "Remote",
    },
  });

  const companyInfo = watch("company_information");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => router.push("/login")}>Log in</Button>
      </div>
    );
  }

  const onSubmit = async (data: JDFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload: JobDescriptionCreateRequest = {
        ...data,
        tech_stack: data.tech_stack
          ? data.tech_stack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        required_skills: data.required_skills
          ? data.required_skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const result = await CreateJDAction(payload, token);

      if (result.success) {
        toast.success("Job description created");
        router.push("/jd");
      } else {
        const errorMsg = result.message || "Failed to create job description";
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
          onClick={() => router.push("/jd/create")}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">Create Job Description</h1>
        <p className="text-gray-600 mb-8">Fill in the job details manually</p>

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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Salary Max</label>
                  <Input
                    placeholder="150000"
                    {...register("salary_max")}
                  />
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
                <label className="block text-sm font-medium mb-1">Duration</label>
                <Input
                  placeholder="6 months, 1 year, Permanent"
                  {...register("duration")}
                />
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tech Stack</label>
                <p className="text-xs text-gray-600 mb-2">Comma-separated</p>
                <Textarea
                  placeholder="React, Node.js, PostgreSQL"
                  {...register("tech_stack")}
                  className="min-h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Required Skills</label>
                <p className="text-xs text-gray-600 mb-2">Comma-separated</p>
                <Textarea
                  placeholder="Problem solving, System design"
                  {...register("required_skills")}
                  className="min-h-24"
                />
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
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
                  placeholder="About the company"
                  {...register("company_information")}
                  className="min-h-20"
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-600">
                    {(companyInfo?.length || 0)} / 1000 characters
                  </p>
                  {(companyInfo?.length || 0) > 900 && (
                    <p className="text-xs text-orange-600">Approaching limit</p>
                  )}
                </div>
                {errors.company_information && (
                  <p className="text-red-600 text-sm mt-1">{errors.company_information.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Summary *</label>
                <Textarea
                  placeholder="Brief summary"
                  {...register("summary")}
                  className="min-h-20"
                />
                {errors.summary && (
                  <p className="text-red-600 text-sm mt-1">{errors.summary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Job Description *</label>
                <Textarea
                  placeholder="Complete job description"
                  {...register("raw_jd")}
                  className="min-h-40"
                />
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
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/jd/create")}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualJDPage;
