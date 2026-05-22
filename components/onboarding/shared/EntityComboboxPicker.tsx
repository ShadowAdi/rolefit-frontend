"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { SimpleListManager } from "./SimpleListManager";
import type { ApiResult } from "@/action/_apiRequest";

interface NamedEntity {
  id: string;
  name: string;
}

interface AddResultData {
  id: string;
  name: string;
  created?: boolean;
}

export interface EntityComboboxPickerProps<TAdd, TAddResult> {
  entityLabel: string;
  pluralLabel: string;
  placeholder: string;
  hint?: string;
  fetchAll: (token: string) => Promise<ApiResult<NamedEntity[]>>;
  fetchUser: (token: string) => Promise<ApiResult<NamedEntity[]>>;
  add: (
    payload: TAdd,
    token: string,
  ) => Promise<ApiResult<TAddResult>>;
  remove: (token: string, id: string) => Promise<ApiResult<unknown>>;
  buildPayload: (selection: { id?: string; name?: string }) => TAdd;
  parseResult: (data: TAddResult) => AddResultData;
}

export const EntityComboboxPicker = <TAdd, TAddResult>({
  entityLabel,
  pluralLabel,
  placeholder,
  hint,
  fetchAll,
  fetchUser,
  add,
  remove,
  buildPayload,
  parseResult,
}: EntityComboboxPickerProps<TAdd, TAddResult>) => {
  const { token } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userItems, setUserItems] = useState<NamedEntity[]>([]);
  const [availableItems, setAvailableItems] = useState<NamedEntity[]>([]);
  const [input, setInput] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token === null) return;

    let cancelled = false;
    const load = async () => {
      if (!token) {
        toast.error("User not authenticated");
        setIsInitialLoading(false);
        return;
      }
      try {
        setIsInitialLoading(true);
        const [allRes, userRes] = await Promise.all([
          fetchAll(token),
          fetchUser(token),
        ]);
        if (cancelled) return;
        if (allRes.success && allRes.data) setAvailableItems(allRes.data);
        if (userRes.success && userRes.data) setUserItems(userRes.data);
      } catch (err) {
        if (!cancelled) {
          console.error(`Error fetching ${pluralLabel}:`, err);
          toast.error(`Failed to fetch ${pluralLabel}`);
        }
      } finally {
        if (!cancelled) setIsInitialLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [token, fetchAll, fetchUser, pluralLabel]);

  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  const userIds = useMemo(
    () => new Set(userItems.map((it) => it.id)),
    [userItems],
  );

  const suggestions = useMemo(() => {
    const base = availableItems.filter((it) => !userIds.has(it.id));
    if (!trimmed) return base.slice(0, 8);
    return base
      .filter((it) => it.name.toLowerCase().includes(lower))
      .slice(0, 8);
  }, [availableItems, userIds, trimmed, lower]);

  const exactMatch = useMemo(
    () =>
      availableItems.find((it) => it.name.toLowerCase() === lower) || null,
    [availableItems, lower],
  );

  const alreadyAdded = useMemo(
    () => userItems.find((it) => it.name.toLowerCase() === lower) || null,
    [userItems, lower],
  );

  const canCreateNew = trimmed !== "" && !exactMatch;

  const handleAdd = async (selection: { id?: string; name?: string } = {}) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    const id = selection.id;
    const name = id ? undefined : (selection.name ?? trimmed);

    if (!id && !name) {
      toast.error(`Please enter or select a ${entityLabel.toLowerCase()}`);
      return;
    }

    if (!id && alreadyAdded) {
      toast.info(`"${alreadyAdded.name}" is already in your ${pluralLabel}`);
      return;
    }

    setAddingId(id || "new");
    setInput("");
    setOpen(false);

    try {
      const result = await add(buildPayload({ id, name }), token);

      if (result.success && result.data) {
        const parsed = parseResult(result.data);
        const added: NamedEntity = { id: parsed.id, name: parsed.name };

        setUserItems((prev) =>
          prev.some((s) => s.id === added.id) ? prev : [...prev, added],
        );

        if (parsed.created) {
          setAvailableItems((prev) =>
            prev.some((s) => s.id === added.id) ? prev : [...prev, added],
          );
        }

        toast.success(`${entityLabel} added successfully!`);
      } else {
        toast.error(result.message || `Failed to add ${entityLabel.toLowerCase()}`);
      }
    } catch (err) {
      console.error(`Error adding ${entityLabel.toLowerCase()}:`, err);
      toast.error(`An error occurred while adding ${entityLabel.toLowerCase()}`);
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }
    try {
      const result = await remove(token, id);
      if (result.success) {
        setUserItems((prev) => prev.filter((s) => s.id !== id));
        toast.success(`${entityLabel} removed successfully!`);
      } else {
        toast.error(result.message || `Failed to remove ${entityLabel.toLowerCase()}`);
      }
    } catch (err) {
      console.error(`Error removing ${entityLabel.toLowerCase()}:`, err);
      toast.error(`An error occurred while removing ${entityLabel.toLowerCase()}`);
    }
  };

  return (
    <SimpleListManager
      items={userItems}
      onRemove={handleRemove}
      isLoading={isInitialLoading}
      label={`Add ${pluralLabel.charAt(0).toUpperCase()}${pluralLabel.slice(1)}`}
      placeholder={placeholder}
      emptyMessage={`No ${pluralLabel} added yet`}
    >
      {hint && <p className="text-xs text-gray-500 mb-3">{hint}</p>}

      <Combobox
        open={open}
        onOpenChange={setOpen}
        inputValue={input}
        onInputValueChange={(value) => {
          setInput(value);
          if (!open) setOpen(true);
        }}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <ComboboxInput
            placeholder={placeholder}
            showTrigger
            showClear
            disabled={isInitialLoading}
            className="flex-1 h-11 border-gray-300 focus-within:border-lime-500 focus-within:ring-lime-200"
            onFocus={() => setOpen(true)}
          />
          <Button
            type="button"
            onClick={() => handleAdd()}
            disabled={isInitialLoading || addingId !== null || trimmed === ""}
            className="bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white font-semibold rounded-lg h-11 px-4 sm:px-5 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {addingId === "new" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="sm:hidden">Adding...</span>
              </>
            ) : (
              <>
                <Plus className="size-4" />
                <span className="sm:hidden">Add {entityLabel}</span>
              </>
            )}
          </Button>
        </div>

        <ComboboxContent>
          <ComboboxList>
            {suggestions.map((it) => (
              <ComboboxItem
                key={it.id}
                value={it.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleAdd({ id: it.id });
                }}
                disabled={addingId !== null}
                className="cursor-pointer hover:bg-lime-50 data-highlighted:bg-lime-50 data-highlighted:text-lime-800"
              >
                <span className="flex-1 truncate">{it.name}</span>
                {addingId === it.id ? (
                  <Loader2 className="size-4 animate-spin text-lime-600" />
                ) : (
                  <Plus className="size-4 text-lime-600 opacity-70" />
                )}
              </ComboboxItem>
            ))}

            {canCreateNew && (
              <ComboboxItem
                value={trimmed}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdd({ name: trimmed });
                }}
                disabled={addingId !== null}
                className="cursor-pointer border-t border-gray-100 mt-1 pt-2 hover:bg-lime-50 data-highlighted:bg-lime-50"
              >
                <Sparkles className="size-4 text-lime-600" />
                <span className="flex-1 truncate text-gray-700">
                  Create{" "}
                  <span className="font-semibold text-lime-700">
                    &ldquo;{trimmed}&rdquo;
                  </span>{" "}
                  as new {entityLabel.toLowerCase()}
                </span>
                {addingId === "new" && (
                  <Loader2 className="size-4 animate-spin text-lime-600" />
                )}
              </ComboboxItem>
            )}

            <ComboboxEmpty>
              {trimmed === ""
                ? `Start typing to search ${pluralLabel}`
                : `No matching ${pluralLabel}`}
            </ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </SimpleListManager>
  );
};
