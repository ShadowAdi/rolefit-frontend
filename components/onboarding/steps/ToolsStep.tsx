"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ToolListResponse } from "@/types";
import {
  CreateToolAction,
  GetToolAction,
  GetToolsAction,
  GetUserToolsAction,
  DeleteToolAction,
} from "@/action/tools/tool.action";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const ToolsStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userTools, setUserTools] = useState<ToolListResponse[]>([]);
  const [availableTools, setAvailableTools] = useState<ToolListResponse[]>([]);
  const [toolInput, setToolInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingToolId, setAddingToolId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchTools = async () => {
    if (!token) {
      toast.error("User not authenticated");
      setIsInitialLoading(false);
      return;
    }

    try {
      setIsInitialLoading(true);
      const [allRes, userRes] = await Promise.all([
        GetToolsAction(token),
        GetUserToolsAction(token),
      ]);

      console.log("user tresponse ",userRes)
            console.log("available tresponse ",allRes)


      if (allRes.success && allRes.data) {
        setAvailableTools(allRes.data);
      }
      if (userRes.success && userRes.data) {
        setUserTools(userRes.data);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to fetch tools");
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [token]);

  const trimmedInput = toolInput.trim();
  const lowerInput = trimmedInput.toLowerCase();
  const userToolIds = useMemo(
    () => new Set(userTools.map((s) => s.id)),
    [userTools],
  );

  const filteredSuggestions = useMemo(() => {
    if (trimmedInput === "") {
      return availableTools
        .filter((tool) => !userToolIds.has(tool.id))
        .slice(0, 8);
    }
    return availableTools
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerInput) &&
          !userToolIds.has(tool.id),
      )
      .slice(0, 8);
  }, [trimmedInput, lowerInput, availableTools, userToolIds]);

  const exactMatch = useMemo(
    () =>
      availableTools.find((s) => s.name.toLowerCase() === lowerInput) || null,
    [availableTools, lowerInput],
  );

  const alreadyAdded = useMemo(
    () => userTools.find((s) => s.name.toLowerCase() === lowerInput) || null,
    [userTools, lowerInput],
  );

  const canCreateNew = trimmedInput !== "" && !exactMatch;

  const handleAddSkill = async (
    args: { toolId?: string; toolName?: string } = {},
  ) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const payload = {
      toolId: args.toolId,
      toolName: args.toolId ? undefined : (args.toolName ?? trimmedInput),
    };

    if (!payload.toolId && !payload.toolName) {
      toast.error("Please enter or select a tool");
      return;
    }

    if (!payload.toolId && alreadyAdded) {
      toast.info(`"${alreadyAdded.name}" is already in your tools`);
      return;
    }

    setAddingToolId(payload.toolId || "new");
    setToolInput("");
    setOpen(false);

    try {
      const result = await CreateToolAction(payload, token);

      if (result.success && result.data) {
        const added: ToolListResponse = {
          id: result.data.toolId,
          name: result.data.toolName,
        } as ToolListResponse;

        setUserTools((prev) =>
          prev.some((s) => s.id === added.id) ? prev : [...prev, added],
        );

        if (result.data.toolCreated) {
          setAvailableTools((prev) =>
            prev.some((s) => s.id === added.id) ? prev : [...prev, added],
          );
        }

        toast.success("Tool added successfully!");
      } else {
        toast.error(result.message || "Failed to add Tool");
      }
    } catch (error) {
      console.error("Error adding tool:", error);
      toast.error("An error occurred while adding tool");
    } finally {
      setAddingToolId(null);
    }
  };

  const handleRemoveTool = async (toolId: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setDeletingId(toolId);

    try {
      const result = await DeleteToolAction(token, toolId);

      if (result.success) {
        setUserTools((prev) => prev.filter((s) => s.id !== toolId));
        toast.success("Tool removed successfully!");
      } else {
        toast.error(result.message || "Failed to remove tool");
      }
    } catch (error) {
      console.error("Error removing tool:", error);
      toast.error("An error occurred while removing tool");
    } finally {
      setDeletingId(null);
    }
  };

  return (
     <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="tool-input"
            className="text-gray-800 font-semibold text-sm sm:text-base"
          >
            
            Add Tools
          </label>
          {userTools.length > 0 && (
            <span className="text-xs font-medium text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-full">
              {userTools.length} added
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Search existing tools or type a new one to create it
        </p>

        <Combobox
          open={open}
          onOpenChange={setOpen}
          inputValue={toolInput}
          onInputValueChange={(value) => {
            setToolInput(value);
            if (!open) setOpen(true);
          }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <ComboboxInput
              id="tool-input"
              placeholder="e.g., Web Development, Blockchain Developer, Project Management..."
              showTrigger
              showClear
              disabled={isInitialLoading}
              className="flex-1 h-11 border-gray-300 focus-within:border-lime-500 focus-within:ring-lime-200"
              onFocus={() => setOpen(true)}
            />
            <Button
              type="button"
              onClick={() => handleAddSkill()}
              disabled={
                isInitialLoading ||
                addingToolId !== null ||
                trimmedInput === ""
              }
              className="bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white font-semibold rounded-lg h-11 px-4 sm:px-5 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingToolId === "new" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="sm:hidden">Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  <span className="sm:hidden">Add Tool</span>
                </>
              )}
            </Button>
          </div>

          <ComboboxContent>
            <ComboboxList>
              {filteredSuggestions.map((tool) => (
                <ComboboxItem
                  key={tool.id}
                  value={tool.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddSkill({ toolId: tool.id });
                  }}
                  disabled={addingToolId !== null}
                  className="cursor-pointer hover:bg-lime-50 data-highlighted:bg-lime-50 data-highlighted:text-lime-800"
                >
                  <span className="flex-1 truncate">{tool.name}</span>
                  {addingToolId === tool.id ? (
                    <Loader2 className="size-4 animate-spin text-lime-600" />
                  ) : (
                    <Plus className="size-4 text-lime-600 opacity-70" />
                  )}
                </ComboboxItem>
              ))}

              {canCreateNew && (
                <ComboboxItem
                  value={trimmedInput}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddSkill({ toolName: trimmedInput });
                  }}
                  disabled={addingToolId !== null}
                  className="cursor-pointer border-t border-gray-100 mt-1 pt-2 hover:bg-lime-50 data-highlighted:bg-lime-50"
                >
                  <Sparkles className="size-4 text-lime-600" />
                  <span className="flex-1 truncate text-gray-700">
                    Create{" "}
                    <span className="font-semibold text-lime-700">
                      &ldquo;{trimmedInput}&rdquo;
                    </span>{" "}
                    as new tool
                  </span>
                  {addingToolId === "new" && (
                    <Loader2 className="size-4 animate-spin text-lime-600" />
                  )}
                </ComboboxItem>
              )}

              <ComboboxEmpty>
                {trimmedInput === ""
                  ? "Start typing to search tools"
                  : "No matching tools"}
              </ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            Your Tools
          </h3>
        </div>

        {isInitialLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-gray-100 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : userTools.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 sm:p-8 text-center">
            <Sparkles className="size-6 text-lime-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              No tools added yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Use the search above to add your first tool
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userTools.map((tool) => (
              <div
                key={tool.id}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-lime-100 border border-lime-300 text-lime-800 text-sm font-medium shadow-sm hover:bg-lime-200 hover:border-lime-400 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                <span className="max-w-56 truncate">{tool.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTool(tool.id)}
                  disabled={deletingId === tool.id}
                  aria-label={`Remove ${tool.name}`}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-lime-300/60 transition-colors disabled:opacity-50"
                >
                  {deletingId === tool.id ? (
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

      <p className="text-center text-xs sm:text-sm text-gray-500">
        Add at least one tool to continue. You can add more tools later.
      </p>
    </div>
  );
};

export default ToolsStep;
