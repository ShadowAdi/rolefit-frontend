"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { ProjectGetResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  techStack: z.array(z.string()).nullable().optional(),
  links: z.record(z.string(), z.string()).nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  priority: z.number().nullable().optional(),
});

type ProjectFormDara = z.infer<typeof projectSchema>;

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString("default", { month: "long" }),
}));

const ProjectsStep: React.FC<StepProps> = ({ onNext, onSkip }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alreadyAddedProject, setAlreadyAddedProject] = useState<
    ProjectGetResponse[]
  >([]);

   const callGetProject = async () => {
      if (!token) {
        toast.error(`User Not Authenticated`);
        console.error(`User token not found: ${token}`);
        return;
      }
      const { success, data } = await GetAllExperiencesAction(token, {
        sortOrder: "desc",
      });
      if (success && data) {
        setAlreadyAddedExperience(data);
      }
    };
  
    useEffect(() => {
      callGetExperience();
    }, [token]);
  

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
          Projects form will be available shortly. Skip for now to continue with
          other sections.
        </p>

        <Button
          onClick={handleAddProjects}
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold"
        >
          Mark as Completed
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        You can always add your projects later from your profile.
      </p>
    </div>
  );
};

export default ProjectsStep;
