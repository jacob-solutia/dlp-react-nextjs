// TODO (Step 3 — Data fetching): Make this an async Server Component, load
// invoices with `getInvoices()` from "@/lib/queries", and render the provided
// <InvoiceTable />.
// Docs: https://nextjs.org/docs/app/getting-started/fetching-data
//
// TODO (Step 6 — Search): read `searchParams` ({ q, status }) and pass them to
// `getInvoices({ q, status })`; render the <InvoiceFilters /> you build.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
export default function InvoicesPage() {
  return <div className="px-4 py-6 lg:px-6">Invoices</div>;
}
