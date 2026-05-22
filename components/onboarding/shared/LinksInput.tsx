"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FieldLabel } from "./FormFields";

interface LinksInputProps {
  label: string;
  hint?: string;
  value: Record<string, string> | null | undefined;
  onChange: (next: Record<string, string> | undefined) => void;
}

export const LinksInput: React.FC<LinksInputProps> = ({
  label,
  hint,
  value,
  onChange,
}) => {
  const [keyDraft, setKeyDraft] = useState("");
  const [valueDraft, setValueDraft] = useState("");
  const links = value ?? {};

  const addLink = () => {
    const key = keyDraft.trim();
    const url = valueDraft.trim();
    if (!key || !url) {
      toast.error("Please enter both link name and URL");
      return;
    }
    if (links[key]) {
      toast.info("This link name already exists");
      return;
    }
    onChange({ ...links, [key]: url });
    setKeyDraft("");
    setValueDraft("");
  };

  const removeLink = (key: string) => {
    const next = { ...links };
    delete next[key];
    onChange(Object.keys(next).length ? next : undefined);
  };

  const entries = Object.entries(links);

  return (
    <FieldLabel label={label} hint={hint}>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            placeholder="Label (e.g., GitHub)"
            className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all sm:flex-1 sm:max-w-45 rounded-lg"
          />
          <div className="flex gap-2 flex-1">
            <Input
              value={valueDraft}
              onChange={(e) => setValueDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="https://..."
              className="h-11 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:bg-white focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition-all flex-1 rounded-lg"
            />
            <Button
              type="button"
              onClick={addLink}
              size="sm"
              className="bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg h-11 px-4 transition-all shadow-sm hover:shadow-md shrink-0"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="bg-white/50 border border-lime-200 rounded-lg p-3 space-y-1.5">
            {entries.map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between bg-lime-50 border border-lime-200 px-3 py-2 rounded-lg gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {key}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{val}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(key)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white/60 shrink-0"
                  aria-label={`Remove ${key}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <p className="text-[11px] text-lime-600 mt-2 font-medium">
              {entries.length} link{entries.length !== 1 ? "s" : ""} added
            </p>
          </div>
        )}
      </div>
    </FieldLabel>
  );
};
