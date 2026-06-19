import { desc } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { invoices } from "@/lib/schema";

// Route Handler: GET /api/invoices/export → a downloadable CSV of all invoices.
// Returns a plain Web Response with CSV headers (no React involved).

function csvCell(value: string | number) {
  const s = String(value);
  // Quote any cell containing a comma, quote, or newline (and escape quotes).
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  // Route handlers aren't covered by the proxy, so guard the session here too.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = db.select().from(invoices).orderBy(desc(invoices.number)).all();

  const header = [
    "number",
    "customerName",
    "customerEmail",
    "amount",
    "status",
    "date",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.number,
        r.customerName,
        r.customerEmail,
        (r.amount / 100).toFixed(2), // cents → dollars
        r.status,
        r.date,
      ]
        .map(csvCell)
        .join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="invoices.csv"',
    },
  });
}
