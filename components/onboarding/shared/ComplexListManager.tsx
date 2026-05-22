"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, X } from "lucide-react";

interface ComplexListProps<T extends { id: string }> {
  items: T[];
  onEdit: (item: T) => void | Promise<unknown>;
  onDelete: (itemId: string) => Promise<void> | void;
  deletingId: string | null;
  editingId: string | null;
  loadingEditId?: string | null;
  title: string;
  emptyMessage?: string;
  renderItemContent: (item: T) => ReactNode;
  children?: ReactNode;
}

export const ComplexListManager = <T extends { id: string }>({
  items,
  onEdit,
  onDelete,
  deletingId,
  editingId,
  loadingEditId,
  title,
  emptyMessage,
  renderItemContent,
  children,
}: ComplexListProps<T>) => {
  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {title} ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item) => {
                const isLoadingEdit = loadingEditId === item.id;
                const isDeleting = deletingId === item.id;
                const isBeingEdited = editingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-4 flex items-start justify-between hover:bg-white/50 transition-all"
                  >
                    <div className="flex-1 min-w-0">{renderItemContent(item)}</div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isBeingEdited || isLoadingEdit}
                        onClick={() => onEdit(item)}
                        className="text-gray-600 hover:text-lime-700 hover:bg-lime-50"
                        aria-label="Edit"
                      >
                        {isLoadingEdit ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Pencil className="size-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => onDelete(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label="Delete"
                      >
                        {isDeleting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6" />
        </div>
      )}

      {items.length === 0 && emptyMessage && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {children}
    </div>
  );
};
