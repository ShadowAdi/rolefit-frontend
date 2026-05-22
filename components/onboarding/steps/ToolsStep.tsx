"use client";

import {
  CreateToolAction,
  DeleteToolAction,
  GetToolsAction,
  GetUserToolsAction,
} from "@/action/tools/tool.action";
import { AddToolToUserRequest, AddToolToUserResponse } from "@/types";
import { EntityComboboxPicker, StepFooter } from "@/components/onboarding/shared";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const ToolsStep: React.FC<StepProps> = () => (
  <div className="space-y-6">
    <EntityComboboxPicker<AddToolToUserRequest, AddToolToUserResponse>
      entityLabel="Tool"
      pluralLabel="tools"
      placeholder="e.g., Web Development, Blockchain, Project Management..."
      hint="Search existing tools or type a new one to create it"
      fetchAll={GetToolsAction}
      fetchUser={GetUserToolsAction}
      add={CreateToolAction}
      remove={DeleteToolAction}
      buildPayload={({ id, name }) => ({ toolId: id, toolName: name })}
      parseResult={(data) => ({
        id: data.toolId,
        name: data.toolName,
        created: data.toolCreated,
      })}
    />

    <StepFooter helperText="Add at least one tool to continue. You can add more tools later." />
  </div>
);

export default ToolsStep;
