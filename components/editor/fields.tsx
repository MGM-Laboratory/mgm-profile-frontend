"use client";

import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";

import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { MONTHS } from "@/lib/constants";

// RHF-bound field helpers shared by every section form. Generic over the form
// shape so field names stay type-checked.

function errMsg<T extends FieldValues>(form: UseFormReturn<T>, name: Path<T>): string | undefined {
  const e = form.formState.errors[name as keyof typeof form.formState.errors];
  return e?.message as string | undefined;
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  required,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <Field label={label} htmlFor={name} error={errMsg(form, name)} required={required}>
      <Input id={name} type={type} placeholder={placeholder} {...form.register(name)} />
    </Field>
  );
}

export function TextAreaField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  rows,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field label={label} htmlFor={name} error={errMsg(form, name)}>
      <Textarea id={name} rows={rows} placeholder={placeholder} {...form.register(name)} />
    </Field>
  );
}

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder = "Select…",
  required,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} htmlFor={name} error={errMsg(form, name)} required={required}>
      <Select id={name} {...form.register(name)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function SwitchField<T extends FieldValues>({
  form,
  name,
  label,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <label className="flex cursor-pointer items-center justify-between gap-4 py-1">
          <span className="text-body-sm text-ink-2">{label}</span>
          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
        </label>
      )}
    />
  );
}

// MonthYearField renders an optional month + year pair, storing numbers or null.
export function MonthYearField<T extends FieldValues>({
  form,
  monthName,
  yearName,
  label,
}: {
  form: UseFormReturn<T>;
  monthName?: Path<T>;
  yearName: Path<T>;
  label: string;
}) {
  const now = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => now + 5 - i);
  const toNum = (v: string) => (v === "" ? null : Number(v));

  return (
    <Field label={label}>
      <div className="flex gap-2">
        {monthName && (
          <Controller
            control={form.control}
            name={monthName}
            render={({ field }) => (
              <Select
                aria-label={`${label} month`}
                value={field.value == null ? "" : String(field.value)}
                onChange={(e) => field.onChange(toNum(e.target.value))}
              >
                <option value="">Month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </Select>
            )}
          />
        )}
        <Controller
          control={form.control}
          name={yearName}
          render={({ field }) => (
            <Select
              aria-label={`${label} year`}
              value={field.value == null ? "" : String(field.value)}
              onChange={(e) => field.onChange(toNum(e.target.value))}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          )}
        />
      </div>
    </Field>
  );
}
