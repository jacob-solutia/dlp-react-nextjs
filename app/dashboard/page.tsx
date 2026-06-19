import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { InvoiceTable } from "@/components/invoice-table";
import { SectionCards } from "@/components/section-cards";
import { getDashboardData } from "@/lib/queries";

// The dashboard home: invoice KPIs, a monthly billed chart, and a sortable
// invoices table — all fed from the database on the server.
export default async function Page() {
  const { invoices, stats, monthly } = await getDashboardData();

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
      <SectionCards stats={stats} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={monthly} />
      </div>
      <InvoiceTable invoices={invoices} defaultPageSize={10} />
    </div>
  );
}
