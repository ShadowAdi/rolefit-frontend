"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { CreateExperienceAction } from "@/action/experience/experience.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job role is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  employment_type: z.string().optional(),
  location_type: z.string().optional(),
  location_details: z.string().optional(),
  start_month: z.number().int().min(1).max(12).optional(),
  start_year: z.number().int().min(1900).max(2100).optional(),
  end_month: z.number().int().min(1).max(12).optional(),
  end_year: z.number().int().min(1900).max(2100).optional(),
  techStack: z.array(z.string()).default([]).optional(),
  priority: z.number().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString("default", { month: "long" }),
}));

const years = Array.from({ length: 50 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year, label: year.toString() };
});

const ExperienceStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [techStackInput, setTechStackInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceFormData[]>([]);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: "",
      role: "",
      description: "",
      employment_type: undefined,
      location_type: undefined,
      location_details: undefined,
      start_month: undefined,
      start_year: undefined,
      end_month: undefined,
      end_year: undefined,
      techStack: undefined,
      priority: undefined,
    },
  });

  const addTechStack = () => {
    if (techStackInput.trim()) {
      const currentStack = form.getValues("techStack") || [];
      if (!currentStack.includes(techStackInput.trim())) {
        form.setValue("techStack", [
          ...currentStack,
          techStackInput.trim(),
        ]);
        setTechStackInput("");
      }
    }
  };

  const removeTechStack = (tech: string) => {
    const currentStack = form.getValues("techStack") || [];
    form.setValue(
      "techStack",
      currentStack.filter((t) => t !== tech)
    );
  };

  const onSubmit = async (data: ExperienceFormData) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsLoading(true);
    try {
      const result = await CreateExperienceAction(data, token);

      if (result.success) {
        setExperiences([...experiences, data]);
        toast.success("Experience added successfully!");
        form.reset();
        setTechStackInput("");
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessage = result.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ");
          toast.error(errorMessage);
        } else {
          toast.error(result.message || "Failed to add experience");
        }
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error("An error occurred while adding experience");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (experiences.length === 0) {
      toast.error("Please add at least one experience");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Added Experiences List */}
      {experiences.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Added Experiences ({experiences.length})
            </h3>
            <div className="space-y-3">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4 flex items-start justify-between hover:bg-white/50 transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{exp.role}</p>
                    <p className="text-sm text-gray-600">{exp.company_name}</p>
                    {exp.start_month && exp.start_year && (
                      <p className="text-xs text-gray-500 mt-1">
                        {months[exp.start_month - 1].label} {exp.start_year}
                        {exp.end_month && exp.end_year && (
                          <>
                            {" "}
                            - {months[exp.end_month - 1].label} {exp.end_year}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExperiences(
                        experiences.filter((_, i) => i !== idx)
                      );
                      toast.success("Experience removed");
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="size-4" />
                  </Button>
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
                  Company Name *
                </label>
                <Controller
                  control={form.control}
                  name="company_name"
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Input
                        placeholder="e.g., Apple, Google"
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
                  Job Role *
                </label>
                <Controller
                  control={form.control}
                  name="role"
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Input
                        placeholder="e.g., Senior Developer"
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

            {/* Employment Type and Location Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-semibold block mb-2">
                  Employment Type
                </label>
                <Controller
                  control={form.control}
                  name="employment_type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-2">
                  Location Type
                </label>
                <Controller
                  control={form.control}
                  name="location_type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30">
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Location Details */}
            <div>
              <label className="text-gray-700 font-semibold block mb-2">
                Location Details
              </label>
              <Controller
                control={form.control}
                name="location_details"
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Input
                      placeholder="e.g., San Francisco, CA"
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
              <label className="text-gray-700 font-semibold block mb-3">
                Start Date
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="start_month"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger className="h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  control={form.control}
                  name="start_year"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger className="h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem
                            key={year.value}
                            value={year.value.toString()}
                          >
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-semibold block mb-3">
                End Date
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="end_month"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger className="h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  control={form.control}
                  name="end_year"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger className="h-11 border-gray-300 bg-white text-gray-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem
                            key={year.value}
                            value={year.value.toString()}
                          >
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-semibold block mb-2">
                Description *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Describe your responsibilities and achievements
              </p>
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Textarea
                      placeholder="Tell us about your role, responsibilities, and key achievements..."
                      {...field}
                      className="min-h-30 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all resize-none"
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
                Technologies & Tools
              </label>
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
                    className="h-11 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addTechStack}
                    size="sm"
                    className="bg-lime-500 hover:bg-lime-600 text-white"
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
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-sm font-medium"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeTechStack(tech)}
                                className="hover:opacity-70 transition-opacity"
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isLoading ? "Adding Experience..." : "Add Experience"}
          </Button>
        </form>

      <p className="text-center text-sm text-gray-600">
        You can add multiple experiences. Add at least one to continue.
      </p>
    </div>
  );
};

export default ExperienceStep;
