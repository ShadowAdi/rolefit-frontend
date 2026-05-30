"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Edit3 } from "lucide-react";

interface OnboardingMethodStepProps {
  onSelectMethod: (method: "resume" | "manual") => void;
}

const OnboardingMethodStep = ({ onSelectMethod }: OnboardingMethodStepProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cardClasses = (method: string) =>
    hoveredCard === method
      ? "relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group border-lime-500 bg-lime-50/50 shadow-lg"
      : "relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group border-gray-200 bg-white hover:border-lime-300";

  const iconClasses = (method: string) =>
    hoveredCard === method
      ? "w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 bg-lime-500 text-white"
      : "w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 bg-lime-100 text-lime-600";

  const buttonClasses = (method: string) =>
    hoveredCard === method
      ? "w-full transition-all duration-300 bg-lime-500 hover:bg-lime-600 text-white"
      : "w-full transition-all duration-300 bg-lime-100 text-lime-700 hover:bg-lime-200";

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <p className="text-gray-700 text-base leading-relaxed mb-2">
          Choose how you'd like to set up your profile:
        </p>
        <p className="text-sm text-gray-600">
          You can always edit your information later in your profile.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Resume Extractor Card */}
        <div
          onMouseEnter={() => setHoveredCard("resume")}
          onMouseLeave={() => setHoveredCard(null)}
          className={cardClasses("resume")}
        >
          <div className={iconClasses("resume")}>
            <FileText className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Upload Resume
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Paste a link to your resume and we'll automatically extract all your
            information. Perfect if you already have a digital resume ready.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-200 text-lime-700 mr-3 text-xs font-bold">
                ✓
              </span>
              Supports Google Drive, Dropbox, and direct links
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-200 text-lime-700 mr-3 text-xs font-bold">
                ✓
              </span>
              Extracts all sections automatically
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-200 text-lime-700 mr-3 text-xs font-bold">
                ✓
              </span>
              Takes 1-2 minutes
            </div>
          </div>

          <Button
            onClick={() => onSelectMethod("resume")}
            className={buttonClasses("resume")}
          >
            Choose This Method
          </Button>
        </div>

        {/* Manual Entry Card */}
        <div
          onMouseEnter={() => setHoveredCard("manual")}
          onMouseLeave={() => setHoveredCard(null)}
          className={cardClasses("manual")}
        >
          <div className={iconClasses("manual")}>
            <Edit3 className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Fill Manually
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Build your profile step by step by filling in each section. You'll
            have complete control over what information to include.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-200 text-lime-700 mr-3 text-xs font-bold">
                ✓
              </span>
              Complete control over your information
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-200 text-lime-700 mr-3 text-xs font-bold">
                ✓
              </span>
              Add custom details and descriptions
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-200 text-lime-700 mr-3 text-xs font-bold">
                ✓
              </span>
              Takes 10-15 minutes
            </div>
          </div>

          <Button
            onClick={() => onSelectMethod("manual")}
            className={buttonClasses("manual")}
          >
            Choose This Method
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingMethodStep;
