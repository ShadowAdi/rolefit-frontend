"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import {
  ComplexListManager,
  FormText,
  FormTextarea,
  MonthYearRange,
  SubmitButton,
  StepFooter,
  useEntityCrud,
} from "@/components/onboarding/shared";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const DEFAULT_VALUES: AcademicCreateRequest = {
  college_name: "",
  degree_name: "",
  description: undefined,
  start_month: undefined,
  start_year: undefined,
  end_month: undefined,
  end_year: undefined,
  links: undefined,
  priority: undefined,
};

const toFormValues = (
  data: AcademicGetResponse | AcademicListResponse,
): AcademicCreateRequest => ({
  college_name: data.college_name ?? "",
  degree_name: data.degree_name ?? "",
  description: "description" in data ? (data.description ?? undefined) : undefined,
  links: "links" in data ? (data.links ?? undefined) : undefined,
  start_month: "start_month" in data ? (data.start_month ?? undefined) : undefined,
  start_year: data.start_year ?? undefined,
  end_month: "end_month" in data ? (data.end_month ?? undefined) : undefined,
  end_year: data.end_year ?? undefined,
  priority: data.priority ?? undefined,
});

const EducationStep: React.FC<StepProps> = () => {
  const form = useForm<AcademicCreateRequest>({
    resolver: zodResolver(AcademicCreateRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const crud = useEntityCrud<
    AcademicListResponse,
    AcademicGetResponse,
    AcademicCreateRequest
  >({
    entityLabel: "Education",
    fetchList: GetAllAcademicAction,
    fetchOne: GetAcademicAction,
    create: CreateAcademicAction,
    update: UpdateAcademicAction,
    remove: DeleteAcademicAction,
    toFormValues,
    onAfterSubmit: () => form.reset(DEFAULT_VALUES),
  });

  const handleEdit = async (edu: AcademicListResponse) => {
    const values = await crud.startEdit(edu);
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
      loadingEditId={crud.loadingEditId}
      title="Added Education"
      renderItemContent={(edu) => (
        <>
          <p className="font-semibold text-gray-900">{edu.degree_name}</p>
          <p className="text-sm text-gray-600">{edu.college_name}</p>
          {edu.start_year && (
            <p className="text-xs text-gray-500 mt-1">
              {edu.start_year}
              {edu.end_year ? ` - ${edu.end_year}` : ""}
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
              name="college_name"
              label="College/University Name"
              required
              placeholder="e.g., Stanford University"
            />
            <FormText
              control={form.control}
              name="degree_name"
              label="Degree Name"
              required
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>

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
            hint="Describe your academic achievements and coursework"
            placeholder="Tell us about your academic achievements, relevant coursework, and key accomplishments..."
          />
        </div>

        <SubmitButton
          isEditing={!!crud.editingId}
          isSubmitting={crud.isSubmitting}
          entityLabel="Education"
          onCancelEdit={handleCancelEdit}
        />
      </form>

      <StepFooter helperText="You can add multiple education entries. Add at least one to continue." />
    </ComplexListManager>
  );
};

export default EducationStep;
