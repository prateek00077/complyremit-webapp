"use client";

import { useOnboarding } from "@/components/providers/onboarding-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

interface CustomerData {
  customer_id: string;
  status: string;
  business_legal_name: string;
}

export default function DashboardPage() {
  const { state, isHydrated } = useOnboarding();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    if (isHydrated && !state.isComplete) {
      router.replace(`/onboarding/${state.currentStep}`);
      return;
    }
    try {
      const stored = localStorage.getItem("complyremit_customer");
      if (stored) {
        setCustomer(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isHydrated, state.isComplete, state.currentStep, router]);

  if (!isHydrated || !state.isComplete) return null;

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-center gap-3 py-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-medium text-green-900">
              Onboarding Complete
            </p>
            <p className="text-sm text-green-700">
              Your business application has been submitted and is pending
              review.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Business Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {customer && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID</span>
                <code className="text-xs bg-muted px-2 py-0.5 rounded">
                  {customer.customer_id}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">{customer.status}</Badge>
              </div>
              <Separator />
            </>
          )}
          {state.businessDetails && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Name</span>
                <span className="font-medium">
                  {state.businessDetails.business_legal_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{state.businessDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Type</span>
                <span className="capitalize">
                  {state.businessDetails.business_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span>{state.businessDetails.business_industry}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Associated Persons */}
      {state.businessDetails &&
        state.businessDetails.associated_persons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Associated Persons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.businessDetails.associated_persons.map((person, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {person.first_name} {person.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {person.email}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {person.is_signer && (
                        <Badge variant="outline">Signer</Badge>
                      )}
                      {person.is_director && (
                        <Badge variant="outline">Director</Badge>
                      )}
                      {person.has_ownership && (
                        <Badge variant="outline">Owner</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
