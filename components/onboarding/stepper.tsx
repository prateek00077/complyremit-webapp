"use client";

import { Check } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/constants/onboarding";
import type { OnboardingStep } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

export function Stepper({ currentStep, completedSteps }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-xl mx-auto py-6">
      {ONBOARDING_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.includes(step.id);
        const isLast = index === ONBOARDING_STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-medium transition-colors",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isActive &&
                    !isCompleted &&
                    "border-primary text-primary bg-primary/10",
                  !isActive &&
                    !isCompleted &&
                    "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.step
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive && "text-primary",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3 mt-[-1.25rem] sm:mt-[-0.5rem]",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
