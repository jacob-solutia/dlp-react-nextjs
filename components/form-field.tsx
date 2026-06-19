"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Shows the first validation message for a field, if any.
export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-destructive text-sm">{errors[0]}</p>;
}

// Label + Input + inline error wired together with a generated id. Shared by
// the invoice and customer forms.
export function TextField({
  label,
  name,
  errors,
  ...props
}: {
  label: string;
  name: string;
  errors?: string[];
} & React.ComponentProps<typeof Input>) {
  const id = React.useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        aria-invalid={errors?.length ? true : undefined}
        {...props}
      />
      <FieldError errors={errors} />
    </div>
  );
}
