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
  deleteProfileAction,
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
  Trash,
} from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  headline: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  resume_link: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || isValidUrl(val), "Invalid resume link URL"),
  cover_letter_link: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || isValidUrl(val), "Invalid cover letter link URL"),
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
  const [profile, setProfile] = useState<ProfileAuthenticatedResponse | null>(
    null,
  );
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

      console.log("fetvhing result ", result);

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
            : "Profile created successfully!",
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

  const deleteProfile = async () => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      if (profile) {
        const response = await deleteProfileAction(token);
        if (response.success) {
          toast.success("Delete Profile Successfull");
          setProfile(null);
        }
      } else {
        toast.error(`Profile do not exist`);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("An error occurred while deleting profile");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-lime-100/20 blur-3xl" />

      <div className="flex items-center justify-center min-h-screen px-4 py-12 relative z-10">
        <div className="w-full max-w-2xl">
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
              <Button
                onClick={() => deleteProfile()}
                className="w-full h-11 bg-stone-900 text-white  font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Trash className="size-4 mr-2" />
                Delete Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="full_name"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <User className="size-5 text-lime-600" />
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  {...register("full_name")}
                  aria-invalid={!!errors.full_name}
                  className="h-12 text-base border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all shadow-sm"
                />
                {errors.full_name && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="headline"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <Briefcase className="size-5 text-lime-600" />
                  Headline
                </Label>
                <Input
                  id="headline"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  {...register("headline")}
                  className="h-12 text-base border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all shadow-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Your professional title or current role
                </p>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="summary"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <FileText className="size-5 text-lime-600" />
                  Professional Summary
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Tell us about yourself, your experience, skills, and career goals..."
                  {...register("summary")}
                  rows={5}
                  className="text-base border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all shadow-sm resize-none"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Share your professional background and key expertise
                </p>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="resume_link"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <LinkIcon className="size-5 text-lime-600" />
                  Resume Link
                </Label>
                <Input
                  id="resume_link"
                  type="url"
                  placeholder="https://example.com/resume.pdf"
                  {...register("resume_link")}
                  aria-invalid={!!errors.resume_link}
                  className="h-12 text-base border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all shadow-sm"
                />
                {errors.resume_link && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.resume_link.message}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  URL to your resume PDF or document
                </p>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="cover_letter_link"
                  className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  <LinkIcon className="size-5 text-lime-600" />
                  Cover Letter Link
                </Label>
                <Input
                  id="cover_letter_link"
                  type="url"
                  placeholder="https://example.com/cover-letter.pdf"
                  {...register("cover_letter_link")}
                  aria-invalid={!!errors.cover_letter_link}
                  className="h-12 text-base border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all shadow-sm"
                />
                {errors.cover_letter_link && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.cover_letter_link.message}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  URL to your cover letter template
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-lime-400 hover:bg-lime-500 text-gray-950 font-bold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      {profile ? "Update Profile" : "Create Profile"}
                      <ArrowRight className="size-5 ml-2" />
                    </>
                  )}
                </Button>
                {profile && (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-gray-300 text-gray-950 font-semibold text-base rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
