export interface Address {
  street_line_1: string;
  street_line_2?: string;
  city: string;
  state: string;
  country: string;
  subdivision?: string;
  postal_code: string;
}

export interface IdentifyingInformation {
  type: string;
  issuing_country: string;
  national_identity_number: string;
  image_front: string;
  image_back: string;
}

export interface AssociatedPerson {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  birth_date: string;
  primary_nationality: string;
  has_ownership: boolean;
  has_control: boolean;
  is_signer: boolean;
  is_director: boolean;
  ownership_percentage?: number;
  country_of_tax: string;
  tax_type: string;
  tax_id: string;
  identifying_information: IdentifyingInformation[];
  poa: string;
  poa_type: string;
  residential_address?: Address;
}

export interface Document {
  doc_type: string;
  file: string;
  description?: string;
}

export interface CustomerPayload {
  business_legal_name: string;
  business_description: string;
  email: string;
  business_type: string;
  business_industry: string;
  registered_address: Address;
  date_of_incorporation: string;
  signed_agreement_id: string;
  associated_persons: AssociatedPerson[];
  account_purpose: string;
  source_of_funds: string[];
  source_of_wealth: string[];
  publicly_traded: boolean;
  estimated_annual_revenue_usd: string;
  expected_monthly_fiat_deposits: string;
  expected_monthly_fiat_withdrawals: string;
  tax_country: string;
  tax_id: string;
  tax_type: string;
  business_registration_number: string;
  primary_website?: string;
  documents: Document[];
}

export interface BusinessDetailsFormData {
  business_legal_name: string;
  business_description: string;
  email: string;
  business_type: string;
  business_industry: string;
  date_of_incorporation: string;
  account_purpose: string;
  source_of_funds: string[];
  source_of_wealth: string[];
  publicly_traded: boolean;
  estimated_annual_revenue_usd: string;
  expected_monthly_fiat_deposits: string;
  expected_monthly_fiat_withdrawals: string;
  tax_country: string;
  tax_id: string;
  tax_type: string;
  business_registration_number: string;
  primary_website?: string;
  associated_persons: Omit<AssociatedPerson, "residential_address">[];
  documents: Document[];
}

export interface AddressDetailsFormData {
  registered_address: Address;
  person_addresses: Address[];
}

export type OnboardingStep = "business-details" | "address-details" | "tos";

export interface OnboardingState {
  currentStep: OnboardingStep;
  businessDetails: BusinessDetailsFormData | null;
  addressDetails: AddressDetailsFormData | null;
  signedAgreementId: string | null;
  isComplete: boolean;
}
