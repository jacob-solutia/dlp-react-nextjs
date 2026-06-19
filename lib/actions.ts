"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import { invoices, customers } from "./schema";
import { requireSession } from "./session";

// Server Actions: run on the server, validate input with Zod, write to the DB,
// then revalidate the affected routes so every view reflects the change.
//
// Each action returns a `FormState` instead of throwing, so the calling form
// (via `useActionState`) can render inline validation errors.

export type FormState = {
  success?: boolean;
  error?: string;
  // Per-field messages, keyed by the input's `name`.
  fieldErrors?: Record<string, string[] | undefined>;
};

const invoiceFields = {
  customerName: z.string().trim().min(1, "Customer name is required."),
  customerEmail: z.string().trim().email("Enter a valid email address."),
  amount: z.coerce
    .number()
    .nonnegative("Amount must be zero or more.")
    .refine((n) => Number.isFinite(n), "Enter a valid amount."),
  status: z.enum(["pending", "paid"]),
};

const createInvoiceSchema = z.object(invoiceFields);
const updateInvoiceSchema = z.object({
  ...invoiceFields,
  id: z.string().min(1, "Missing invoice id."),
  date: z.string().min(1, "Date is required."),
});

const createCustomerSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
});
const updateCustomerSchema = createCustomerSchema.extend({
  id: z.string().min(1, "Missing customer id."),
});

export async function createInvoice(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const parsed = createInvoiceSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { customerName, customerEmail, amount, status } = parsed.data;

  // Next sequential invoice number.
  const existing = db.select({ number: invoices.number }).from(invoices).all();
  const nextNumber = existing.reduce((max, r) => Math.max(max, r.number), 0) + 1;

  db.insert(invoices)
    .values({
      number: nextNumber,
      customerName,
      customerEmail,
      amount: Math.round(amount * 100), // store cents
      status,
      date: new Date().toISOString().slice(0, 10),
    })
    .run();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  return { success: true };
}

export async function updateInvoice(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const parsed = updateInvoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { id, customerName, customerEmail, amount, status, date } = parsed.data;

  db.update(invoices)
    .set({
      customerName,
      customerEmail,
      amount: Math.round(amount * 100), // store cents
      status,
      date,
    })
    .where(eq(invoices.id, id))
    .run();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  return { success: true };
}

export async function createCustomer(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const parsed = createCustomerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  db.insert(customers).values(parsed.data).run();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customers");
  return { success: true };
}

// Minimal CSV parser: handles quoted fields, escaped quotes (""), and CRLF.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const importRowSchema = z.object(invoiceFields).extend({
  date: z.string().trim().min(1, "Date is required."),
});

export async function importInvoices(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a CSV file to import." };
  }

  const rows = parseCsv(await file.text()).filter((r) =>
    r.some((cell) => cell.trim() !== "")
  );
  if (rows.length < 2) {
    return { error: "The CSV needs a header row and at least one data row." };
  }

  const header = rows[0].map((h) => h.trim());
  const required = [
    "customerName",
    "customerEmail",
    "amount",
    "status",
    "date",
  ];
  for (const col of required) {
    if (!header.includes(col)) {
      return { error: `Missing required column: ${col}` };
    }
  }
  const at = (row: string[], col: string) => row[header.indexOf(col)];

  const valid = [];
  for (const row of rows.slice(1)) {
    const parsed = importRowSchema.safeParse({
      customerName: at(row, "customerName"),
      customerEmail: at(row, "customerEmail"),
      amount: at(row, "amount"),
      status: at(row, "status"),
      date: at(row, "date"),
    });
    // Invalid rows are skipped.
    if (parsed.success) valid.push(parsed.data);
  }

  if (!valid.length) {
    return { error: "No valid rows found to import." };
  }

  // Continue the sequential invoice numbers from the current max.
  const existing = db.select({ number: invoices.number }).from(invoices).all();
  let nextNumber = existing.reduce((max, r) => Math.max(max, r.number), 0) + 1;

  db.insert(invoices)
    .values(
      valid.map((v) => ({
        number: nextNumber++,
        customerName: v.customerName,
        customerEmail: v.customerEmail,
        amount: Math.round(v.amount * 100),
        status: v.status,
        date: v.date,
      }))
    )
    .run();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  return { success: true };
}

export async function updateCustomer(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();
  const parsed = updateCustomerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { id, name, email } = parsed.data;

  db.update(customers).set({ name, email }).where(eq(customers.id, id)).run();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customers");
  return { success: true };
}
