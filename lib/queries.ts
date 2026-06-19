import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "./db";
import { invoices, customers } from "./schema";

// Data-access layer: all database reads live here, so pages just call a helper
// and render. (Writes live in lib/actions.ts.)

export type InvoiceFilters = { q?: string; status?: string };

export async function getInvoices(filters: InvoiceFilters = {}) {
  const conditions = [];
  if (filters.status === "paid" || filters.status === "pending") {
    conditions.push(eq(invoices.status, filters.status));
  }
  if (filters.q) {
    conditions.push(
      or(
        like(invoices.customerName, `%${filters.q}%`),
        like(invoices.customerEmail, `%${filters.q}%`)
      )
    );
  }
  return db
    .select()
    .from(invoices)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(invoices.number))
    .all();
}

export async function getCustomers() {
  return db.select().from(customers).all();
}

export async function getInvoiceByNumber(n: number) {
  if (!Number.isInteger(n)) return undefined;
  return db.select().from(invoices).where(eq(invoices.number, n)).get();
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1).toLocaleString("en-US", { month: "short" });
}

// Everything the dashboard home needs: KPI stats, the monthly chart series, and
// the invoices list.
export async function getDashboardData() {
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

  return { invoices: allInvoices, stats, monthly };
}
