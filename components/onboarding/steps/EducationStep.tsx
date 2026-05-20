"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { CheckCircle2, Loader2, Pencil, X } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicBase,
  AcademicCreateRequest,
  AcademicCreateRequestSchema,
  AcademicGetResponse,
  AcademicListResponse,
} from "@/types/academic.types";
import {
  CreateAcademicAction,
  GetAllAcademicAction,
  UpdateAcademicAction,
  DeleteAcademicAction,
  GetAcademicAction,
} from "@/action/academic/academic.action";
import { MonthYearPicker } from "@/components/global/MonthYearPickup";
interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString("default", { month: "long" }),
}));

const EducationStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [academics, setAcademics] = useState<AcademicBase[] | []>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alreadyAddedEducation, setAlreadyAddedEducation] = useState<
    AcademicListResponse[]
  >([]);

  const callGetEducation = async () => {
    if (!token) {
      toast.error(`User Not Authenticated`);
      console.error(`User token not found: ${token}`);
      return;
    }
    const { success, data } = await GetAllAcademicAction(token);
    if (success && data) {
      setAlreadyAddedEducation(data);
    }
  };

  useEffect(() => {
    callGetEducation();
  }, [token]);

  const form = useForm<AcademicCreateRequest>({
    resolver: zodResolver(AcademicCreateRequestSchema),
    defaultValues: {
      college_name: "",
      degree_name: "",
      description: undefined,
      end_month: undefined,
      end_year: undefined,
      links: undefined,
      start_month: undefined,
      priority: undefined,
      start_year: undefined,
    },
  });

  const onSubmit = async (data: AcademicCreateRequest) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsLoading(true);
    try {
      const result = editingId
        ? await UpdateAcademicAction(editingId, data, token)
        : await CreateAcademicAction(data, token);

      if (result.success) {
        toast.success(
          editingId
            ? "Academic updated successfully!"
            : "Academic added successfully!",
        );
        resetForm();
        callGetEducation();
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessage = result.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ");
          toast.error(errorMessage);
        } else {
          toast.error(
            result.message ||
              (editingId
                ? "Failed to update academic"
                : "Failed to add academic"),
          );
        }
      }
    } catch (error) {
      console.error("Error adding academic:", error);
      toast.error("An error occurred while adding academic");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (edu: AcademicListResponse) => {
    setEditingId(edu.id);
    try {
      const { success, data } = await GetAcademicAction(edu.id, token!);
      if (success && data) {
        resetForm();
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        toast.error("Failed to load education details");
      }
    } catch (error) {
      console.error("Error loading education details:", error);
      toast.error("An error occurred while loading education details");
    }
  };

  const handleDelete = async (educationId: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    setDeletingId(educationId);
    try {
      const result = await DeleteAcademicAction(educationId, token);
      if (result.success) {
        setAlreadyAddedEducation((prev) =>
          prev.filter((e) => e.id !== educationId),
        );
        toast.success("Education removed");
      } else {
        toast.error(result.message || "Failed to remove Education");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    form.reset({
      college_name: "",
      degree_name: "",
      description: undefined,
      start_month: undefined,
      start_year: undefined,
      end_month: undefined,
      end_year: undefined,
      links: undefined,
      priority: undefined,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {alreadyAddedEducation.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Added Education ({alreadyAddedEducation.length})
            </h3>
            <div className="space-y-3">
              {alreadyAddedEducation.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4 flex items-start justify-between hover:bg-white/50 transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {edu.degree_name}
                    </p>
                    <p className="text-sm text-gray-600">{edu.college_name}</p>
                    {edu.start_year && (
                      <p className="text-xs text-gray-500 mt-1">
                        {edu.start_year}
                        {edu.end_year ? ` - ${edu.end_year}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={editingId === edu.id}
                      onClick={() => handleEdit(edu)}
                      className="text-gray-600 hover:text-lime-700 hover:bg-lime-50"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === edu.id}
                      onClick={() => handleDelete(edu.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === edu.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <X className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6" />
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold block mb-2">
                College/University Name *
              </label>
              <Controller
                control={form.control}
                name="college_name"
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Input
                      placeholder="e.g., Stanford University"
                      {...field}
                      className="h-11 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold block mb-2">
                Degree Name *
              </label>
              <Controller
                control={form.control}
                name="degree_name"
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Input
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      {...field}
                      className="h-11 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="start_month"
              render={({ field: monthField }) => (
                <Controller
                  control={form.control}
                  name="start_year"
                  render={({ field: yearField }) => (
                    <MonthYearPicker
                      label="Start Date"
                      selectedMonth={monthField.value ?? undefined}
                      selectedYear={yearField.value ?? undefined}
                      onMonthChange={(m: number) => monthField.onChange(m)}
                      onYearChange={(y: number) => yearField.onChange(y)}
                      onClear={() => {
                        monthField.onChange(undefined);
                        yearField.onChange(undefined);
                      }}
                    />
                  )}
                />
              )}
            />

            <Controller
              control={form.control}
              name="end_month"
              render={({ field: monthField }) => (
                <Controller
                  control={form.control}
                  name="end_year"
                  render={({ field: yearField }) => (
                    <MonthYearPicker
                      label="End Date"
                      selectedMonth={monthField.value ?? undefined}
                      selectedYear={yearField.value ?? undefined}
                      onMonthChange={(m: number) => monthField.onChange(m)}
                      onYearChange={(y: number) => yearField.onChange(y)}
                      onClear={() => {
                        monthField.onChange(undefined);
                        yearField.onChange(undefined);
                      }}
                    />
                  )}
                />
              )}
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Description *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Describe your academic achievements and coursework
            </p>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Textarea
                    placeholder="Tell us about your academic achievements, relevant coursework, and key accomplishments..."
                    {...field}
                    value={field.value ?? ""}
                    className="min-h-30 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all resize-none"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="h-11 px-4"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-11 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isLoading
              ? editingId
                ? "Updating Education..."
                : "Adding Education..."
              : editingId
                ? "Update Education"
                : "Add Education"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        You can add multiple education entries. Add at least one to continue.
      </p>
    </div>
  );
};

export default EducationStep;
