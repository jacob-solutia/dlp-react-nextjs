"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, SortableHeader } from "@/components/data-table";
import { CustomerDetailDrawer } from "@/components/customer-detail-drawer";
import type { Customer } from "@/lib/schema";

// Format the join date in a fixed timezone so the server and client render the
// same string (avoids a hydration mismatch in this client component).
function formatAdded(date: Date) {
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => (
      <CustomerDetailDrawer customer={row.original}>
        <Button variant="link" className="text-foreground h-auto p-0 font-medium">
          {row.original.name}
        </Button>
      </CustomerDetailDrawer>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column}>Added</SortableHeader>,
    cell: ({ row }) => formatAdded(row.original.createdAt),
  },
];

const columnLabels = {
  createdAt: "Added",
};

export function CustomerTable({
  customers,
  fillHeight,
}: {
  customers: Customer[];
  fillHeight?: boolean;
}) {
  return (
    <DataTable
      columns={columns}
      data={customers}
      searchColumn="name"
      searchPlaceholder="Search name…"
      columnLabels={columnLabels}
      emptyMessage="No customers found."
      fillHeight={fillHeight}
    />
  );
}
