"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "@/action/profile/profile.action";
import {
  ProfileAuthenticatedResponse,
  ProfilePayload,
  ProfileUpdatePayload,
} from "@/types/profile.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Zap,
  User,
  Briefcase,
  FileText,
  Link as LinkIcon,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Edit2,
} from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  headline: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  resume_link: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || isValidUrl(val),
      "Invalid resume link URL"
    ),
  cover_letter_link: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || isValidUrl(val),
      "Invalid cover letter link URL"
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const ProfilePage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileAuthenticatedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      headline: "",
      summary: "",
      resume_link: "",
      cover_letter_link: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
      return;
    }

    if (token) {
      fetchProfile();
    }
  }, [token, authLoading, router]);

  const fetchProfile = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const result = await getProfile(token);

      if (result.success && result.data) {
        setProfile(result.data);
        setValue("full_name", result.data.full_name);
        setValue("headline", result.data.headline || "");
        setValue("summary", result.data.summary || "");
        setValue("resume_link", result.data.resume_link || "");
        setValue("cover_letter_link", result.data.cover_letter_link || "");
        setIsEditing(false);
      } else {
        setProfile(null);
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      let result;

      if (profile) {
        const updatePayload: ProfileUpdatePayload = {
          full_name: data.full_name,
          summary: data.summary || undefined,
          headline: data.headline || undefined,
          resume_link: data.resume_link || undefined,
          cover_letter_link: data.cover_letter_link || undefined,
        };
        result = await updateProfile(token, updatePayload);
      } else {
        const createPayload: ProfilePayload = {
          full_name: data.full_name,
          summary: data.summary || undefined,
          headline: data.headline || undefined,
          resume_link: data.resume_link || undefined,
          cover_letter_link: data.cover_letter_link || undefined,
        };
        result = await createProfile(createPayload, token);
      }

      if (result.success) {
        toast.success(
          profile
            ? "Profile updated successfully!"
            : "Profile created successfully!"
        );
        setIsEditing(false);
        await fetchProfile();
      } else {
        toast.error(result.message || "Failed to save profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("An error occurred while saving profile");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gray-200/40 blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-12 group">
            <div className="size-10 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Zap className="size-5 text-gray-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-950">
              RoleFit
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 mb-2">
              {profile && !isEditing ? "Your Profile" : "Create Your Profile"}
            </h1>
            <p className="text-base text-gray-600">
              {profile && !isEditing
                ? "Manage your professional information"
                : "Set up your professional profile"}
            </p>
          </div>

          {profile && !isEditing ? (
            // View Profile
            <div className="space-y-6 mb-8">
              <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="size-4 text-lime-600" />
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Full Name
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-950">
                    {profile.full_name}
                  </p>
                </div>

                {profile.headline && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="size-4 text-lime-600" />
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Headline
                      </p>
                    </div>
                    <p className="text-gray-700">{profile.headline}</p>
                  </div>
                )}

                {profile.summary && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="size-4 text-lime-600" />
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Summary
                      </p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {profile.summary}
                    </p>
                  </div>
                )}

                {(profile.resume_link || profile.cover_letter_link) && (
                  <div className="pt-2 border-t border-white/40 space-y-3">
                    {profile.resume_link && (
                      <a
                        href={profile.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-lime-600 hover:text-lime-700 font-medium transition-colors"
                      >
                        <LinkIcon className="size-4" />
                        View Resume
                        <ArrowRight className="size-4" />
                      </a>
                    )}
                    {profile.cover_letter_link && (
                      <a
                        href={profile.cover_letter_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-lime-600 hover:text-lime-700 font-medium transition-colors"
                      >
                        <LinkIcon className="size-4" />
                        View Cover Letter
                        <ArrowRight className="size-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full h-11 bg-lime-400 hover:bg-lime-500 text-gray-950 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Edit2 className="size-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          ) : (
            // Edit/Create Form
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="full_name"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <User className="size-4 text-lime-600" />
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  {...register("full_name")}
                  aria-invalid={!!errors.full_name}
                  className="h-11 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors"
                />
                {errors.full_name && (
                  <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="headline"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Briefcase className="size-4 text-lime-600" />
                  Headline
                </Label>
                <Input
                  id="headline"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  {...register("headline")}
                  className="h-11 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors"
                />
                <p className="text-xs text-gray-500">
                  Your professional title or role
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="summary"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <FileText className="size-4 text-lime-600" />
                  Summary
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Tell us about yourself, your experience, and your skills..."
                  {...register("summary")}
                  rows={4}
                  className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500">
                  Share your professional background and expertise
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="resume_link"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <LinkIcon className="size-4 text-lime-600" />
                  Resume Link
                </Label>
                <Input
                  id="resume_link"
                  type="url"
                  placeholder="https://example.com/resume.pdf"
                  {...register("resume_link")}
                  aria-invalid={!!errors.resume_link}
                  className="h-11 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors"
                />
                {errors.resume_link && (
                  <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                    {errors.resume_link.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Link to your resume document
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cover_letter_link"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <LinkIcon className="size-4 text-lime-600" />
                  Cover Letter Link
                </Label>
                <Input
                  id="cover_letter_link"
                  type="url"
                  placeholder="https://example.com/cover-letter.pdf"
                  {...register("cover_letter_link")}
                  aria-invalid={!!errors.cover_letter_link}
                  className="h-11 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-400 focus:ring-lime-400/20 transition-colors"
                />
                {errors.cover_letter_link && (
                  <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                    {errors.cover_letter_link.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Link to your cover letter template
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-lime-400 hover:bg-lime-500 text-gray-950 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      {profile ? "Update Profile" : "Create Profile"}
                      <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
                {profile && (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1 h-11 border-gray-200 text-gray-950 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-lime-400 items-center justify-center p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-md relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
              <CheckCircle2 className="size-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
              Your Profile,
              <br />
              Your Way
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Create a comprehensive profile that showcases your unique skills
              and experience. Use it to tailor your resume for any job.
            </p>
          </div>

          <div className="space-y-5 mt-10">
            {[
              {
                title: "Professional Presence",
                desc: "Build a complete professional profile",
              },
              {
                title: "Easy Updates",
                desc: "Update your information anytime",
              },
              {
                title: "Smart Matching",
                desc: "Your profile fuels our AI matching engine",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="text-sm text-white/90">
              <span className="font-semibold">Pro tip:</span> A complete profile
              helps our AI generate better-tailored resumes that match job
              requirements perfectly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;