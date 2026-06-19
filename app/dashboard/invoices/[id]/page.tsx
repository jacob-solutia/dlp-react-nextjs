import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IconArrowLeft } from "@tabler/icons-react";

import { getInvoiceByNumber } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatUSD, invoiceNumber } from "@/lib/format";

// We use the human invoice number (e.g. 36 → INV-0036) as the URL id, so links
// read /dashboard/invoices/36 instead of a uuid.

// Dynamic, per-invoice <title>. params is a Promise in this version of Next.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const invoice = await getInvoiceByNumber(Number(id));
  if (!invoice) return { title: "Invoice not found" };
  return { title: `${invoiceNumber(invoice.number)} · ${invoice.customerName}` };
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceByNumber(Number(id));
  if (!invoice) notFound();

  const fields = [
    { label: "Customer", value: invoice.customerName },
    { label: "Email", value: invoice.customerEmail },
    { label: "Amount", value: formatUSD(invoice.amount) },
    { label: "Date", value: invoice.date },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/invoices">
          <IconArrowLeft className="size-4" />
          Back to invoices
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-mono">
            {invoiceNumber(invoice.number)}
            <Badge variant="outline" className="capitalize">
              {invoice.status}
            </Badge>
          </CardTitle>
          <CardDescription>Invoice details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                {field.label}
              </span>
              <span className="text-sm font-medium tabular-nums">
                {field.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
