"use client";

import { useOnboarding } from "@/components/providers/onboarding-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

export default function TosReviewPage() {
  const { state, setStep, isHydrated } = useOnboarding();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Guard: both steps must be complete
  useEffect(() => {
    if (isHydrated && !state.businessDetails) {
      router.replace("/onboarding/business-details");
    } else if (isHydrated && !state.addressDetails) {
      router.replace("/onboarding/address-details");
    }
  }, [isHydrated, state.businessDetails, state.addressDetails, router]);

  if (!state.businessDetails || !state.addressDetails) return null;

  const { businessDetails, addressDetails } = state;

  const handleSignTos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mock/generate-tos-url", {
        method: "POST",
      });
      const data = await res.json();
      router.push(data.signing_url);
    } catch {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("address-details");
    router.push("/onboarding/address-details");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please review all details before signing the Terms of Service.
        </p>
      </div>

      {/* Business Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Legal Name" value={businessDetails.business_legal_name} />
          <Row label="Email" value={businessDetails.email} />
          <Row label="Business Type" value={businessDetails.business_type} />
          <Row label="Industry" value={businessDetails.business_industry} />
          <Row
            label="Incorporation"
            value={businessDetails.date_of_incorporation}
          />
          <Row
            label="Registration Number"
            value={businessDetails.business_registration_number}
          />
          {businessDetails.primary_website && (
            <Row label="Website" value={businessDetails.primary_website} />
          )}
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Account Purpose" value={businessDetails.account_purpose} />
          <Row
            label="Annual Revenue"
            value={businessDetails.estimated_annual_revenue_usd}
          />
          <Row label="Tax ID" value={businessDetails.tax_id} />
          <Row label="Tax Type" value={businessDetails.tax_type} />
        </CardContent>
      </Card>

      {/* Address Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registered Address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{addressDetails.registered_address.street_line_1}</p>
          {addressDetails.registered_address.street_line_2 && (
            <p>{addressDetails.registered_address.street_line_2}</p>
          )}
          <p>
            {addressDetails.registered_address.city},{" "}
            {addressDetails.registered_address.state}{" "}
            {addressDetails.registered_address.postal_code}
          </p>
          {addressDetails.registered_address.subdivision && (
            <p>{addressDetails.registered_address.subdivision}</p>
          )}
          <p>{addressDetails.registered_address.country}</p>
        </CardContent>
      </Card>

      {/* People Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Associated Persons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {businessDetails.associated_persons.map((person, i) => (
            <div key={i}>
              {i > 0 && <Separator className="mb-3" />}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {person.first_name} {person.last_name}
                </span>
                {person.is_signer && (
                  <Badge variant="secondary">Signer</Badge>
                )}
                {person.is_director && (
                  <Badge variant="secondary">Director</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{person.email}</p>
              {person.has_ownership && person.ownership_percentage !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Ownership: {person.ownership_percentage}%
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Tax: {person.tax_type} — {person.tax_id} ({person.country_of_tax})
              </p>
              <p className="text-sm text-muted-foreground">
                IDs: {person.identifying_information.length}
              </p>
              {person.poa && (
                <p className="text-sm text-muted-foreground">
                  POA: {person.poa_type || "Uploaded"}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Documents Summary */}
      {businessDetails.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {businessDetails.documents.map((doc, i) => (
              <p key={i} className="text-muted-foreground">
                {doc.doc_type.replace(/_/g, " ")}
                {doc.description && ` — ${doc.description}`}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
        <Button size="lg" onClick={handleSignTos} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-1.5" />
              Sign Terms of Service
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
