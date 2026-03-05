"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/providers/onboarding-provider";
import {
  businessDetailsSchema,
  type BusinessDetailsFormValues,
} from "@/lib/schemas/onboarding";
import {
  BUSINESS_TYPES,
  ACCOUNT_PURPOSES,
  SOURCE_OF_FUNDS,
  SOURCE_OF_WEALTH,
  REVENUE_RANGES,
  MONTHLY_VOLUME_RANGES,
  TAX_TYPES,
  COUNTRIES,
  ID_TYPES,
  DOCUMENT_TYPES,
  DEFAULT_PERSON,
  DEFAULT_IDENTIFYING_INFO,
} from "@/lib/constants/onboarding";
import {
  TextFormField,
  SelectFormField,
  TextareaFormField,
  MultiSelectFormField,
  SwitchFormField,
  FileUploadFormField,
} from "@/components/onboarding/form-fields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function BusinessDetailsPage() {
  const { state, setBusinessDetails, isHydrated } = useOnboarding();
  const router = useRouter();

  const form = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      business_legal_name: "",
      business_description: "",
      email: "",
      business_type: "",
      business_industry: "",
      date_of_incorporation: "",
      account_purpose: "",
      source_of_funds: [],
      source_of_wealth: [],
      publicly_traded: false,
      estimated_annual_revenue_usd: "",
      expected_monthly_fiat_deposits: "",
      expected_monthly_fiat_withdrawals: "",
      tax_country: "",
      tax_id: "",
      tax_type: "",
      business_registration_number: "",
      primary_website: "",
      associated_persons: [{ ...DEFAULT_PERSON }],
      documents: [],
    },
  });

  const {
    fields: personFields,
    append: appendPerson,
    remove: removePerson,
  } = useFieldArray({
    control: form.control,
    name: "associated_persons",
  });

  const {
    fields: docFields,
    append: appendDoc,
    remove: removeDoc,
  } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  // Repopulate from context if returning to this step
  useEffect(() => {
    if (isHydrated && state.businessDetails) {
      form.reset(state.businessDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const onSubmit = (data: BusinessDetailsFormValues) => {
    setBusinessDetails(data);
    router.push("/onboarding/address-details");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextFormField
              control={form.control}
              name="business_legal_name"
              label="Legal Business Name"
              placeholder="Acme Corporation"
            />
            <TextFormField
              control={form.control}
              name="email"
              label="Business Email"
              type="email"
              placeholder="contact@acmecorp.com"
            />
            <SelectFormField
              control={form.control}
              name="business_type"
              label="Business Type"
              options={BUSINESS_TYPES}
            />
            <TextFormField
              control={form.control}
              name="business_industry"
              label="Industry Code (NAICS)"
              placeholder="311615"
            />
            <TextFormField
              control={form.control}
              name="date_of_incorporation"
              label="Date of Incorporation"
              type="date"
            />
            <TextFormField
              control={form.control}
              name="business_registration_number"
              label="Registration Number"
              placeholder="e.g. 12345678"
            />
            <TextFormField
              control={form.control}
              name="primary_website"
              label="Primary Website"
              type="url"
              placeholder="https://example.com"
            />
            <div className="sm:col-span-2">
              <TextareaFormField
                control={form.control}
                name="business_description"
                label="Business Description"
                placeholder="Describe your business activities..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectFormField
              control={form.control}
              name="account_purpose"
              label="Account Purpose"
              options={ACCOUNT_PURPOSES}
            />
            <SelectFormField
              control={form.control}
              name="estimated_annual_revenue_usd"
              label="Estimated Annual Revenue"
              options={REVENUE_RANGES}
            />
            <SelectFormField
              control={form.control}
              name="expected_monthly_fiat_deposits"
              label="Expected Monthly Deposits"
              options={MONTHLY_VOLUME_RANGES}
            />
            <SelectFormField
              control={form.control}
              name="expected_monthly_fiat_withdrawals"
              label="Expected Monthly Withdrawals"
              options={MONTHLY_VOLUME_RANGES}
            />
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectFormField
              control={form.control}
              name="tax_country"
              label="Tax Country"
              options={COUNTRIES}
            />
            <SelectFormField
              control={form.control}
              name="tax_type"
              label="Tax Type"
              options={TAX_TYPES}
            />
            <TextFormField
              control={form.control}
              name="tax_id"
              label="Tax ID"
              placeholder="12-3456789"
            />
            <div className="flex items-end">
              <SwitchFormField
                control={form.control}
                name="publicly_traded"
                label="Publicly Traded Company"
              />
            </div>
          </CardContent>
        </Card>

        {/* Source of Funds & Wealth */}
        <Card>
          <CardHeader>
            <CardTitle>Source of Funds & Wealth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MultiSelectFormField
              control={form.control}
              name="source_of_funds"
              label="Source of Funds"
              options={SOURCE_OF_FUNDS}
              placeholder="Select sources of funds"
            />
            <Separator />
            <MultiSelectFormField
              control={form.control}
              name="source_of_wealth"
              label="Source of Wealth"
              options={SOURCE_OF_WEALTH}
              placeholder="Select sources of wealth"
            />
          </CardContent>
        </Card>

        {/* Associated Persons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Associated Persons</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPerson({ ...DEFAULT_PERSON })}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Person
            </Button>
          </CardHeader>
          <CardContent>
            {form.formState.errors.associated_persons?.root && (
              <p className="text-sm text-destructive mb-4">
                {form.formState.errors.associated_persons.root.message}
              </p>
            )}
            <Accordion type="multiple" defaultValue={["person-0"]}>
              {personFields.map((field, index) => (
                <AccordionItem key={field.id} value={`person-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>
                        {form.watch(
                          `associated_persons.${index}.first_name`
                        ) ||
                          form.watch(
                            `associated_persons.${index}.last_name`
                          )
                          ? `${form.watch(`associated_persons.${index}.first_name`)} ${form.watch(`associated_persons.${index}.last_name`)}`
                          : `Person ${index + 1}`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.first_name`}
                          label="First Name"
                          placeholder="John"
                        />
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.middle_name`}
                          label="Middle Name"
                          placeholder="Michael (optional)"
                        />
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.last_name`}
                          label="Last Name"
                          placeholder="Smith"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.email`}
                          label="Email"
                          type="email"
                          placeholder="john@example.com"
                        />
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.birth_date`}
                          label="Date of Birth"
                          type="date"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectFormField
                          control={form.control}
                          name={`associated_persons.${index}.primary_nationality`}
                          label="Nationality"
                          options={COUNTRIES}
                        />
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <SwitchFormField
                          control={form.control}
                          name={`associated_persons.${index}.has_ownership`}
                          label="Has Ownership"
                        />
                        <SwitchFormField
                          control={form.control}
                          name={`associated_persons.${index}.has_control`}
                          label="Has Control"
                        />
                        <SwitchFormField
                          control={form.control}
                          name={`associated_persons.${index}.is_signer`}
                          label="Is Signer"
                        />
                        <SwitchFormField
                          control={form.control}
                          name={`associated_persons.${index}.is_director`}
                          label="Is Director"
                        />
                      </div>

                      {form.watch(`associated_persons.${index}.has_ownership`) && (
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.ownership_percentage`}
                          label="Ownership %"
                          type="number"
                          placeholder="e.g. 25"
                        />
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectFormField
                          control={form.control}
                          name={`associated_persons.${index}.country_of_tax`}
                          label="Tax Country"
                          options={COUNTRIES}
                        />
                        <SelectFormField
                          control={form.control}
                          name={`associated_persons.${index}.tax_type`}
                          label="Tax Type"
                          options={TAX_TYPES}
                        />
                        <TextFormField
                          control={form.control}
                          name={`associated_persons.${index}.tax_id`}
                          label="Tax ID"
                          placeholder="Tax ID number"
                        />
                      </div>

                      <Separator />

                      {/* Identifying Information */}
                      <PersonIdentifyingInfo
                        control={form.control}
                        personIndex={index}
                      />

                      <Separator />

                      {/* Proof of Address */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">
                          Proof of Address
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <TextFormField
                            control={form.control}
                            name={`associated_persons.${index}.poa_type`}
                            label="POA Type"
                            placeholder="e.g. Utility bill, Bank statement"
                          />
                          <FileUploadFormField
                            control={form.control}
                            name={`associated_persons.${index}.poa`}
                            label="POA Document"
                          />
                        </div>
                      </div>

                      {personFields.length > 1 && (
                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePerson(index)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove Person
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendDoc({ doc_type: "", file: "", description: "" })}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Document
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {docFields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No documents added yet. Click &quot;Add Document&quot; to
                upload supporting documents.
              </p>
            )}
            {docFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 border rounded-md p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <SelectFormField
                    control={form.control}
                    name={`documents.${index}.doc_type`}
                    label="Document Type"
                    options={DOCUMENT_TYPES}
                  />
                  <FileUploadFormField
                    control={form.control}
                    name={`documents.${index}.file`}
                    label="File"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDoc(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <TextFormField
                  control={form.control}
                  name={`documents.${index}.description`}
                  label="Description"
                  placeholder="e.g. Certificate of Formation"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Continue to Address Details
          </Button>
        </div>
      </form>
    </Form>
  );
}

/** Nested identifying information array for a person */
function PersonIdentifyingInfo({
  control,
  personIndex,
}: {
  control: BusinessDetailsFormValues extends infer T
    ? T extends object
      ? import("react-hook-form").Control<BusinessDetailsFormValues>
      : never
    : never;
  personIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `associated_persons.${personIndex}.identifying_information` as const,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Identifying Information</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...DEFAULT_IDENTIFYING_INFO })}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add ID
        </Button>
      </div>
      {fields.map((field, idIndex) => (
        <div
          key={field.id}
          className="border rounded-md p-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectFormField
              control={control}
              name={`associated_persons.${personIndex}.identifying_information.${idIndex}.type`}
              label="ID Type"
              options={ID_TYPES}
            />
            <SelectFormField
              control={control}
              name={`associated_persons.${personIndex}.identifying_information.${idIndex}.issuing_country`}
              label="Issuing Country"
              options={COUNTRIES}
            />
            <TextFormField
              control={control}
              name={`associated_persons.${personIndex}.identifying_information.${idIndex}.national_identity_number`}
              label="ID Number"
              placeholder="ID number"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUploadFormField
              control={control}
              name={`associated_persons.${personIndex}.identifying_information.${idIndex}.image_front`}
              label="Front Image"
            />
            <FileUploadFormField
              control={control}
              name={`associated_persons.${personIndex}.identifying_information.${idIndex}.image_back`}
              label="Back Image"
            />
          </div>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(idIndex)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove ID
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
