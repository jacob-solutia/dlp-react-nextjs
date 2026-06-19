"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Table as ReactTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZES = [10, 20, 30, 50, 100];

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  /** Column id wired to the free-text search box. Omit to hide the box. */
  searchColumn?: string;
  searchPlaceholder?: string;
  /** Extra toolbar controls (e.g. a status filter), rendered before "Columns". */
  toolbar?: (table: ReactTable<TData>) => React.ReactNode;
  /** Friendly labels for the column-visibility menu, keyed by column id. */
  columnLabels?: Record<string, string>;
  emptyMessage?: string;
  /** Grow to fill the available height and pin pagination to the bottom. */
  fillHeight?: boolean;
  /** Initial rows per page (user can change it via the selector). */
  defaultPageSize?: number;
}

// Generic, sortable, filterable, paginated table. One shell shared by the
// dashboard, invoices, and customers views so every table looks and behaves the
// same — the only difference is the column definitions each caller passes in.
export function DataTable<TData>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Search…",
  toolbar,
  columnLabels = {},
  emptyMessage = "No results.",
  fillHeight = false,
  defaultPageSize = 20,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-4 lg:px-6",
        fillHeight && "min-h-0 flex-1"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {searchColumn ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn(searchColumn)?.setFilterValue(e.target.value)
            }
            className="h-9 max-w-xs"
          />
        ) : null}
        {toolbar?.(table)}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* When filling height, this wrapper is a flex region with a definite
          height; the bordered box inside sizes to its rows but scrolls (and
          keeps its sticky header) once they overflow, so the pagination bar
          below stays pinned to the bottom. */}
      <div className={cn(fillHeight && "flex min-h-0 flex-1 flex-col")}>
        <div
          className={cn(
            "rounded-lg border",
            fillHeight ? "min-h-0 overflow-auto" : "overflow-hidden"
          )}
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={
                      header.column.columnDef.size
                        ? { width: header.column.columnDef.size }
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={
                        cell.column.columnDef.size
                          ? { width: cell.column.columnDef.size }
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium sm:inline">
            Rows per page
          </span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

// A sortable column header — a ghost button with a chevron, matching the
// dashboard look. Used by the per-entity column definitions.
export function SortableHeader<TData>({
  column,
  children,
  align = "left",
}: {
  column: import("@tanstack/react-table").Column<TData>;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const button = (
    <Button
      variant="ghost"
      className={align === "right" ? "-mr-3 h-8" : "-ml-3 h-8"}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <IconChevronDown className="ml-1 size-3.5" />
    </Button>
  );
  return align === "right" ? <div className="text-right">{button}</div> : button;
}
