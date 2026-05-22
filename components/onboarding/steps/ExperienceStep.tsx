"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreateExperienceAction,
  DeleteExperienceAction,
  GetAllExperiencesAction,
  UpdateExperienceAction,
} from "@/action/experience/experience.action";
import { ExperienceGetResponse } from "@/types/experience.types";
import {
  ComplexListManager,
  FormSelect,
  FormText,
  FormTextarea,
  MonthYearRange,
  StepFooter,
  SubmitButton,
  TagInput,
  useEntityCrud,
} from "@/components/onboarding/shared";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job role is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  employment_type: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Freelance",
    "Self-employed",
  ]),
  location_type: z.enum(["Hybrid", "On-site", "Remote"]),
  location_details: z.string().optional(),
  start_month: z.number().int().min(1).max(12).optional(),
  start_year: z.number().int().min(1900).max(2100).optional(),
  end_month: z.number().int().min(1).max(12).optional(),
  end_year: z.number().int().min(1900).max(2100).optional(),
  techStack: z.array(z.string()).default([]).optional(),
  priority: z.number().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const EMPLOYMENT_TYPES = [
  "Full-time", "Part-time", "Contract", "Freelance",
  "Internship", "Temporary", "Self-employed",
].map((v) => ({ value: v, label: v }));

const LOCATION_TYPES = [
  "On-site", "Remote", "Hybrid",
].map((v) => ({ value: v, label: v }));

const DEFAULT_VALUES: ExperienceFormData = {
  company_name: "",
  role: "",
  description: "",
  employment_type: "Full-time",
  location_type: "On-site",
  location_details: undefined,
  start_month: undefined,
  start_year: undefined,
  end_month: undefined,
  end_year: undefined,
  techStack: undefined,
  priority: undefined,
};

const toFormValues = (exp: ExperienceGetResponse): ExperienceFormData => ({
  company_name: exp.company_name ?? "",
  role: exp.role ?? "",
  description: exp.description ?? "",
  employment_type:
    (exp.employment_type as ExperienceFormData["employment_type"]) || "Full-time",
  location_type:
    (exp.location_type as ExperienceFormData["location_type"]) || "On-site",
  location_details: exp.location_details ?? undefined,
  start_month: exp.start_month ?? undefined,
  start_year: exp.start_year ?? undefined,
  end_month: exp.end_month ?? undefined,
  end_year: exp.end_year ?? undefined,
  techStack: exp.techStack ?? [],
  priority: exp.priority ?? undefined,
});

const ExperienceStep: React.FC<StepProps> = () => {
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const crud = useEntityCrud<
    ExperienceGetResponse,
    ExperienceGetResponse,
    ExperienceFormData
  >({
    entityLabel: "Experience",
    fetchList: (token) =>
      GetAllExperiencesAction(token, { sortOrder: "desc" }),
    create: CreateExperienceAction,
    update: UpdateExperienceAction,
    remove: DeleteExperienceAction,
    toFormValues,
    onAfterSubmit: () => form.reset(DEFAULT_VALUES),
  });

  const handleEdit = async (exp: ExperienceGetResponse) => {
    const values = await crud.startEdit(exp);
    if (values) form.reset(values);
  };

  const handleCancelEdit = () => {
    crud.cancelEdit();
    form.reset(DEFAULT_VALUES);
  };

  return (
    <ComplexListManager
      items={crud.items}
      onEdit={handleEdit}
      onDelete={crud.remove}
      deletingId={crud.deletingId}
      editingId={crud.editingId}
      title="Added Experiences"
      renderItemContent={(exp) => (
        <>
          <p className="font-semibold text-gray-900">{exp.role}</p>
          <p className="text-sm text-gray-600">{exp.company_name}</p>
          {exp.employment_type && (
            <p className="text-xs text-gray-500">
              {exp.employment_type}
              {exp.location_type ? ` • ${exp.location_type}` : ""}
            </p>
          )}
          {exp.start_month && exp.start_year && (
            <p className="text-xs text-gray-500 mt-1">
              {MONTH_LABELS[exp.start_month - 1]} {exp.start_year}
              {exp.end_month && exp.end_year && (
                <>
                  {" "}
                  - {MONTH_LABELS[exp.end_month - 1]} {exp.end_year}
                </>
              )}
            </p>
          )}
        </>
      )}
    >
      <form
        onSubmit={form.handleSubmit((data) => crud.submit(data))}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormText
              control={form.control}
              name="company_name"
              label="Company Name"
              required
              placeholder="e.g., Apple, Google"
            />
            <FormText
              control={form.control}
              name="role"
              label="Job Role"
              required
              placeholder="e.g., Senior Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="employment_type"
              label="Employment Type"
              placeholder="Select employment type"
              options={EMPLOYMENT_TYPES}
            />
            <FormSelect
              control={form.control}
              name="location_type"
              label="Location Type"
              placeholder="Select location type"
              options={LOCATION_TYPES}
            />
          </div>

          <FormText
            control={form.control}
            name="location_details"
            label="Location Details"
            placeholder="e.g., San Francisco, CA"
          />

          <MonthYearRange
            control={form.control}
            startMonthName="start_month"
            startYearName="start_year"
            endMonthName="end_month"
            endYearName="end_year"
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            required
            hint="Describe your responsibilities and achievements"
            placeholder="Tell us about your role, responsibilities, and key achievements..."
          />

          <Controller
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <TagInput
                label="Technologies & Tools"
                hint="Add the technologies and tools you used in this role"
                placeholder="e.g., React, Node.js, PostgreSQL"
                value={field.value ?? []}
                onChange={field.onChange}
                noun={{ singular: "skill" }}
              />
            )}
          />
        </div>

        <SubmitButton
          isEditing={!!crud.editingId}
          isSubmitting={crud.isSubmitting}
          entityLabel="Experience"
          onCancelEdit={handleCancelEdit}
        />
      </form>

      <StepFooter helperText="You can add multiple experiences. Add at least one to continue." />
    </ComplexListManager>
  );
};

export default ExperienceStep;
