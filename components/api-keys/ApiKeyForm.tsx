"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKey,
  ProviderType,
} from "@/types/api_keys.types";

// Update schema to use undefined instead of null
const apiKeySchema = z.object({
  provider: z.enum(ProviderType),
  key_name: z.string().min(3, "Key name must be at least 3 characters"),
  key_value: z.string().min(10, "API key must be at least 10 characters"),
  api_base_url: z.string().optional().or(z.literal("")),
  api_version: z.string().optional(),
  is_active: z.boolean(),
  isDefault: z.boolean(),
  expires_at: z.string().optional(),
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

interface ApiKeyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateApiKeyRequest | UpdateApiKeyRequest) => void;
  initialData?: ApiKey;
  isLoading?: boolean;
}

const providers = [
  { value: "groq", label: "Groq" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "cohere", label: "Cohere" },
  { value: "mistral", label: "Mistral" },
  { value: "other", label: "Other" },
];

export function ApiKeyForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: ApiKeyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      provider: initialData?.provider || ProviderType.GROQ,
      key_name: initialData?.key_name || "",
      key_value: initialData?.key_value || "",
      api_base_url: initialData?.api_base_url || "",
      api_version: initialData?.api_version || "",
      is_active: initialData?.is_active ?? true,
      isDefault: initialData?.isDefault ?? false,
      expires_at: initialData?.expires_at
        ? initialData.expires_at.split("T")[0]
        : "",
    },
  });

  const isDefault = watch("isDefault");

  const onFormSubmit = handleSubmit(async (data: ApiKeyFormData) => {
    // Always include all fields, using undefined for empty optional fields
    const submitData: any = {
      provider: data.provider,
      key_name: data.key_name,
      key_value: data.key_value,
      is_active: data.is_active,
      isDefault: data.isDefault,
      api_base_url: data.api_base_url && data.api_base_url.trim() !== "" 
        ? data.api_base_url 
        : undefined,
      api_version: data.api_version && data.api_version.trim() !== "" 
        ? data.api_version 
        : undefined,
      expires_at: data.expires_at && data.expires_at.trim() !== "" 
        ? data.expires_at 
        : undefined,
    };

    // If we have initialData, it's an update, otherwise it's a create
    if (initialData) {
      // For update, only include fields that have changed
      const updateData: UpdateApiKeyRequest = {};
      if (submitData.provider !== initialData.provider) updateData.provider = submitData.provider;
      if (submitData.key_name !== initialData.key_name) updateData.key_name = submitData.key_name;
      if (submitData.key_value !== initialData.key_value) updateData.key_value = submitData.key_value;
      if (submitData.api_base_url !== initialData.api_base_url) updateData.api_base_url = submitData.api_base_url;
      if (submitData.api_version !== initialData.api_version) updateData.api_version = submitData.api_version;
      if (submitData.is_active !== initialData.is_active) updateData.is_active = submitData.is_active;
      if (submitData.isDefault !== initialData.isDefault) updateData.isDefault = submitData.isDefault;
      if (submitData.expires_at !== (initialData.expires_at?.split("T")[0] || undefined)) {
        updateData.expires_at = submitData.expires_at;
      }

      await onSubmit(updateData);
    } else {
      await onSubmit(submitData as CreateApiKeyRequest);
    }

    if (!initialData) {
      reset();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full bg-white">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit API Key" : "Add New API Key"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Provider *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("provider", value as ProviderType)
                }
                defaultValue={initialData?.provider}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provider && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.provider.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="key_name">Key Name *</Label>
              <Input
                id="key_name"
                placeholder="e.g., My Groq API Key"
                {...register("key_name")}
                className="mt-1"
              />
              {errors.key_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.key_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="key_value">API Key *</Label>
            <Input
              id="key_value"
              type="password"
              placeholder="Enter your API key"
              {...register("key_value")}
              className="mt-1"
            />
            {errors.key_value && (
              <p className="text-sm text-red-500 mt-1">
                {errors.key_value.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="api_base_url">API Base URL (Optional)</Label>
              <Input
                id="api_base_url"
                placeholder="https://api.openai.com/v1"
                {...register("api_base_url")}
                className="mt-1"
              />
              {errors.api_base_url && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.api_base_url.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="api_version">API Version (Optional)</Label>
              <Input
                id="api_version"
                placeholder="v1, 2024-01-01"
                {...register("api_version")}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expires_at">Expires At (Optional)</Label>
            <Input
              id="expires_at"
              type="date"
              {...register("expires_at")}
              className="mt-1"
            />
            {errors.expires_at && (
              <p className="text-sm text-red-500 mt-1">
                {errors.expires_at.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
              <Label htmlFor="isDefault">Set as Default</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-lime-600 hover:bg-lime-700"
            >
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}