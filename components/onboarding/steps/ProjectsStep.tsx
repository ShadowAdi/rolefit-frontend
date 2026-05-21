"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, X, Pencil } from "lucide-react";
import { z } from "zod";
import { ProjectListResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  CreateProjectAction,
  GetAllProjectsAction,
  GetProjectAction,
  UpdateProjectsAction,
  DeleteProjectsAction,
} from "@/action/project/project.action";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/global/DatePicker";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const projectSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
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

const ProjectsStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [techStackInput, setTechStackInput] = useState("");
  const [linkKey, setLinkKey] = useState("");
  const [linkValue, setLinkValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alreadyAddedProject, setAlreadyAddedProject] = useState<
    ProjectListResponse[]
  >([]);

  const callGetProject = async () => {
    if (!token) {
      toast.error("User Not Authenticated");
      console.error("User token not found");
      return;
    }
    const { success, data } = await GetAllProjectsAction(token);
    if (success && data) {
      setAlreadyAddedProject(data);
    }
  };

  useEffect(() => {
    callGetProject();
  }, [token]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      description: "",
      endDate: undefined,
      links: undefined,
      startDate: undefined,
      title: "",
      techStack: undefined,
    },
  });

  const addTechStack = () => {
    if (techStackInput.trim()) {
      const currentStack = form.getValues("techStack") || [];
      if (!currentStack.includes(techStackInput.trim())) {
        form.setValue("techStack", [...currentStack, techStackInput.trim()]);
        setTechStackInput("");
      } else {
        toast.info("This tech is already added");
      }
    }
  };

  const removeTechStack = (tech: string) => {
    const currentStack = form.getValues("techStack") || [];
    form.setValue(
      "techStack",
      currentStack.filter((t) => t !== tech),
    );
  };

  const addLink = () => {
    if (linkKey.trim() && linkValue.trim()) {
      const currentLinks = form.getValues("links") || {};
      if (!currentLinks[linkKey]) {
        form.setValue("links", { ...currentLinks, [linkKey]: linkValue });
        setLinkKey("");
        setLinkValue("");
      } else {
        toast.info("This link key already exists");
      }
    } else {
      toast.error("Please enter both link name and URL");
    }
  };

  const removeLink = (key: string) => {
    const currentLinks = form.getValues("links") || {};
    const newLinks = { ...currentLinks };
    delete newLinks[key];
    form.setValue("links", Object.keys(newLinks).length > 0 ? newLinks : undefined);
  };

  const resetForm = () => {
    form.reset({
      description: "",
      endDate: undefined,
      links: undefined,
      startDate: undefined,
      title: "",
      techStack: undefined,
    });
    setTechStackInput("");
    setLinkKey("");
    setLinkValue("");
    setEditingId(null);
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsLoading(true);
    try {
      // Convert date strings to ISO datetime if needed
      const payload = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };

      const result = editingId
        ? await UpdateProjectsAction(token, editingId, payload)
        : await CreateProjectAction(payload, token);

      if (result.success) {
        toast.success(
          editingId
            ? "Project updated successfully!"
            : "Project added successfully!",
        );
        resetForm();
        callGetProject();
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessage = result.errors
            .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
            .join(" • ");
          toast.error(errorMessage);
        } else {
          toast.error(
            result.message ||
              (editingId ? "Failed to update project" : "Failed to add project"),
          );
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("An error occurred while saving project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (project: ProjectListResponse) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setLoadingEditId(project.id);
    const { success, data, message } = await GetProjectAction(project.id, token);
    setLoadingEditId(null);

    if (!success || !data) {
      toast.error(message || "Failed to load project details");
      return;
    }

    setEditingId(data.id);
    const startDateStr = data.startDate
      ? new Date(data.startDate).toISOString().split("T")[0]
      : undefined;
    const endDateStr = data.endDate
      ? new Date(data.endDate).toISOString().split("T")[0]
      : undefined;

    form.reset({
      title: data.title ?? "",
      description: data.description ?? "",
      techStack: data.techStack ?? [],
      links: data.links ?? undefined,
      startDate: startDateStr,
      endDate: endDateStr,
    });
    setTechStackInput("");
    setLinkKey("");
    setLinkValue("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (alreadyAddedProject.length === 0) {
      toast.error("Please add at least one project");
      return;
    }
    onNext();
  };

  const handleDelete = async (projectId: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    setDeletingId(projectId);
    try {
      const result = await DeleteProjectsAction(token, projectId);
      if (result.success) {
        setAlreadyAddedProject((prev) =>
          prev.filter((p) => p.id !== projectId),
        );
        toast.success("Project removed");
      } else {
        toast.error(result.message || "Failed to remove project");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {alreadyAddedProject.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Added Projects ({alreadyAddedProject.length})
            </h3>
            <div className="space-y-3">
              {alreadyAddedProject.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4 flex items-start justify-between hover:bg-white/50 transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{project.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description.slice(0,60)+"..."}
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
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={
                        editingId === project.id ||
                        loadingEditId === project.id
                      }
                      onClick={() => handleEdit(project)}
                      className="text-gray-600 hover:text-lime-700 hover:bg-lime-50"
                    >
                      {loadingEditId === project.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Pencil className="size-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === project.id}
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === project.id ? (
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
          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Project Title *
            </label>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Input
                    placeholder="e.g., E-commerce Platform"
                    {...field}
                    className="h-11 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Description *
            </label>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Textarea
                    placeholder="Describe your project..."
                    {...field}
                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all min-h-24"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder="Select start date"
                  maxDate={form.watch("endDate") ?? undefined}
                />
              )}
            />

            <Controller
              control={form.control}
              name="endDate"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <DatePicker
                    label="End Date"
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Select end date"
                    minDate={form.watch("startDate") ?? undefined}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Tech Stack
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Add the technologies and tools used in this project
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechStack();
                    }
                  }}
                  className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all flex-1 rounded-lg"
                />
                <Button
                  type="button"
                  onClick={addTechStack}
                  size="sm"
                  className="bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg h-11 px-4 transition-all shadow-sm hover:shadow-md shrink-0"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <Controller
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <>
                    {field.value && field.value.length > 0 && (
                      <div className="bg-white/50 border border-lime-200 rounded-lg p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {field.value.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-medium hover:bg-lime-100 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                              <span>{tech}</span>
                              <button
                                type="button"
                                onClick={() => removeTechStack(tech)}
                                className="text-lime-500 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/60"
                                aria-label={`Remove ${tech}`}
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-lime-600 mt-2 font-medium">
                          {field.value.length} technolog
                          {field.value.length !== 1 ? "ies" : "y"} added
                        </p>
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Project Links
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Add links to your project (GitHub, live demo, docs, etc.)
            </p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={linkKey}
                  onChange={(e) => setLinkKey(e.target.value)}
                  placeholder="Label (e.g., GitHub)"
                  className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all sm:flex-1 sm:max-w-[180px] rounded-lg"
                />
                <div className="flex gap-2 flex-1">
                  <Input
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLink();
                      }
                    }}
                    placeholder="https://..."
                    className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all flex-1 rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={addLink}
                    size="sm"
                    className="bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg h-11 px-4 transition-all shadow-sm hover:shadow-md shrink-0"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {form.watch("links") &&
                Object.keys(form.watch("links")!).length > 0 && (
                  <div className="bg-white/50 border border-lime-200 rounded-lg p-3 space-y-1.5">
                    {Object.entries(form.watch("links")!).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-lime-50 border border-lime-200 px-3 py-2 rounded-lg gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {key}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {value}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLink(key)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white/60 shrink-0"
                          aria-label={`Remove ${key}`}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                    <p className="text-[11px] text-lime-600 mt-2 font-medium">
                      {Object.keys(form.watch("links")!).length} link
                      {Object.keys(form.watch("links")!).length !== 1 ? "s" : ""} added
                    </p>
                  </div>
                )}
            </div>
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
                ? "Updating Project..."
                : "Adding Project..."
              : editingId
                ? "Update Project"
                : "Add Project"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        You can add multiple projects. Add at least one to continue.
      </p>

      <div className="border-t border-gray-200 pt-6 flex gap-3">
        <Button
          onClick={handleNext}
          className="flex-1 h-11 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Next
        </Button>
        {onSkip && (
          <Button
            onClick={onSkip}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 h-11 px-4"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectsStep;
