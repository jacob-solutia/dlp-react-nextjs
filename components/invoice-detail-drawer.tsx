"use client";

import * as React from "react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { InvoiceForm } from "@/components/invoice-form";
import { formatUSD, invoiceNumber } from "@/lib/format";
import type { Invoice } from "@/lib/schema";

// Slide-out sheet that shows an invoice and lets you edit it. `children` is the
// trigger (e.g. the invoice number or customer name in the table).
export function InvoiceDetailDrawer({
  invoice,
  children,
}: {
  invoice: Invoice;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-mono">
            {invoiceNumber(invoice.number)}
          </DrawerTitle>
          <DrawerDescription>
            Edit this invoice and save your changes.
          </DrawerDescription>
          <Link
            href={`/dashboard/invoices/${invoice.number}`}
            className="text-primary text-sm underline-offset-4 hover:underline"
          >
            View full page →
          </Link>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Current</span>
            <span className="flex items-center gap-2 font-medium">
              {formatUSD(invoice.amount)}
              <Badge variant="outline" className="capitalize">
                {invoice.status}
              </Badge>
            </span>
          </div>

          <InvoiceForm
            invoice={invoice}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
