"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isEditing: boolean;
  isSubmitting: boolean;
  entityLabel: string;
  onCancelEdit: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isEditing,
  isSubmitting,
  entityLabel,
  onCancelEdit,
}) => (
  <div className="flex gap-2">
    {isEditing && (
      <Button
        type="button"
        variant="outline"
        onClick={onCancelEdit}
        disabled={isSubmitting}
        className="h-11 px-4"
      >
        Cancel
      </Button>
    )}
    <Button
      type="submit"
      disabled={isSubmitting}
      className="flex-1 h-11 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
      {isSubmitting
        ? isEditing
          ? `Updating ${entityLabel}...`
          : `Adding ${entityLabel}...`
        : isEditing
          ? `Update ${entityLabel}`
          : `Add ${entityLabel}`}
    </Button>
  </div>
);
