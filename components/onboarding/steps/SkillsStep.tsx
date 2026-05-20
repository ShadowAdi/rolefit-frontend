"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  GetSkillsAction,
  GetUserSkillsAction,
  CreateSkillAction,
  DeleteSkillAction,
} from "@/action/skills/skill.action";
import { SkillListResponse } from "@/types";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const SkillsStep: React.FC<StepProps> = () => {
  const { token } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<SkillListResponse[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillListResponse[]>(
    [],
  );
  const [skillInput, setSkillInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingSkillId, setAddingSkillId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchSkills = async () => {
    if (!token) {
      toast.error("User not authenticated");
      setIsInitialLoading(false);
      return;
    }

    try {
      setIsInitialLoading(true);
      const [allRes, userRes] = await Promise.all([
        GetSkillsAction(token),
        GetUserSkillsAction(token),
      ]);

      if (allRes.success && allRes.data) {
        setAvailableSkills(allRes.data);
      }
      if (userRes.success && userRes.data) {
        setUserSkills(userRes.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to fetch skills");
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [token]);

  const trimmedInput = skillInput.trim();
  const lowerInput = trimmedInput.toLowerCase();
  const userSkillIds = useMemo(
    () => new Set(userSkills.map((s) => s.id)),
    [userSkills],
  );

  const filteredSuggestions = useMemo(() => {
    if (trimmedInput === "") {
      return availableSkills
        .filter((skill) => !userSkillIds.has(skill.id))
        .slice(0, 8);
    }
    return availableSkills
      .filter(
        (skill) =>
          skill.name.toLowerCase().includes(lowerInput) &&
          !userSkillIds.has(skill.id),
      )
      .slice(0, 8);
  }, [trimmedInput, lowerInput, availableSkills, userSkillIds]);

  const exactMatch = useMemo(
    () =>
      availableSkills.find((s) => s.name.toLowerCase() === lowerInput) || null,
    [availableSkills, lowerInput],
  );

  const alreadyAdded = useMemo(
    () =>
      userSkills.find((s) => s.name.toLowerCase() === lowerInput) || null,
    [userSkills, lowerInput],
  );

  const canCreateNew = trimmedInput !== "" && !exactMatch;

  const handleAddSkill = async (
    args: { skillId?: string; skillName?: string } = {},
  ) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const payload = {
      skillId: args.skillId,
      skillName: args.skillId ? undefined : args.skillName ?? trimmedInput,
    };

    if (!payload.skillId && !payload.skillName) {
      toast.error("Please enter or select a skill");
      return;
    }

    if (!payload.skillId && alreadyAdded) {
      toast.info(`"${alreadyAdded.name}" is already in your skills`);
      return;
    }

    setAddingSkillId(payload.skillId || "new");

    try {
      const result = await CreateSkillAction(payload, token);

      if (result.success && result.data) {
        const added: SkillListResponse = {
          id: result.data.skillId,
          name: result.data.skillName,
        } as SkillListResponse;

        setUserSkills((prev) =>
          prev.some((s) => s.id === added.id) ? prev : [...prev, added],
        );

        if (result.data.skillCreated) {
          setAvailableSkills((prev) =>
            prev.some((s) => s.id === added.id) ? prev : [...prev, added],
          );
        }

        toast.success("Skill added successfully!");
        setSkillInput("");
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to add skill");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("An error occurred while adding skill");
    } finally {
      setAddingSkillId(null);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setDeletingId(skillId);

    try {
      const result = await DeleteSkillAction(token, skillId);

      if (result.success) {
        setUserSkills((prev) => prev.filter((s) => s.id !== skillId));
        toast.success("Skill removed successfully!");
      } else {
        toast.error(result.message || "Failed to remove skill");
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("An error occurred while removing skill");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="skill-input"
            className="text-gray-800 font-semibold text-sm sm:text-base"
          >
            Add Skills
          </label>
          {userSkills.length > 0 && (
            <span className="text-xs font-medium text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-full">
              {userSkills.length} added
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Search existing skills or type a new one to create it
        </p>

        <Combobox
          open={open}
          onOpenChange={setOpen}
          inputValue={skillInput}
          onInputValueChange={(value) => {
            setSkillInput(value);
            if (!open) setOpen(true);
          }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <ComboboxInput
              id="skill-input"
              placeholder="e.g., React, Python, Project Management..."
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
                addingSkillId !== null ||
                trimmedInput === ""
              }
              className="bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white font-semibold rounded-lg h-11 px-4 sm:px-5 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingSkillId === "new" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="sm:hidden">Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  <span className="sm:hidden">Add Skill</span>
                </>
              )}
            </Button>
          </div>

          <ComboboxContent>
            <ComboboxList>
              {filteredSuggestions.map((skill) => (
                <ComboboxItem
                  key={skill.id}
                  value={skill.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddSkill({ skillId: skill.id });
                  }}
                  disabled={addingSkillId !== null}
                  className="cursor-pointer hover:bg-lime-50 data-highlighted:bg-lime-50 data-highlighted:text-lime-800"
                >
                  <span className="flex-1 truncate">{skill.name}</span>
                  {addingSkillId === skill.id ? (
                    <Loader2 className="size-4 animate-spin text-lime-600" />
                  ) : (
                    <Plus className="size-4 text-lime-600 opacity-70" />
                  )}
                </ComboboxItem>
              ))}

              {canCreateNew && (
                <ComboboxItem
                  value={`create-${trimmedInput}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddSkill({ skillName: trimmedInput });
                  }}
                  disabled={addingSkillId !== null}
                  className="cursor-pointer border-t border-gray-100 mt-1 pt-2 hover:bg-lime-50 data-highlighted:bg-lime-50"
                >
                  <Sparkles className="size-4 text-lime-600" />
                  <span className="flex-1 truncate text-gray-700">
                    Create{" "}
                    <span className="font-semibold text-lime-700">
                      &ldquo;{trimmedInput}&rdquo;
                    </span>{" "}
                    as new skill
                  </span>
                  {addingSkillId === "new" && (
                    <Loader2 className="size-4 animate-spin text-lime-600" />
                  )}
                </ComboboxItem>
              )}

              <ComboboxEmpty>
                {trimmedInput === ""
                  ? "Start typing to search skills"
                  : "No matching skills"}
              </ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            Your Skills
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
        ) : userSkills.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 sm:p-8 text-center">
            <Sparkles className="size-6 text-lime-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              No skills added yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Use the search above to add your first skill
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <div
                key={skill.id}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-lime-100 border border-lime-300 text-lime-800 text-sm font-medium shadow-sm hover:bg-lime-200 hover:border-lime-400 transition-all"
              >
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                <span className="max-w-56 truncate">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  disabled={deletingId === skill.id}
                  aria-label={`Remove ${skill.name}`}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-lime-300/60 transition-colors disabled:opacity-50"
                >
                  {deletingId === skill.id ? (
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
        Add at least one skill to continue. You can add more skills later.
      </p>
    </div>
  );
};

export default SkillsStep;
