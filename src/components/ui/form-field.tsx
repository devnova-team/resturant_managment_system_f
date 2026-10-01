"use client";
import * as React from "react";
import { Controller, FormProvider, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** غلاف FormProvider — استخدمه حوالين <form>. */
export const Form = FormProvider;

type BaseProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
};

/**
 * FormField: label + control + وصف + رسالة الخطأ تحت الحقل.
 * بيربط aria-invalid و aria-describedby تلقائيًا، والخطأ role="alert" عشان قارئ الشاشة.
 */
export function FormField<T extends FieldValues>({
  name, label, description, required, className, children,
}: BaseProps<T> & {
  children: (a: { id: string; "aria-invalid": boolean; "aria-describedby": string | undefined } & Record<string, unknown>) => React.ReactNode;
}) {
  const { control } = useFormContext<T>();
  const reactId = React.useId();
  const id = `${reactId}-${name}`;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorId = `${id}-error`;
        const descId = `${id}-desc`;
        const describedBy = [fieldState.error ? errorId : null, description ? descId : null].filter(Boolean).join(" ") || undefined;
        return (
          <div className={cn("space-y-2", className)}>
            <Label htmlFor={id}>
              {label}
              {required && <span className="ms-1 text-destructive" aria-hidden>*</span>}
            </Label>
            {children({ ...field, id, "aria-invalid": !!fieldState.error, "aria-describedby": describedBy, "aria-required": required })}
            {description && <p id={descId} className="text-sm text-muted-foreground">{description}</p>}
            {fieldState.error?.message && (
              <p id={errorId} role="alert" className="text-sm font-medium text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export function InputField<T extends FieldValues>({
  name, label, description, required, className, ...input
}: BaseProps<T> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  return (
    <FormField<T> name={name} label={label} description={description} required={required} className={className}>
      {(f) => <Input {...(f as object)} {...input} />}
    </FormField>
  );
}

export function TextareaField<T extends FieldValues>({
  name, label, description, required, className, ...area
}: BaseProps<T> & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">) {
  return (
    <FormField<T> name={name} label={label} description={description} required={required} className={className}>
      {(f) => <Textarea {...(f as object)} {...area} />}
    </FormField>
  );
}
