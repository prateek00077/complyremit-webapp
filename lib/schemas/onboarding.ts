import { z } from "zod";

export const addressSchema = z.object({
  street_line_1: z.string().min(1, "Street address is required"),
  street_line_2: z.string(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  subdivision: z.string(),
  postal_code: z.string().min(1, "Postal code is required"),
});

export const identifyingInformationSchema = z.object({
  type: z.string().min(1, "ID type is required"),
  issuing_country: z.string().min(1, "Issuing country is required"),
  national_identity_number: z.string().min(1, "ID number is required"),
  image_front: z.string().min(1, "Front image is required"),
  image_back: z.string(),
});

export const associatedPersonSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string(),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  birth_date: z.string().min(1, "Birth date is required"),
  primary_nationality: z.string().min(1, "Nationality is required"),
  has_ownership: z.boolean(),
  has_control: z.boolean(),
  is_signer: z.boolean(),
  is_director: z.boolean(),
  identifying_information: z
    .array(identifyingInformationSchema)
    .min(1, "At least one ID is required"),
  ownership_percentage: z.number().min(0).max(100).optional(),
  country_of_tax: z.string().min(1, "Tax country is required"),
  tax_type: z.string().min(1, "Tax type is required"),
  tax_id: z.string().min(1, "Tax ID is required"),
  poa: z.string(),
  poa_type: z.string(),
});

export const documentSchema = z.object({
  doc_type: z.string().min(1, "Document type is required"),
  file: z.string().min(1, "File is required"),
  description: z.string(),
});

export const businessDetailsSchema = z.object({
  business_legal_name: z.string().min(1, "Business legal name is required"),
  business_description: z.string().min(1, "Business description is required"),
  email: z.string().email("Valid email is required"),
  business_type: z.string().min(1, "Business type is required"),
  business_industry: z.string().min(1, "Industry code is required"),
  date_of_incorporation: z
    .string()
    .min(1, "Date of incorporation is required"),
  account_purpose: z.string().min(1, "Account purpose is required"),
  source_of_funds: z
    .array(z.string())
    .min(1, "Select at least one source of funds"),
  source_of_wealth: z
    .array(z.string())
    .min(1, "Select at least one source of wealth"),
  publicly_traded: z.boolean(),
  estimated_annual_revenue_usd: z
    .string()
    .min(1, "Revenue range is required"),
  expected_monthly_fiat_deposits: z
    .string()
    .min(1, "Monthly deposits range is required"),
  expected_monthly_fiat_withdrawals: z
    .string()
    .min(1, "Monthly withdrawals range is required"),
  tax_country: z.string().min(1, "Tax country is required"),
  tax_id: z.string().min(1, "Tax ID is required"),
  tax_type: z.string().min(1, "Tax type is required"),
  business_registration_number: z
    .string()
    .min(1, "Business registration number is required"),
  primary_website: z.string(),
  associated_persons: z
    .array(associatedPersonSchema)
    .min(1, "At least one associated person is required"),
  documents: z.array(documentSchema),
});

export const addressDetailsSchema = z.object({
  registered_address: addressSchema,
  person_addresses: z.array(addressSchema),
});

export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>;
export type AddressDetailsFormValues = z.infer<typeof addressDetailsSchema>;
