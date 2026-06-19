import { db } from "@/lib/db";
import { invoices, customers } from "@/lib/schema";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { InvoiceTable } from "@/components/invoice-table";
import { SectionCards } from "@/components/section-cards";

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1).toLocaleString("en-US", { month: "short" });
}

// The dashboard home: invoice KPIs, a monthly billed chart, and a sortable
// invoices table — all fed from the database on the server.
export default async function Page() {
  const allInvoices = db.select().from(invoices).all();
  const customerCount = db.select().from(customers).all().length;

  const paid = allInvoices.filter((i) => i.status === "paid");
  const pending = allInvoices.filter((i) => i.status === "pending");
  const sum = (rows: typeof allInvoices) =>
    rows.reduce((s, i) => s + i.amount, 0);

  const stats = {
    totalBilled: sum(allInvoices),
    paidTotal: sum(paid),
    pendingTotal: sum(pending),
    paidCount: paid.length,
    pendingCount: pending.length,
    invoiceCount: allInvoices.length,
    customerCount,
  };

  // Billed dollars per month, split by status, for the area chart.
  const byMonth = new Map<string, { paid: number; pending: number }>();
  for (const inv of allInvoices) {
    const month = inv.date.slice(0, 7); // YYYY-MM
    const entry = byMonth.get(month) ?? { paid: 0, pending: 0 };
    entry[inv.status] += inv.amount / 100;
    byMonth.set(month, entry);
  }
  const monthly = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month: monthLabel(month),
      paid: Math.round(v.paid),
      pending: Math.round(v.pending),
    }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
      <SectionCards stats={stats} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={monthly} />
      </div>
      <InvoiceTable invoices={allInvoices} defaultPageSize={10} />
    </div>
  );
}
