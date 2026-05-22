"use client";

import {
  CreateSkillAction,
  DeleteSkillAction,
  GetSkillsAction,
  GetUserSkillsAction,
} from "@/action/skills/skill.action";
import { AddSkillToUserRequest, AddSkillToUserResponse } from "@/types";
import { EntityComboboxPicker, StepFooter } from "@/components/onboarding/shared";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const SkillsStep: React.FC<StepProps> = () => (
  <div className="space-y-6">
    <EntityComboboxPicker<AddSkillToUserRequest, AddSkillToUserResponse>
      entityLabel="Skill"
      pluralLabel="skills"
      placeholder="e.g., React, Python, Project Management..."
      hint="Search existing skills or type a new one to create it"
      fetchAll={GetSkillsAction}
      fetchUser={GetUserSkillsAction}
      add={CreateSkillAction}
      remove={DeleteSkillAction}
      buildPayload={({ id, name }) => ({ skillId: id, skillName: name })}
      parseResult={(data) => ({
        id: data.skillId,
        name: data.skillName,
        created: data.skillCreated,
      })}
    />

    <StepFooter helperText="Add at least one skill to continue. You can add more skills later." />
  </div>
);

export default SkillsStep;
