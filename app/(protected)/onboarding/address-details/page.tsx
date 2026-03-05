"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/providers/onboarding-provider";
import {
  addressDetailsSchema,
  type AddressDetailsFormValues,
} from "@/lib/schemas/onboarding";
import { AddressForm } from "@/components/onboarding/address-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const emptyAddress = {
  street_line_1: "",
  street_line_2: "",
  city: "",
  state: "",
  country: "",
  subdivision: "",
  postal_code: "",
};

export default function AddressDetailsPage() {
  const { state, setAddressDetails, setStep, isHydrated } = useOnboarding();
  const router = useRouter();

  // Guard: redirect to Step 1 if business details not completed
  useEffect(() => {
    if (isHydrated && !state.businessDetails) {
      router.replace("/onboarding/business-details");
    }
  }, [isHydrated, state.businessDetails, router]);

  const persons = state.businessDetails?.associated_persons ?? [];

  const form = useForm<AddressDetailsFormValues>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      registered_address: { ...emptyAddress },
      person_addresses: persons.map(() => ({ ...emptyAddress })),
    },
  });

  // Repopulate from context if returning to this step
  useEffect(() => {
    if (isHydrated && state.addressDetails) {
      form.reset(state.addressDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  if (!state.businessDetails) return null;

  const onSubmit = (data: AddressDetailsFormValues) => {
    setAddressDetails(data);
    router.push("/onboarding/tos");
  };

  const handleBack = () => {
    setStep("business-details");
    router.push("/onboarding/business-details");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Registered Business Address */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Business Address</CardTitle>
            <CardDescription>
              The official registered address of your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddressForm
              control={form.control}
              namePrefix="registered_address"
            />
          </CardContent>
        </Card>

        {/* Person Addresses */}
        {persons.map((person, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                {person.first_name} {person.last_name} — Residential Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddressForm
                control={form.control}
                namePrefix={`person_addresses.${index}`}
              />
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          <Button type="submit" size="lg">
            Continue to Terms of Service
          </Button>
        </div>
      </form>
    </Form>
  );
}
