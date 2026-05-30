"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingMethodStep from "@/components/onboarding/steps/OnboardingMethodStep";
import ResumeExtractorStep from "@/components/onboarding/steps/ResumeExtractorStep";
import ExperienceStep from "@/components/onboarding/steps/ExperienceStep";
import EducationStep from "@/components/onboarding/steps/EducationStep";
import SkillsStep from "@/components/onboarding/steps/SkillsStep";
import ToolsStep from "@/components/onboarding/steps/ToolsStep";
import ProjectsStep from "@/components/onboarding/steps/ProjectsStep";
import PublicationsStep from "@/components/onboarding/steps/PublicationsStep";
import { markOnboardingCompleted } from "@/lib/postLoginRedirect";
import { completeOnboardingAction, getProfile } from "@/action/profile/profile.action";
import { toast } from "sonner";

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

const MANUAL_STEPS: StepConfig[] = [
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
    title: "Tools",
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

type OnboardingMethod = "resume" | "manual" | null;

const OnboardingPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [onboardingMethod, setOnboardingMethod] = useState<OnboardingMethod>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [token, authLoading, router]);

  // Check if profile already exists - if so, skip method selection
  useEffect(() => {
    const checkProfile = async () => {
      if (!token || authLoading) return;

      try {
        const result = await getProfile(token);
        if (result.success && result.data?.data) {
          // Profile exists, redirect to profile page to view/complete it
          router.push("/profile");
        }
      } catch (err) {
        // No profile exists, allow method selection
        console.log("No profile found, showing method selection");
      }
    };

    checkProfile();
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

  if (!onboardingMethod) {
    const handleMethodSelect = (method: "resume" | "manual") => {
      if (method === "manual") {
        // For manual path: go to profile page to create profile first
        router.push("/profile");
      } else {
        // For resume extractor path: stay here and extract resume
        setOnboardingMethod(method);
      }
    };

    return (
      <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-lime-100/20 blur-3xl" />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-950 mb-2">
                Let's Build Your Profile
              </h1>
              <p className="text-lg text-gray-600">
                Choose the fastest way to get started
              </p>
            </div>

            <OnboardingMethodStep onSelectMethod={handleMethodSelect} />
          </div>
        </div>
      </div>
    );
  }

  if (onboardingMethod === "resume") {
    return (
      <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-lime-100/20 blur-3xl" />

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-white/60">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <h2 className="text-2xl font-bold text-gray-950">
                Upload Your Resume
              </h2>
              <p className="text-gray-600 mt-1">Step 1 of 1</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl">
              <ResumeExtractorStep
                onNext={async () => {
                  const result = await completeOnboardingAction(token || "");
                  if (!result.success) {
                    toast.error(
                      result.message || "Failed to mark onboarding complete"
                    );
                    return;
                  }
                  markOnboardingCompleted();
                  router.push("/profile");
                }}
                onSkip={() => setOnboardingMethod("manual")}
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-20 bg-white/70 backdrop-blur-md border-t border-white/60">
            <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3 justify-between">
              <Button
                onClick={() => setOnboardingMethod(null)}
                variant="outline"
                size="lg"
                className="min-w-30 border-gray-300"
              >
                <ChevronLeft className="size-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Manual entry flow
  const steps = MANUAL_STEPS;
  const step = steps[currentStep];
  const StepComponent = step.component;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < steps.length - 1) {
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

  const handleComplete = async () => {
    if (token) {
      const result = await completeOnboardingAction(token);
      if (!result.success) {
        toast.error(result.message || "Failed to mark onboarding complete");
        return;
      }
    }
    markOnboardingCompleted();
    router.push("/profile");
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-lime-100/20 blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-white/60">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Step {currentStep + 1} of {steps.length}
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
                className="h-full bg-linear-to-r from-lime-400 to-lime-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex gap-2 mt-8 overflow-x-auto py-4 items-center justify-around">
              <div className="flex items-start w-full">
                {steps.map((s, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const isActive = idx === currentStep;
                  const isClickable = idx < currentStep || isDone;

                  return (
                    <div key={s.id} className="flex items-start flex-1 w-full">
                      <div className="flex flex-col items-center flex-1">
                        <button
                          onClick={() => {
                            if (isClickable) {
                              setCurrentStep(idx);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          disabled={!isClickable && !isActive}
                          className={`
                            w-12 h-12 rounded-full font-semibold text-sm
                            flex items-center justify-center
                            transition-all duration-300 relative z-10 shadow-sm
                            ${
                              isActive
                                ? "bg-lime-500 text-white ring-4 ring-lime-200 shadow-lg cursor-default scale-110"
                                : isDone
                                  ? "bg-lime-200 text-lime-700 border-2 border-lime-400 hover:bg-lime-300 hover:scale-105 cursor-pointer"
                                  : "bg-gray-200 text-gray-500 border-2 border-gray-300 cursor-not-allowed"
                            }
                          `}
                        >
                          {isDone ? (
                            <Check className="w-5 h-5 font-bold" />
                          ) : (
                            idx + 1
                          )}
                        </button>
                        <span
                          className={`text-xs mt-2.5 text-center leading-tight font-medium transition-all ${
                            isActive
                              ? "text-lime-600 font-bold"
                              : isDone
                                ? "text-lime-600"
                                : "text-gray-400"
                          }`}
                        >
                          {s.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-3xl">
            <div className="mb-8">
              <p className="text-gray-600 text-lg">{step.subtitle}</p>
            </div>

            <StepComponent onNext={handleNext} onSkip={handleSkip} />
          </div>
        </div>

        <div className="sticky bottom-0 z-20 bg-white/70 backdrop-blur-md border-t border-white/60">
          <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3 justify-between">
            <Button
              onClick={currentStep === 0 ? () => setOnboardingMethod(null) : handleBack}
              variant="outline"
              size="lg"
              className="min-w-30 border-gray-300"
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
              className="min-w-30 bg-lime-500 hover:bg-lime-600 text-white font-semibold"
            >
              {currentStep === steps.length - 1 ? (
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
