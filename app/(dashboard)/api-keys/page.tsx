"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApiKeyCard } from "@/components/api-keys/ApiKeyCard";
import { ApiKeyForm } from "@/components/api-keys/ApiKeyForm";
import { DeleteApiKeyDialog } from "@/components/api-keys/DeleteApiKeyDialog";
import { ApiKeySkeleton } from "@/components/api-keys/ApiKeySkeleton";
import { useRouter } from "next/navigation";

import {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
} from "@/types/api_keys.types";
import {
  ApiKeyCreateAction,
  ApiKeyDeleteAction,
  ApiKeyGetAllAction,
  ApiKeyUpdateAction,
} from "@/action/apiKeys/api_keys.action";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function ApiKeysPage() {
  const { token, isLoading: authLoading } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

   const fetchApiKeys = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await ApiKeyGetAllAction(token);
      if (response.success) {
        if (response.data) {
          setApiKeys(response.data);
        } else {
          toast.error(response.message);
          console.error(`Failed to get all api keys: ${response.errors}`);
        }
      } else {
        toast.error(response.message);
        console.error(`Failed to get all api keys: ${response.errors}`);
      }
    } catch (error) {
      toast.error(`Failed to get all api keys: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
      return;
    }

    if (token) {
      fetchApiKeys();
    }
  }, [token, authLoading, router, fetchApiKeys]);

  const handleCreate = async (data: CreateApiKeyRequest) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await ApiKeyCreateAction(data, token);
      if (response.success) {
        toast.success("API key created successfully");
        setFormOpen(false);
        fetchApiKeys();
      } else {
        toast.error(response.message || "Failed to create api key");
        console.error(
          response.message || response.errors || "Failed to create api key",
        );
      }
    } catch (error: any) {
      toast.error(`Failed to Create Api key: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateApiKeyRequest) => {
    if (!token || !selectedApiKey) return;

    setIsSubmitting(true);
    try {
      await ApiKeyUpdateAction(data, selectedApiKey.id, token);
      toast.success(`Key Updated`);
      setFormOpen(false);
      setSelectedApiKey(null);
      fetchApiKeys();
    } catch (error: any) {
      toast.error(`Failed to update key: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedApiKey) return;

    setIsSubmitting(true);
    try {
      await ApiKeyDeleteAction(selectedApiKey.id, token);
      toast.success(`Api key Deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedApiKey(null);
      fetchApiKeys();
    } catch (error: any) {
      toast.error(`Failed to delete api keys`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (apiKey: ApiKey, isActive: boolean) => {
    if (!token) return;

    try {
      await ApiKeyUpdateAction({ is_active: isActive }, apiKey.id, token);
      toast.success(`Api Key activated ${isActive}`);
      fetchApiKeys();
    } catch (error: any) {
      toast.error(`Failed to update Api Key: ${error}`);
    }
  };

  const openEditForm = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setFormOpen(true);
  };

  const openDeleteDialog = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (
    data: CreateApiKeyRequest | UpdateApiKeyRequest,
  ) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      if (selectedApiKey) {
        const response = await ApiKeyUpdateAction(
          data as UpdateApiKeyRequest,
          selectedApiKey.id,
          token,
        );
        if (response.success) {
          toast.success("API key updated successfully");
          setFormOpen(false);
          setSelectedApiKey(null);
          fetchApiKeys();
        } else {
          toast.error(response.message || "Failed to update API key");
        }
      } else {
        const response = await ApiKeyCreateAction(
          data as CreateApiKeyRequest,
          token,
        );
        if (response.success) {
          toast.success("API key created successfully");
          setFormOpen(false);
          fetchApiKeys();
        } else {
          toast.error(response.message || "Failed to create API key");
        }
      }
    } catch (error: any) {
      toast.error(
        `Failed to ${selectedApiKey ? "update" : "create"} API key: ${error.message || error}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-2">
            Manage your API keys for different AI providers
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedApiKey(null);
            setFormOpen(true);
          }}
          className="bg-lime-600 hover:bg-lime-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ApiKeySkeleton key={i} />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No API keys added yet</p>
          <Button
            onClick={() => setFormOpen(true)}
            variant="outline"
            className="mt-4 border-lime-200 text-lime-700 hover:bg-lime-50"
          >
            Add your first API key
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiKeys.map((apiKey) => (
            <ApiKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onEdit={openEditForm}
              onDelete={openDeleteDialog}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      <ApiKeyForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedApiKey || undefined}
        isLoading={isSubmitting}
      />

      <DeleteApiKeyDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        apiKey={selectedApiKey}
        isLoading={isSubmitting}
      />
    </div>
  );
}
