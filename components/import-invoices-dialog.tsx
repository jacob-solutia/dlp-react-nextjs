"use client";

import * as React from "react";
import { useActionState } from "react";
import { IconUpload } from "@tabler/icons-react";

import { importInvoices, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: FormState = {};

export function ImportInvoicesDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconUpload />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import invoices</DialogTitle>
          <DialogDescription>
            Upload a CSV with columns: customerName, customerEmail, amount,
            status, date. (Matches the export format.)
          </DialogDescription>
        </DialogHeader>
        <ImportForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ImportForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(
    importInvoices,
    initialState
  );

  React.useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="csv-file">CSV file</Label>
        <Input id="csv-file" name="file" type="file" accept=".csv,text/csv" required />
      </div>
      {state.error ? (
        <p className="text-destructive text-sm">{state.error}</p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Importing…" : "Import"}
        </Button>
      </div>
    </form>
  );
}
