"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { TextFormField, SelectFormField } from "./form-fields";
import { COUNTRIES, US_STATES } from "@/lib/constants/onboarding";

interface AddressFormProps<T extends FieldValues> {
  control: Control<T>;
  namePrefix: string;
}

export function AddressForm<T extends FieldValues>({
  control,
  namePrefix,
}: AddressFormProps<T>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <TextFormField
          control={control}
          name={`${namePrefix}.street_line_1` as Path<T>}
          label="Street Address"
          placeholder="123 Main Street"
        />
      </div>
      <div className="sm:col-span-2">
        <TextFormField
          control={control}
          name={`${namePrefix}.street_line_2` as Path<T>}
          label="Street Line 2 (Optional)"
          placeholder="Suite, Apt, Floor, etc."
        />
      </div>
      <TextFormField
        control={control}
        name={`${namePrefix}.city` as Path<T>}
        label="City"
        placeholder="San Francisco"
      />
      <SelectFormField
        control={control}
        name={`${namePrefix}.state` as Path<T>}
        label="State"
        options={US_STATES}
        placeholder="Select state"
      />
      <TextFormField
        control={control}
        name={`${namePrefix}.postal_code` as Path<T>}
        label="Postal Code"
        placeholder="94105"
      />
      <TextFormField
        control={control}
        name={`${namePrefix}.subdivision` as Path<T>}
        label="Subdivision"
        placeholder="e.g. County, Province"
      />
      <SelectFormField
        control={control}
        name={`${namePrefix}.country` as Path<T>}
        label="Country"
        options={COUNTRIES}
        placeholder="Select country"
      />
    </div>
  );
}
