import { db } from "./db";
import { invoices, customers, type NewInvoice, type NewCustomer } from "./schema";
import { auth } from "../auth";

// Amounts are in cents. Spread across 12 months with a rising trend, a December
// peak, a post-holiday dip, and a growing share of *pending* in recent months —
// so the "Billed by month" chart has an interesting shape. Varied names/emails
// also give the Step 7 search exercise something to filter.
const SEED_INVOICES: Omit<NewInvoice, "number">[] = [
  // Jul 2025
  { customerName: "Sofia Davis", customerEmail: "sofia@example.com", amount: 45000, status: "paid", date: "2025-07-05" },
  { customerName: "Liam Nguyen", customerEmail: "liam@acme.io", amount: 30000, status: "paid", date: "2025-07-18" },
  { customerName: "Olivia Martin", customerEmail: "olivia@example.com", amount: 48000, status: "pending", date: "2025-07-26" },
  // Aug 2025
  { customerName: "Noah Williams", customerEmail: "noah@globex.com", amount: 62000, status: "paid", date: "2025-08-04" },
  { customerName: "Emma Brown", customerEmail: "emma@example.com", amount: 54000, status: "paid", date: "2025-08-15" },
  { customerName: "Ava Jones", customerEmail: "ava@initech.com", amount: 70000, status: "pending", date: "2025-08-27" },
  // Sep 2025
  { customerName: "William Garcia", customerEmail: "will@example.com", amount: 51000, status: "paid", date: "2025-09-06" },
  { customerName: "Mia Rodriguez", customerEmail: "mia@umbrella.co", amount: 39000, status: "paid", date: "2025-09-17" },
  { customerName: "James Wilson", customerEmail: "james@example.com", amount: 60000, status: "pending", date: "2025-09-29" },
  // Oct 2025
  { customerName: "Isabella Lee", customerEmail: "bella@hooli.com", amount: 80000, status: "paid", date: "2025-10-03" },
  { customerName: "Benjamin Walker", customerEmail: "ben@example.com", amount: 76000, status: "paid", date: "2025-10-14" },
  { customerName: "Charlotte Hall", customerEmail: "charlotte@stark.com", amount: 85000, status: "pending", date: "2025-10-25" },
  // Nov 2025
  { customerName: "Henry Young", customerEmail: "henry@wayne.io", amount: 70000, status: "paid", date: "2025-11-05" },
  { customerName: "Amelia King", customerEmail: "amelia@example.com", amount: 65000, status: "paid", date: "2025-11-16" },
  { customerName: "Lucas Wright", customerEmail: "lucas@piedpiper.com", amount: 76000, status: "pending", date: "2025-11-28" },
  // Dec 2025 (peak)
  { customerName: "Harper Scott", customerEmail: "harper@example.com", amount: 110000, status: "paid", date: "2025-12-04" },
  { customerName: "Sofia Davis", customerEmail: "sofia@example.com", amount: 98000, status: "paid", date: "2025-12-15" },
  { customerName: "Liam Nguyen", customerEmail: "liam@acme.io", amount: 115000, status: "pending", date: "2025-12-23" },
  // Jan 2026 (post-holiday dip)
  { customerName: "Olivia Martin", customerEmail: "olivia@example.com", amount: 60000, status: "paid", date: "2026-01-07" },
  { customerName: "Noah Williams", customerEmail: "noah@globex.com", amount: 56000, status: "paid", date: "2026-01-18" },
  { customerName: "Emma Brown", customerEmail: "emma@example.com", amount: 74000, status: "pending", date: "2026-01-29" },
  // Feb 2026
  { customerName: "Ava Jones", customerEmail: "ava@initech.com", amount: 82000, status: "paid", date: "2026-02-05" },
  { customerName: "William Garcia", customerEmail: "will@example.com", amount: 76000, status: "paid", date: "2026-02-14" },
  { customerName: "Mia Rodriguez", customerEmail: "mia@umbrella.co", amount: 103000, status: "pending", date: "2026-02-24" },
  // Mar 2026
  { customerName: "James Wilson", customerEmail: "james@example.com", amount: 90000, status: "paid", date: "2026-03-06" },
  { customerName: "Isabella Lee", customerEmail: "bella@hooli.com", amount: 88000, status: "paid", date: "2026-03-17" },
  { customerName: "Benjamin Walker", customerEmail: "ben@example.com", amount: 112000, status: "pending", date: "2026-03-28" },
  // Apr 2026
  { customerName: "Charlotte Hall", customerEmail: "charlotte@stark.com", amount: 100000, status: "paid", date: "2026-04-04" },
  { customerName: "Henry Young", customerEmail: "henry@wayne.io", amount: 60000, status: "paid", date: "2026-04-15" },
  { customerName: "Amelia King", customerEmail: "amelia@example.com", amount: 180000, status: "pending", date: "2026-04-26" },
  // May 2026
  { customerName: "Lucas Wright", customerEmail: "lucas@piedpiper.com", amount: 70000, status: "paid", date: "2026-05-05" },
  { customerName: "Harper Scott", customerEmail: "harper@example.com", amount: 50000, status: "paid", date: "2026-05-16" },
  { customerName: "Sofia Davis", customerEmail: "sofia@example.com", amount: 190000, status: "pending", date: "2026-05-27" },
  // Jun 2026 (recent — mostly pending)
  { customerName: "Liam Nguyen", customerEmail: "liam@acme.io", amount: 40000, status: "paid", date: "2026-06-03" },
  { customerName: "Olivia Martin", customerEmail: "olivia@example.com", amount: 170000, status: "pending", date: "2026-06-07" },
  { customerName: "Noah Williams", customerEmail: "noah@globex.com", amount: 170000, status: "pending", date: "2026-06-09" },
];

const DEMO_USER = {
  name: "Demo User",
  email: "demo@solutia.test",
  password: "password123",
};

// Unique customers derived from the invoice data.
const SEED_CUSTOMERS: NewCustomer[] = (() => {
  const seen = new Set<string>();
  const list: NewCustomer[] = [];
  for (const inv of SEED_INVOICES) {
    if (seen.has(inv.customerEmail)) continue;
    seen.add(inv.customerEmail);
    list.push({ name: inv.customerName, email: inv.customerEmail });
  }
  return list;
})();

async function main() {
  // Reset domain tables for a reproducible seed.
  db.delete(invoices).run();
  // Assign sequential invoice numbers in chronological (array) order.
  db.insert(invoices)
    .values(SEED_INVOICES.map((inv, i) => ({ ...inv, number: i + 1 })))
    .run();
  console.log(`Seeded ${SEED_INVOICES.length} invoices.`);

  db.delete(customers).run();
  db.insert(customers).values(SEED_CUSTOMERS).run();
  console.log(`Seeded ${SEED_CUSTOMERS.length} customers.`);

  // Create the demo user through better-auth so the password is hashed the same
  // way sign-in expects. Idempotent: ignore "already exists" on re-run.
  try {
    await auth.api.signUpEmail({ body: DEMO_USER });
    console.log(`Created demo user: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  } catch (err) {
    console.log(`Demo user not created (likely already exists): ${(err as Error).message}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
