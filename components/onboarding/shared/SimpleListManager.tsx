"use client";

import { useState, useMemo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
}

interface SimpleListManagerProps {
  items: Item[];
  onAdd: (item: Item) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isLoading: boolean;
  label: string;
  placeholder: string;
  emptyMessage: string;
  renderItem?: (item: Item) => ReactNode;
  children?: ReactNode; // For custom input/combobox
}

export const SimpleListManager: React.FC<SimpleListManagerProps> = ({
  items,
  onAdd,
  onRemove,
  isLoading,
  label,
  placeholder,
  emptyMessage,
  renderItem,
  children,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemove = async (itemId: string) => {
    setDeletingId(itemId);
    try {
      await onRemove(itemId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label className="text-gray-800 font-semibold text-sm sm:text-base">
            {label}
          </label>
          {items.length > 0 && (
            <span className="text-xs font-medium text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-full">
              {items.length} added
            </span>
          )}
        </div>
        {children}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            Your Items
          </h3>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-gray-100 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 sm:p-8 text-center">
            <p className="text-sm font-medium text-gray-700">{emptyMessage}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-lime-100 border border-lime-300 text-lime-800 text-sm font-medium shadow-sm hover:bg-lime-200 hover:border-lime-400 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                <span className="max-w-56 truncate">{renderItem ? renderItem(item) : item.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  disabled={deletingId === item.id}
                  aria-label={`Remove ${item.name}`}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-lime-300/60 transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <X className="size-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
