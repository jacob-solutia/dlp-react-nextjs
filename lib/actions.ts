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
