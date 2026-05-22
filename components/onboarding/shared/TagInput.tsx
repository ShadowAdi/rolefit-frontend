"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FieldLabel } from "./FormFields";

interface TagInputProps {
  label: string;
  hint?: string;
  placeholder?: string;
  value: string[];
  onChange: (next: string[]) => void;
  noun?: { singular: string; plural?: string };
  duplicateMessage?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  hint,
  placeholder,
  value,
  onChange,
  noun = { singular: "tag" },
  duplicateMessage,
}) => {
  const [draft, setDraft] = useState("");
  const items = value ?? [];

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (items.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(duplicateMessage || `This ${noun.singular} is already added`);
      return;
    }
    onChange([...items, trimmed]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(items.filter((t) => t !== tag));
  };

  const plural = noun.plural ?? `${noun.singular}s`;

  return (
    <FieldLabel label={label} hint={hint}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all flex-1 rounded-lg"
          />
          <Button
            type="button"
            onClick={addTag}
            size="sm"
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg h-11 px-4 transition-all shadow-sm hover:shadow-md shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {items.length > 0 && (
          <div className="bg-white/50 border border-lime-200 rounded-lg p-3">
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-medium hover:bg-lime-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(item)}
                    className="text-lime-500 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white/60"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <p className="text-[11px] text-lime-600 mt-2 font-medium">
              {items.length} {items.length === 1 ? noun.singular : plural} added
            </p>
          </div>
        )}
      </div>
    </FieldLabel>
  );
};
