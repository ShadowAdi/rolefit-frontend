"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, X, Pencil } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { PublicationListResponse } from "@/types";
import { DeletePublication, GetAllPublications, CreatePublication, UpdatePublication, GetPublication } from "@/action/publication/publication.action";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/global/DatePicker";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publisher: z.string().min(1, "Publisher is required"),
  publication_date: z.string().nullable().optional(),
  authors: z.array(z.string()),
  description: z.string().min(10, "Description must be at least 10 characters"),
  url: z.string().url("Please enter a valid URL"),
});

type PublicationFormData = z.infer<typeof publicationSchema>;

const PublicationsStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authorsInput, setAuthorsInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alreadyAddedPublication, setAlreadyAddedPublication] = useState<
    PublicationListResponse[]
  >([]);

  const callGetPublication = async () => {
    if (!token) {
      console.log("Token not available yet, skipping publication fetch");
      return;
    }
    try {
      const { success, data } = await GetAllPublications(token);
      if (success && data) {
        setAlreadyAddedPublication(data);
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  };

  useEffect(() => {
    if (token) {
      callGetPublication();
    }
  }, [token]);

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      authors: [],
      description: "",
      publication_date: undefined,
      publisher: "",
      title: "",
      url: "",
    },
  });

  const addAuthors = () => {
    if (authorsInput.trim()) {
      const currentAuthors = form.getValues("authors") || [];
      if (!currentAuthors.includes(authorsInput.trim())) {
        form.setValue("authors", [...currentAuthors, authorsInput.trim()]);
        setAuthorsInput("");
      } else {
        toast.info("This Author is already added");
      }
    }
  };

  const removeAuthor = (auth: string) => {
    const currentAuthors = form.getValues("authors") || [];
    form.setValue(
      "authors",
      currentAuthors.filter((a) => a !== auth),
    );
  };
  const resetForm = () => {
    form.reset({
      authors:[],
      description:"",
      publication_date:undefined,
      publisher:"",
      title:"",
      url:""
    });
    setAuthorsInput("");
    setEditingId(null);
  };

  const onSubmit = async (data: PublicationFormData) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        publisher: data.publisher,
        authors: data.authors,
        description: data.description,
        url: data.url,
        ...(data.publication_date && {
          publication_date: new Date(data.publication_date).toISOString(),
        }),
      };

      const result = editingId
        ? await UpdatePublication(editingId, payload, token)
        : await CreatePublication(payload, token);

      if (result.success) {
        toast.success(
          editingId
            ? "Publication updated successfully!"
            : "Publication added successfully!",
        );
        resetForm();
        callGetPublication();
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessage = result.errors
            .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
            .join(" • ");
          toast.error(errorMessage);
        } else {
          toast.error(
            result.message ||
              (editingId
                ? "Failed to update publication"
                : "Failed to add publication"),
          );
        }
      }
    } catch (error) {
      console.error("Error saving publication:", error);
      toast.error("An error occurred while saving publication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (publication: PublicationListResponse) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setEditingId(publication.id);
    const pubDateStr = publication.publication_date
      ? new Date(publication.publication_date).toISOString().split("T")[0]
      : undefined;

    form.reset({
      title: publication.title ?? "",
      publisher: publication.publisher ?? "",
      description: publication.description ?? "",
      authors: publication.authors ?? [],
      publication_date: pubDateStr,
      url: publication.url ?? "",
    });
    setAuthorsInput("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (alreadyAddedPublication.length === 0) {
      toast.error("Please add at least one publication");
      return;
    }
    onNext();
  };

  const handleSkipStep = () => {
    // Allow skipping without requiring publications
    onSkip?.();
  };

  const handleDelete = async (pubId: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    setDeletingId(pubId);
    try {
      const result = await DeletePublication(token, pubId);
      if (result.success) {
        setAlreadyAddedPublication((prev) =>
          prev.filter((p) => p.id !== pubId),
        );
        toast.success("Publication removed");
      } else {
        toast.error(result.message || "Failed to remove pulication");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {alreadyAddedPublication.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Added Publications ({alreadyAddedPublication.length})
            </h3>
            <div className="space-y-3">
              {alreadyAddedPublication.map((publication) => (
                <div
                  key={publication.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4 flex items-start justify-between hover:bg-white/50 transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{publication.title}</p>
                    <p className="text-sm text-gray-600">{publication.publisher}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {publication.description ? publication.description.slice(0, 60) + "..." : "No description"}
                    </p>
                    {publication.authors && publication.authors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {publication.authors.slice(0, 3).map((author) => (
                          <span
                            key={author}
                            className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded"
                          >
                            {author}
                          </span>
                        ))}
                        {publication.authors.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{publication.authors.length - 3} more
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
                      disabled={editingId === publication.id}
                      onClick={() => handleEdit(publication)}
                      className="text-gray-600 hover:text-lime-700 hover:bg-lime-50"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === publication.id}
                      onClick={() => handleDelete(publication.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === publication.id ? (
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
              Publication Title *
            </label>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Input
                    placeholder="e.g., Deep Learning in Computer Vision"
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
              Publisher *
            </label>
            <Controller
              control={form.control}
              name="publisher"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Input
                    placeholder="e.g., IEEE, Journal of AI Research"
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
                    placeholder="Describe your publication..."
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

          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Publication URL *
            </label>
            <Controller
              control={form.control}
              name="url"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Input
                    placeholder="https://..."
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

          <Controller
            control={form.control}
            name="publication_date"
            render={({ field }) => (
              <DatePicker
                label="Publication Date"
                value={field.value ?? undefined}
                onChange={field.onChange}
                placeholder="Select publication date"
              />
            )}
          />

          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Authors
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Add the authors of this publication
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., John Doe"
                  value={authorsInput}
                  onChange={(e) => setAuthorsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAuthors();
                    }
                  }}
                  className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all flex-1 rounded-lg"
                />
                <Button
                  type="button"
                  onClick={addAuthors}
                  size="sm"
                  className="bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg h-11 px-4 transition-all shadow-sm hover:shadow-md shrink-0"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <Controller
                control={form.control}
                name="authors"
                render={({ field }) => (
                  <>
                    {field.value && field.value.length > 0 && (
                      <div className="bg-white/50 border border-lime-200 rounded-lg p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {field.value.map((author) => (
                            <span
                              key={author}
                              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-medium hover:bg-lime-100 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                              <span>{author}</span>
                              <button
                                type="button"
                                onClick={() => removeAuthor(author)}
                                className="text-lime-500 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/60"
                                aria-label={`Remove ${author}`}
                              >
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-lime-600 mt-2 font-medium">
                          {field.value.length} author{field.value.length !== 1 ? "s" : ""} added
                        </p>
                      </div>
                    )}
                  </>
                )}
              />
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
                ? "Updating Publication..."
                : "Adding Publication..."
              : editingId
                ? "Update Publication"
                : "Add Publication"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        You can add multiple publications. Add at least one to continue.
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
            onClick={handleSkipStep}
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

export default PublicationsStep;
