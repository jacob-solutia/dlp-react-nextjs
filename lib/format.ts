// Format an amount stored in cents as USD.
export function formatUSD(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

// Human-friendly invoice reference, e.g. INV-0001.
export function invoiceNumber(n: number) {
  return `INV-${String(n).padStart(4, "0")}`;
}
