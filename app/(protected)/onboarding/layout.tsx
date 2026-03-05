"use client";

import { useOnboarding } from "@/components/providers/onboarding-provider";
import { Stepper } from "@/components/onboarding/stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import type { OnboardingStep } from "@/types/onboarding";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { state, isHydrated } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && state.isComplete) {
      router.replace("/dashboard");
    }
  }, [isHydrated, state.isComplete, router]);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full max-w-xl mx-auto" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (state.isComplete) {
    return null;
  }

  const completedSteps: OnboardingStep[] = [];
  if (state.businessDetails) completedSteps.push("business-details");
  if (state.addressDetails) completedSteps.push("address-details");
  if (state.signedAgreementId) completedSteps.push("tos");

  return (
    <div>
      <Stepper currentStep={state.currentStep} completedSteps={completedSteps} />
      {children}
    </div>
  );
}
