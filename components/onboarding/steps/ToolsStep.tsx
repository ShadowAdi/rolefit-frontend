"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const ToolsStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAddTools = () => {
    setIsCompleted(true);
    toast.success("Tools & Technologies added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="size-16 text-lime-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-600 mb-6">
          Tools & Technologies form will be available shortly. Skip for now to
          continue with other sections.
        </p>

        <Button
          onClick={handleAddTools}
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold"
        >
          Mark as Completed
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        You can always add your tools later from your profile.
      </p>
    </div>
  );
};

export default ToolsStep;
