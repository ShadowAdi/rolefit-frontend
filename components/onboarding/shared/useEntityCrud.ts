"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import type { ApiResult } from "@/action/_apiRequest";

interface EntityWithId {
  id: string;
}

interface EntityCrudConfig<TList extends EntityWithId, TFull, TForm> {
  entityLabel: string;
  fetchList: (token: string) => Promise<ApiResult<TList[]>>;
  fetchOne?: (id: string, token: string) => Promise<ApiResult<TFull>>;
  create: (data: TForm, token: string) => Promise<ApiResult<unknown>>;
  update: (
    id: string,
    data: TForm,
    token: string,
  ) => Promise<ApiResult<unknown>>;
  remove: (id: string, token: string) => Promise<ApiResult<unknown>>;
  toFormValues: (item: TFull | TList) => TForm;
  onAfterSubmit?: () => void;
}

export interface EntityCrud<TList extends EntityWithId, TForm> {
  items: TList[];
  isInitialLoading: boolean;
  isSubmitting: boolean;
  deletingId: string | null;
  editingId: string | null;
  loadingEditId: string | null;
  refresh: () => Promise<void>;
  submit: (data: TForm) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
  startEdit: (item: TList) => Promise<TForm | null>;
  cancelEdit: () => void;
}

export const useEntityCrud = <TList extends EntityWithId, TFull, TForm>(
  config: EntityCrudConfig<TList, TFull, TForm>,
): EntityCrud<TList, TForm> => {
  const { token } = useAuth();
  const [items, setItems] = useState<TList[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);

  const reportErrors = useCallback(
    (
      res: ApiResult<unknown>,
      fallback: string,
    ): void => {
      if (res.errors && res.errors.length > 0) {
        toast.error(
          res.errors
            .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
            .join(" • "),
        );
      } else {
        toast.error(res.message || fallback);
      }
    },
    [],
  );

  const refresh = useCallback(async () => {
    if (!token) {
      setIsInitialLoading(false);
      return;
    }
    const res = await config.fetchList(token);
    if (res.success && res.data) {
      setItems(res.data);
    } else if (res.message) {
      toast.error(res.message);
    }
    setIsInitialLoading(false);
  }, [token, config]);

  useEffect(() => {
    if (token === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data fetch on mount
    refresh();
  }, [token, refresh]);

  const submit = useCallback(
    async (data: TForm): Promise<boolean> => {
      if (!token) {
        toast.error("Authentication token not found");
        return false;
      }
      setIsSubmitting(true);
      try {
        const result = editingId
          ? await config.update(editingId, data, token)
          : await config.create(data, token);

        if (result.success) {
          toast.success(
            editingId
              ? `${config.entityLabel} updated successfully!`
              : `${config.entityLabel} added successfully!`,
          );
          setEditingId(null);
          await refresh();
          config.onAfterSubmit?.();
          return true;
        }
        reportErrors(
          result,
          editingId
            ? `Failed to update ${config.entityLabel.toLowerCase()}`
            : `Failed to add ${config.entityLabel.toLowerCase()}`,
        );
        return false;
      } catch (err) {
        console.error(`Error saving ${config.entityLabel}:`, err);
        toast.error(`An error occurred while saving ${config.entityLabel.toLowerCase()}`);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, editingId, refresh, reportErrors, config],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      setDeletingId(id);
      try {
        const result = await config.remove(id, token);
        if (result.success) {
          setItems((prev) => prev.filter((it) => it.id !== id));
          if (editingId === id) setEditingId(null);
          toast.success(`${config.entityLabel} removed`);
        } else {
          reportErrors(
            result,
            `Failed to remove ${config.entityLabel.toLowerCase()}`,
          );
        }
      } finally {
        setDeletingId(null);
      }
    },
    [token, editingId, reportErrors, config],
  );

  const startEdit = useCallback(
    async (item: TList): Promise<TForm | null> => {
      if (!token) {
        toast.error("Authentication token not found");
        return null;
      }

      if (config.fetchOne) {
        setLoadingEditId(item.id);
        try {
          const res = await config.fetchOne(item.id, token);
          if (!res.success || !res.data) {
            toast.error(res.message || `Failed to load ${config.entityLabel.toLowerCase()} details`);
            return null;
          }
          setEditingId(item.id);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          return config.toFormValues(res.data);
        } finally {
          setLoadingEditId(null);
        }
      }

      setEditingId(item.id);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return config.toFormValues(item);
    },
    [token, config],
  );

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  return {
    items,
    isInitialLoading,
    isSubmitting,
    deletingId,
    editingId,
    loadingEditId,
    refresh,
    submit,
    remove,
    startEdit,
    cancelEdit,
  };
};
