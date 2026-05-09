"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const academicSchema = z.object({
  degree_name: z.string().min(1, "Degree Name is required"),
  college_name: z.string().min(1, "College Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  start_month: z.number().int().min(1).max(12).optional(),
  start_year: z.number().int().min(1900).max(2100).optional(),
  end_month: z.number().int().min(1).max(12).optional(),
  end_year: z.number().int().min(1900).max(2100).optional(),
  priority: z.number().optional(),
});

type AcademicFormDara = z.infer<typeof academicSchema>;

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString("default", { month: "long" }),
}));

const EducationStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAddEducation = () => {
    setIsCompleted(true);
    toast.success("Education added successfully!");
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
          Education form will be available shortly. Skip for now to continue
          with other sections.
        </p>

        <Button
          onClick={handleAddEducation}
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold"
        >
          Mark as Completed
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        You can always add your education details later from your profile.
      </p>
    </div>
  );
};

export default EducationStep;
