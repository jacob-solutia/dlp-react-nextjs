"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// URL-driven filters: the search text and status live in the query string
// (?q=&status=), so a filtered view is shareable and survives refresh/back. The
// invoices page reads these on the server and queries the filtered rows.
export function InvoiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const q = searchParams.get("q") ?? "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || (key === "status" && value === "all")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  // Debounce the search so we don't push a new URL on every keystroke.
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  function onSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setParam("q", value), 300);
  }

  return (
    <>
      <Input
        placeholder="Search customer…"
        defaultValue={q}
        onChange={(e) => onSearch(e.target.value)}
        className="h-9 max-w-xs"
      />
      <Select value={status} onValueChange={(v) => setParam("status", v)}>
        <SelectTrigger size="sm" className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
