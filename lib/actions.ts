"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import { invoices, customers } from "./schema";

export type FormState = {
  success?: boolean;
  error?: string;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- you'll use this in createInvoice (Step 9)
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

// TODO (Step 7 — Server Actions): implement createInvoice.
//  1. Accept (prevState: FormState, formData: FormData).
//  2. Validate with createInvoiceSchema (see updateInvoice below for the pattern,
//     including how field errors are returned via z.flattenError).
//  3. Compute the next sequential invoice number, then insert the invoice
//     (amount is stored in cents) with today's date.
//  4. revalidatePath the affected routes and return { success: true }.
// Docs: https://nextjs.org/docs/app/getting-started/updating-data
//
// TODO (Step 9 — Auth): once requireSession exists, call it at the top of every
// action below so mutations can't be invoked without a session.
export async function createInvoice(): Promise<FormState> {
  return { error: "Not implemented yet — this is your Step 9 task." };
}

export async function updateInvoice(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
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
