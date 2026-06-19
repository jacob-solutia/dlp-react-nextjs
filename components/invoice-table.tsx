"use client";

import * as React from "react";
import { type ColumnDef, type Table as ReactTable } from "@tanstack/react-table";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, SortableHeader } from "@/components/data-table";
import { InvoiceDetailDrawer } from "@/components/invoice-detail-drawer";
import { InvoiceFilters } from "@/components/invoice-filters";
import type { Invoice } from "@/lib/schema";
import { formatUSD, invoiceNumber } from "@/lib/format";

function StatusBadge({ status }: { status: Invoice["status"] }) {
  return (
    <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5">
      {status === "paid" ? (
        <IconCircleCheckFilled className="size-3.5 fill-green-600 dark:fill-green-500" />
      ) : (
        <IconLoader className="size-3.5" />
      )}
      <span className="capitalize">{status}</span>
    </Badge>
  );
}

const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "number",
    header: ({ column }) => <SortableHeader column={column}>Invoice</SortableHeader>,
    cell: ({ row }) => (
      <InvoiceDetailDrawer invoice={row.original}>
        <Button
          variant="link"
          className="text-foreground h-auto p-0 font-mono text-xs font-medium"
        >
          {invoiceNumber(row.original.number)}
        </Button>
      </InvoiceDetailDrawer>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => <SortableHeader column={column}>Customer</SortableHeader>,
    cell: ({ row }) => (
      <InvoiceDetailDrawer invoice={row.original}>
        <Button variant="link" className="text-foreground h-auto p-0 font-medium">
          {row.original.customerName}
        </Button>
      </InvoiceDetailDrawer>
    ),
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.customerEmail}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortableHeader column={column} align="right">
        Amount
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatUSD(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, id, value) =>
      value === "all" ? true : row.getValue(id) === value,
  },
];

const columnLabels = {
  customerName: "Customer",
  customerEmail: "Email",
};

function StatusFilter({ table }: { table: ReactTable<Invoice> }) {
  const value = (table.getColumn("status")?.getFilterValue() as string) ?? "all";
  return (
    <Select
      value={value}
      onValueChange={(v) =>
        table.getColumn("status")?.setFilterValue(v === "all" ? "" : v)
      }
    >
      <SelectTrigger size="sm" className="w-36">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function InvoiceTable({
  invoices,
  fillHeight,
  defaultPageSize,
  serverFiltered = false,
}: {
  invoices: Invoice[];
  fillHeight?: boolean;
  defaultPageSize?: number;
  // When true, filtering is driven by the URL (InvoiceFilters) and the data is
  // already filtered on the server; otherwise the table filters client-side.
  serverFiltered?: boolean;
}) {
  return (
    <DataTable
      columns={columns}
      data={invoices}
      searchColumn={serverFiltered ? undefined : "customerName"}
      searchPlaceholder="Search customer…"
      toolbar={
        serverFiltered
          ? () => <InvoiceFilters />
          : (table) => <StatusFilter table={table} />
      }
      columnLabels={columnLabels}
      emptyMessage="No invoices found."
      fillHeight={fillHeight}
      defaultPageSize={defaultPageSize}
    />
  );
}
