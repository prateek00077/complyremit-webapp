"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOnboarding } from "@/components/providers/onboarding-provider";
import { assemblePayload } from "@/lib/assemble-payload";
import { useEffect, useRef, Suspense } from "react";
import { Loader2 } from "lucide-react";

function CompleteContent() {
  const searchParams = useSearchParams();
  const signedAgreementId = searchParams.get("signed_agreement_id") ?? "";
  const router = useRouter();
  const { state, setComplete } = useOnboarding();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (!state.businessDetails || !state.addressDetails || !signedAgreementId) {
      router.replace("/onboarding/business-details");
      return;
    }

    hasRun.current = true;

    const payload = assemblePayload(
      state.businessDetails,
      state.addressDetails,
      signedAgreementId
    );

    fetch("/api/mock/create-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(
          "complyremit_customer",
          JSON.stringify(data)
        );
        setComplete();
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/onboarding/tos");
      });
  }, [
    state.businessDetails,
    state.addressDetails,
    signedAgreementId,
    setComplete,
    router,
  ]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">
        Creating your account, please wait...
      </p>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
