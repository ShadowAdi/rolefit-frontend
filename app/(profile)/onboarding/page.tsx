"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExperienceStep from "@/components/onboarding/steps/ExperienceStep";
import EducationStep from "@/components/onboarding/steps/EducationStep";
import SkillsStep from "@/components/onboarding/steps/SkillsStep";
import ToolsStep from "@/components/onboarding/steps/ToolsStep";
import ProjectsStep from "@/components/onboarding/steps/ProjectsStep";
import PublicationsStep from "@/components/onboarding/steps/PublicationsStep";

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  component: React.ComponentType<StepProps>;
}

interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Work Experience",
    subtitle: "Tell us about your professional background",
    component: ExperienceStep,
  },
  {
    id: 2,
    title: "Academics",
    subtitle: "Share your academic qualifications",
    component: EducationStep,
  },
  {
    id: 3,
    title: "Skills",
    subtitle: "List your professional skills",
    component: SkillsStep,
  },
  {
    id: 4,
    title: "Tools & Technologies",
    subtitle: "Add tools and technologies you know",
    component: ToolsStep,
  },
  {
    id: 5,
    title: "Projects",
    subtitle: "Showcase your portfolio projects",
    component: ProjectsStep,
  },
  {
    id: 6,
    title: "Publications",
    subtitle: "Share your publications and achievements",
    component: PublicationsStep,
  },
];

const OnboardingPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [token, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const step = STEPS[currentStep];
  const StepComponent = step.component;
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  const isStepCompleted = completedSteps.includes(currentStep);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-lime-100/20 blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-white/60">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h2 className="text-2xl font-bold text-gray-950 mt-1">
                  {step.title}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-lime-600">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-lime-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {STEPS.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex flex-col items-center gap-1 min-w-fit"
                >
                  <button
                    onClick={() => {
                      if (idx < currentStep || completedSteps.includes(idx)) {
                        setCurrentStep(idx);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={idx > currentStep && !completedSteps.includes(idx)}
                    className={`w-10 h-10 rounded-full font-medium transition-all flex items-center justify-center ${
                      idx === currentStep
                        ? "bg-lime-500 text-white ring-2 ring-lime-500 ring-offset-2"
                        : idx < currentStep || completedSteps.includes(idx)
                          ? "bg-lime-200 text-lime-800 hover:bg-lime-300 cursor-pointer"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {idx < currentStep || completedSteps.includes(idx) ? (
                      <span className="text-sm">✓</span>
                    ) : (
                      idx + 1
                    )}
                  </button>
                  <span className="text-xs text-gray-600 text-center w-12 truncate">
                    {s.title.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <p className="text-gray-600 text-lg">{step.subtitle}</p>
            </div>

            <StepComponent onNext={handleNext} onSkip={handleSkip} />
          </div>
        </div>

        <div className="sticky bottom-0 z-20 bg-white/70 backdrop-blur-md border-t border-white/60">
          <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3 justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              size="lg"
              className="min-w-[120px] border-gray-300"
            >
              <ChevronLeft className="size-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleSkip}
              variant="ghost"
              size="lg"
              className="text-gray-600"
            >
              Skip
            </Button>

            <Button
              onClick={handleNext}
              size="lg"
              className="min-w-[120px] bg-lime-500 hover:bg-lime-600 text-white font-semibold"
            >
              {currentStep === STEPS.length - 1 ? (
                "Complete"
              ) : (
                <>
                  Next
                  <ChevronRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
