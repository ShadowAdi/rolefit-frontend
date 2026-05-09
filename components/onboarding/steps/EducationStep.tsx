"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcademicBase,
  AcademicCreateRequest,
  AcademicCreateRequestSchema,
} from "@/types/academic.types";
import { CreateAcademicAction } from "@/action/academic/academic.action";
interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString("default", { month: "long" }),
}));

const EducationStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [academics, setAcademics] = useState<AcademicBase[] | []>([]);

  const form = useForm<AcademicCreateRequest>({
    resolver: zodResolver(AcademicCreateRequestSchema),
    defaultValues: {
      college_name: "",
      degree_name: "",
      description: undefined,
      end_month: undefined,
      end_year: undefined,
      links: undefined,
      start_month: undefined,
      priority: undefined,
      start_year: undefined,
    },
  });

  const onSubmit = async (data: AcademicCreateRequest) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    setIsLoading(true);
    try {
      const result = await CreateAcademicAction(data, token);

      if (result.success) {
        // setAcademics([...academics, data]);
        toast.success("Academic added successfully!");
        form.reset();
      } else {
        if (result.errors && result.errors.length > 0) {
          const errorMessage = result.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ");
          toast.error(errorMessage);
        } else {
          toast.error(result.message || "Failed to add academics");
        }
      }
    } catch (error) {
      console.error("Error adding academic:", error);
      toast.error("An error occurred while adding academic");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-gray-600">
        You can add multiple experiences. Add at least one to continue.
      </p>
    </div>
  );
};

export default EducationStep;
