"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useOnboarding } from "@/components/providers/onboarding-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

function TosSignContent() {
  const searchParams = useSearchParams();
  const agreementId = searchParams.get("agreement_id") ?? "";
  const router = useRouter();
  const { setSignedAgreement } = useOnboarding();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSign = () => {
    setLoading(true);
    setSignedAgreement(agreementId);
    router.push(
      `/onboarding/tos/complete?signed_agreement_id=${agreementId}`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Terms of Service</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please read and agree to the terms below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            ComplyRemit Service Agreement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto rounded border p-4 text-sm text-muted-foreground space-y-3 bg-muted/20">
            <p>
              <strong>1. Services.</strong> ComplyRemit provides business
              onboarding, compliance verification, and payment facilitation
              services (&quot;Services&quot;). By using the Services, you agree
              to comply with all applicable laws and regulations.
            </p>
            <p>
              <strong>2. Account Responsibilities.</strong> You are responsible
              for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You must
              notify us immediately of any unauthorized use.
            </p>
            <p>
              <strong>3. KYB/KYC Compliance.</strong> You agree to provide
              accurate and complete information during the onboarding process.
              ComplyRemit reserves the right to verify all submitted
              information and may request additional documentation.
            </p>
            <p>
              <strong>4. Data Privacy.</strong> We collect and process personal
              data in accordance with our Privacy Policy. Your data will be
              used solely for compliance, verification, and service delivery
              purposes.
            </p>
            <p>
              <strong>5. Fees and Payments.</strong> Service fees are outlined
              in your service agreement. All fees are non-refundable unless
              otherwise stated. We reserve the right to modify fees with 30
              days prior notice.
            </p>
            <p>
              <strong>6. Prohibited Activities.</strong> You may not use the
              Services for money laundering, terrorist financing, fraud, or
              any other illegal activity. Violation may result in immediate
              account termination and reporting to relevant authorities.
            </p>
            <p>
              <strong>7. Limitation of Liability.</strong> ComplyRemit shall
              not be liable for any indirect, incidental, special, or
              consequential damages arising from the use of the Services.
            </p>
            <p>
              <strong>8. Termination.</strong> Either party may terminate this
              agreement with 30 days written notice. ComplyRemit may
              immediately terminate accounts that violate these terms.
            </p>
            <p>
              <strong>9. Governing Law.</strong> This agreement shall be
              governed by the laws of the State of Delaware, United States,
              without regard to conflict of law principles.
            </p>
            <p>
              <strong>10. Amendments.</strong> ComplyRemit reserves the right
              to amend these terms at any time. Continued use of the Services
              after amendment constitutes acceptance of the revised terms.
            </p>
          </div>
        </CardContent>
      </Card>

      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
        />
        <span className="text-sm">
          I have read and agree to the Terms of Service
        </span>
      </label>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSign} disabled={!agreed || loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Signing...
            </>
          ) : (
            "Sign and Continue"
          )}
        </Button>
      </div>
    </div>
  );
}

export default function TosSignPage() {
  return (
    <Suspense>
      <TosSignContent />
    </Suspense>
  );
}
