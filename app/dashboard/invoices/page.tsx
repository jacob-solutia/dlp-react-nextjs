import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices } from "@/lib/schema";
import { InvoiceTable } from "@/components/invoice-table";
import { ImportInvoicesDialog } from "@/components/import-invoices-dialog";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";

// Filters come from the URL (?q=&status=), so the view is shareable and the
// server only fetches the matching rows.
export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const conditions = [];
  if (status === "paid" || status === "pending") {
    conditions.push(eq(invoices.status, status));
  }
  if (q) {
    conditions.push(
      or(
        like(invoices.customerName, `%${q}%`),
        like(invoices.customerEmail, `%${q}%`)
      )
    );
  }

  const rows = db
    .select()
    .from(invoices)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(invoices.number))
    .all();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
        <h2 className="text-lg font-semibold leading-none">Invoices</h2>
        <div className="flex items-center gap-2">
          <ImportInvoicesDialog />
          <Button asChild variant="outline" size="sm">
            <a href="/api/invoices/export">
              <IconDownload />
              Export
            </a>
          </Button>
        </div>
      </div>
      <InvoiceTable invoices={rows} fillHeight serverFiltered />
    </div>
  );
}
