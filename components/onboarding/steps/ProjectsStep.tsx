"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreateProjectAction,
  DeleteProjectsAction,
  GetAllProjectsAction,
  GetProjectAction,
  UpdateProjectsAction,
} from "@/action/project/project.action";
import {
  ProjectCreateRequest,
  ProjectGetResponse,
  ProjectListResponse,
} from "@/types";
import {
  ComplexListManager,
  DateRange,
  FormText,
  FormTextarea,
  LinksInput,
  StepFooter,
  SubmitButton,
  TagInput,
  useEntityCrud,
} from "@/components/onboarding/shared";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const projectSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    techStack: z.array(z.string()).nullable().optional(),
    links: z.record(z.string(), z.string()).nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate) <= new Date(data.endDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

type ProjectFormData = z.infer<typeof projectSchema>;

const DEFAULT_VALUES: ProjectFormData = {
  title: "",
  description: "",
  techStack: undefined,
  links: undefined,
  startDate: undefined,
  endDate: undefined,
};

const toISODateString = (iso?: string | null) => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().split("T")[0];
};

const toFormValues = (
  data: ProjectGetResponse | ProjectListResponse,
): ProjectFormData => ({
  title: data.title ?? "",
  description: "description" in data ? (data.description ?? "") : "",
  techStack: data.techStack ?? [],
  links: "links" in data ? (data.links ?? undefined) : undefined,
  startDate: toISODateString(data.startDate),
  endDate: toISODateString(data.endDate),
});

const buildPayload = (data: ProjectFormData): ProjectCreateRequest => ({
  title: data.title,
  description: data.description,
  techStack: data.techStack,
  links: data.links ?? undefined,
  startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
  endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
});

const ProjectsStep: React.FC<StepProps> = () => {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const crud = useEntityCrud<
    ProjectListResponse,
    ProjectGetResponse,
    ProjectFormData
  >({
    entityLabel: "Project",
    fetchList: GetAllProjectsAction,
    fetchOne: GetProjectAction,
    create: (data, token) => CreateProjectAction(buildPayload(data), token),
    update: (id, data, token) => UpdateProjectsAction(token, id, buildPayload(data)),
    remove: (id, token) => DeleteProjectsAction(token, id),
    toFormValues,
    onAfterSubmit: () => form.reset(DEFAULT_VALUES),
  });

  const handleEdit = async (project: ProjectListResponse) => {
    const values = await crud.startEdit(project);
    if (values) form.reset(values);
  };

  const handleCancelEdit = () => {
    crud.cancelEdit();
    form.reset(DEFAULT_VALUES);
  };

  return (
    <div className="space-y-8">
      <ComplexListManager
        items={crud.items}
        onEdit={handleEdit}
        onDelete={crud.remove}
        deletingId={crud.deletingId}
        editingId={crud.editingId}
        loadingEditId={crud.loadingEditId}
        title="Added Projects"
        renderItemContent={(project) => (
          <>
            <p className="font-semibold text-gray-900">{project.title}</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {(project.description ?? "").slice(0, 60)}
              {(project.description ?? "").length > 60 ? "..." : ""}
            </p>
            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{project.techStack.length - 3} more
                  </span>
                )}
              </div>
            )}
          </>
        )}
      >
        <form
          onSubmit={form.handleSubmit((data) => crud.submit(data))}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormText
              control={form.control}
              name="title"
              label="Project Title"
              required
              placeholder="e.g., E-commerce Platform"
            />

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              required
              placeholder="Describe your project..."
              className="min-h-24"
            />

            <DateRange
              control={form.control}
              startName="startDate"
              endName="endDate"
            />

            <Controller
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <TagInput
                  label="Tech Stack"
                  hint="Add the technologies and tools used in this project"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  noun={{ singular: "technology", plural: "technologies" }}
                />
              )}
            />

            <Controller
              control={form.control}
              name="links"
              render={({ field }) => (
                <LinksInput
                  label="Project Links"
                  hint="Add links to your project (GitHub, live demo, docs, etc.)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <SubmitButton
            isEditing={!!crud.editingId}
            isSubmitting={crud.isSubmitting}
            entityLabel="Project"
            onCancelEdit={handleCancelEdit}
          />
        </form>
      </ComplexListManager>

      <StepFooter helperText="You can add multiple projects. Add at least one to continue." />
    </div>
  );
};

export default ProjectsStep;
