import { InvoiceTable } from "@/components/invoice-table";
import { getInvoices } from "@/lib/queries";

// Filters come from the URL (?q=&status=), so the view is shareable and the
// server only fetches the matching rows.
export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const rows = await getInvoices({ q, status });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="px-4 lg:px-6">
        <h2 className="text-lg font-semibold leading-none">Invoices</h2>
      </div>
      <InvoiceTable invoices={rows} fillHeight serverFiltered />
    </div>
  );
}
