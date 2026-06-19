"use client";

import * as React from "react";
import { useActionState } from "react";

import { createCustomer, updateCustomer, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form-field";
import type { Customer } from "@/lib/schema";

const initialState: FormState = {};

// One form for both creating and editing a customer. Pass `customer` to edit.
export function CustomerForm({
  customer,
  onSuccess,
  onCancel,
}: {
  customer?: Customer;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(customer);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateCustomer : createCustomer,
    initialState
  );

  React.useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {customer ? <input type="hidden" name="id" value={customer.id} /> : null}

      <TextField
        label="Name"
        name="name"
        defaultValue={customer?.name}
        errors={state.fieldErrors?.name}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        defaultValue={customer?.email}
        errors={state.fieldErrors?.email}
        required
      />

      {state.error ? (
        <p className="text-destructive text-sm">{state.error}</p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create customer"}
        </Button>
      </div>
    </form>
  );
}
