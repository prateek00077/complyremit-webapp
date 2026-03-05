"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

interface TextFormFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: string;
  placeholder?: string;
}

export function TextFormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
}: TextFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SelectFormFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export function SelectFormField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: SelectFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface TextareaFormFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  placeholder?: string;
  rows?: number;
}

export function TextareaFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
}: TextareaFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface MultiSelectFormFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export function MultiSelectFormField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: MultiSelectFormFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const values = (field.value as string[]) || [];
        const selectedLabels = values
          .map((v) => options.find((o) => o.value === v)?.label)
          .filter(Boolean);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="relative" ref={containerRef}>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-10"
              >
                <span className="flex flex-wrap gap-1 flex-1 text-left">
                  {selectedLabels.length > 0 ? (
                    selectedLabels.map((lbl, i) => (
                      <Badge
                        key={values[i]}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {lbl}
                        <span
                          role="button"
                          tabIndex={0}
                          className="ml-1 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(
                              values.filter((v) => v !== values[i])
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              field.onChange(
                                values.filter((v) => v !== values[i])
                              );
                            }
                          }}
                        >
                          <X className="w-3 h-3" />
                        </span>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      {placeholder || `Select ${label.toLowerCase()}`}
                    </span>
                  )}
                </span>
                <ChevronDown className="w-4 h-4 shrink-0 opacity-50 ml-2" />
              </button>
              {open && (
                <>
                  {/* backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                  />
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-auto">
                    {options.map((option) => {
                      const checked = values.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              if (isChecked) {
                                field.onChange([...values, option.value]);
                              } else {
                                field.onChange(
                                  values.filter(
                                    (v: string) => v !== option.value
                                  )
                                );
                              }
                            }}
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface SwitchFormFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {}

export function SwitchFormField<T extends FieldValues>({
  control,
  name,
  label,
}: SwitchFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FileUploadFormFieldProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  accept?: string;
}

export function FileUploadFormField<T extends FieldValues>({
  control,
  name,
  label,
  accept = "image/*,.pdf",
}: FileUploadFormFieldProps<T>) {
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(
    (file: File, onChange: (value: string) => void) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div>
              <Input
                type="file"
                accept={accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file, field.onChange);
                }}
              />
              {fileName && (
                <p className="text-xs text-muted-foreground mt-1">
                  {fileName}
                </p>
              )}
              {field.value && !fileName && (
                <p className="text-xs text-muted-foreground mt-1">
                  File uploaded
                </p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
