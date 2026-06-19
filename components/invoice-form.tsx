"use client";

import * as React from "react";
import { useActionState } from "react";

import { createInvoice, updateInvoice, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldError, TextField } from "@/components/form-field";
import type { Invoice } from "@/lib/schema";

const initialState: FormState = {};

// One form for both creating and editing an invoice. Pass `invoice` to edit;
// omit it to create. Validation errors come from the server action via
// useActionState.
export function InvoiceForm({
  invoice,
  onSuccess,
  onCancel,
}: {
  invoice?: Invoice;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(invoice);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateInvoice : createInvoice,
    initialState
  );
  const statusId = React.useId();

  React.useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {invoice ? <input type="hidden" name="id" value={invoice.id} /> : null}

      <TextField
        label="Customer name"
        name="customerName"
        defaultValue={invoice?.customerName}
        errors={state.fieldErrors?.customerName}
        required
      />
      <TextField
        label="Customer email"
        name="customerEmail"
        type="email"
        defaultValue={invoice?.customerEmail}
        errors={state.fieldErrors?.customerEmail}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Amount (USD)"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={invoice ? (invoice.amount / 100).toFixed(2) : undefined}
          errors={state.fieldErrors?.amount}
          required
        />
        <div className="grid gap-2">
          <Label htmlFor={statusId}>Status</Label>
          <select
            id={statusId}
            name="status"
            defaultValue={invoice?.status ?? "pending"}
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <FieldError errors={state.fieldErrors?.status} />
        </div>
      </div>

      {isEdit ? (
        <TextField
          label="Date"
          name="date"
          type="date"
          defaultValue={invoice?.date}
          errors={state.fieldErrors?.date}
        />
      ) : null}

      {state.error ? (
        <p className="text-destructive text-sm">{state.error}</p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create invoice"}
        </Button>
      </div>
    </form>
  );
}
