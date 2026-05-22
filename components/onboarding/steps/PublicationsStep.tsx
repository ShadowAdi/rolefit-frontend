"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreatePublication,
  DeletePublication,
  GetAllPublications,
  UpdatePublication,
} from "@/action/publication/publication.action";
import {
  PublicationCreateRequest,
  PublicationListResponse,
} from "@/types";
import { DatePicker } from "@/components/global/DatePicker";
import {
  ComplexListManager,
  FieldLabel,
  FormText,
  FormTextarea,
  StepFooter,
  SubmitButton,
  TagInput,
  useEntityCrud,
} from "@/components/onboarding/shared";

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

const DEFAULT_VALUES: PublicationFormData = {
  title: "",
  publisher: "",
  publication_date: undefined,
  authors: [],
  description: "",
  url: "",
};

const toISODateString = (iso?: string | null) => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().split("T")[0];
};

const toFormValues = (pub: PublicationListResponse): PublicationFormData => ({
  title: pub.title ?? "",
  publisher: pub.publisher ?? "",
  description: pub.description ?? "",
  authors: pub.authors ?? [],
  publication_date: toISODateString(pub.publication_date),
  url: pub.url ?? "",
});

const buildPayload = (
  data: PublicationFormData,
): PublicationCreateRequest => ({
  title: data.title,
  publisher: data.publisher,
  authors: data.authors,
  description: data.description,
  url: data.url,
  ...(data.publication_date && {
    publication_date: new Date(data.publication_date).toISOString(),
  }),
});

const PublicationsStep: React.FC<StepProps> = () => {
  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const crud = useEntityCrud<
    PublicationListResponse,
    PublicationListResponse,
    PublicationFormData
  >({
    entityLabel: "Publication",
    fetchList: GetAllPublications,
    create: (data, token) => CreatePublication(buildPayload(data), token),
    update: (id, data, token) => UpdatePublication(id, buildPayload(data), token),
    remove: DeletePublication,
    toFormValues,
    onAfterSubmit: () => form.reset(DEFAULT_VALUES),
  });

  const handleEdit = async (pub: PublicationListResponse) => {
    const values = await crud.startEdit(pub);
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
      title="Added Publications"
      renderItemContent={(pub) => (
        <>
          <p className="font-semibold text-gray-900">{pub.title}</p>
          <p className="text-sm text-gray-600">{pub.publisher}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {pub.description
              ? pub.description.slice(0, 60) +
                (pub.description.length > 60 ? "..." : "")
              : "No description"}
          </p>
          {pub.authors && pub.authors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {pub.authors.slice(0, 3).map((author) => (
                <span
                  key={author}
                  className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded"
                >
                  {author}
                </span>
              ))}
              {pub.authors.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{pub.authors.length - 3} more
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
            label="Publication Title"
            required
            placeholder="e.g., Deep Learning in Computer Vision"
          />

          <FormText
            control={form.control}
            name="publisher"
            label="Publisher"
            required
            placeholder="e.g., IEEE, Journal of AI Research"
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            required
            placeholder="Describe your publication..."
            className="min-h-24"
          />

          <FormText
            control={form.control}
            name="url"
            label="Publication URL"
            required
            placeholder="https://..."
          />

          <FieldLabel label="Publication Date">
            <Controller
              control={form.control}
              name="publication_date"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder="Select publication date"
                />
              )}
            />
          </FieldLabel>

          <Controller
            control={form.control}
            name="authors"
            render={({ field }) => (
              <TagInput
                label="Authors"
                hint="Add the authors of this publication"
                placeholder="e.g., John Doe"
                value={field.value ?? []}
                onChange={field.onChange}
                noun={{ singular: "author" }}
                duplicateMessage="This Author is already added"
              />
            )}
          />
        </div>

        <SubmitButton
          isEditing={!!crud.editingId}
          isSubmitting={crud.isSubmitting}
          entityLabel="Publication"
          onCancelEdit={handleCancelEdit}
        />
      </form>

      <StepFooter helperText="You can add multiple publications. Add at least one to continue." />
    </ComplexListManager>
  );
};

export default PublicationsStep;
