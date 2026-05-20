"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  GetSkillsAction,
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

const SkillsStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userSkills, setUserSkills] = useState<SkillListResponse[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillListResponse[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SkillListResponse[]
  >([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingSkillId, setAddingSkillId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch user's skills and all available skills
  const fetchSkills = async () => {
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      const { success, data } = await GetSkillsAction(token);
      if (success && data) {
        setAvailableSkills(data);
        // TODO: Fetch user's skills from API when endpoint is available
        setUserSkills([]);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [token]);

  // Filter suggestions as user types
  useEffect(() => {
    if (skillInput.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = availableSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
        !userSkills.some((us) => us.id === skill.id)
    );

    setFilteredSuggestions(filtered.slice(0, 8));
  }, [skillInput, availableSkills, userSkills]);

  // Add skill - either existing or new
  const handleAddSkill = async (skillId?: string) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    if (!skillId && skillInput.trim() === "") {
      toast.error("Please enter or select a skill");
      return;
    }

    setAddingSkillId(skillId || "new");

    try {
      const result = await CreateSkillAction(
        {
          skillId: skillId,
          skillName: skillInput.trim(),
        },
        token
      );

      if (result.success && result.data) {
        setUserSkills((prev) => [
          ...prev,
          {
            id: result.data!.skillId,
            name: result.data!.skillName,
          } as SkillListResponse,
        ]);

        // Update available skills if new skill was created
        if (result.data.skillCreated) {
          setAvailableSkills((prev) => [
            ...prev,
            {
              id: result.data!.skillId,
              name: result.data!.skillName,
            } as SkillListResponse,
          ]);
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

  // Remove skill
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
      {userSkills.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Skills ({userSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 border-2 border-lime-300 text-lime-700 text-sm font-semibold shadow-sm hover:bg-lime-200 hover:border-lime-400 transition-all"
                >
                  <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id)}
                    disabled={deletingId === skill.id}
                    className="ml-1 hover:opacity-70 transition-opacity hover:text-lime-600"
                  >
                    {deletingId === skill.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <X className="size-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6" />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-gray-700 font-semibold block mb-2">
            Add Skills
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Search existing skills or type to create a new one
          </p>

          <Combobox
            open={open}
            onOpenChange={setOpen}
            value={skillInput}
            onValueChange={(value) => {
              if (value !== null) {
                setSkillInput(value);
              }
            }}
          >
            <div className="flex gap-2">
              <ComboboxInput
                placeholder="e.g., React, Python, Project Management..."
                showTrigger
                showClear
                className="flex-1 h-11 border-gray-300"
              />
              <Button
                type="button"
                onClick={() => handleAddSkill()}
                disabled={
                  isLoading ||
                  addingSkillId !== null ||
                  skillInput.trim() === ""
                }
                className="bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg h-11 px-4 transition-all shadow-sm hover:shadow-md"
              >
                {addingSkillId === "new" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
              </Button>
            </div>

            <ComboboxContent>
              <ComboboxList>
                {/* Existing skills suggestions */}
                {filteredSuggestions.map((skill) => (
                  <ComboboxItem
                    key={skill.id}
                    value={skill.id}
                    onSelect={() => {
                      handleAddSkill(skill.id);
                    }}
                    disabled={addingSkillId === skill.id}
                  >
                    <span className="flex-1">{skill.name}</span>
                    {addingSkillId === skill.id && (
                      <Loader2 className="size-4 animate-spin text-lime-500" />
                    )}
                  </ComboboxItem>
                ))}

                {/* Create new skill option */}
                {skillInput.trim() !== "" &&
                  filteredSuggestions.length === 0 && (
                    <ComboboxItem
                      value={`create-${skillInput}`}
                      onSelect={() => {
                        handleAddSkill();
                      }}
                      disabled={addingSkillId !== null}
                    >
                      <span className="flex-1">
                        Create "{skillInput.trim()}" as new skill
                      </span>
                      {addingSkillId === "new" && (
                        <Loader2 className="size-4 animate-spin text-lime-500" />
                      )}
                    </ComboboxItem>
                  )}

                <ComboboxEmpty>
                  {skillInput.trim() === ""
                    ? "Start typing to search skills"
                    : "No skills found"}
                </ComboboxEmpty>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Add at least one skill to continue. You can add more skills later.
      </p>
    </div>
  );
};

export default SkillsStep;
