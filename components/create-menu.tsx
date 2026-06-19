"use client";

import * as React from "react";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewInvoiceDialog } from "@/components/new-invoice-dialog";
import { NewCustomerDialog } from "@/components/new-customer-dialog";

// The header "Create" dropdown — opens the New invoice or New customer dialog.
export function CreateMenu() {
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);
  const [customerOpen, setCustomerOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <IconPlus />
            Create
            <IconChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => setInvoiceOpen(true)}>
            <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} />
            Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setCustomerOpen(true)}>
            <HugeiconsIcon icon={UserMultipleIcon} strokeWidth={2} />
            Customer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewInvoiceDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} />
      <NewCustomerDialog open={customerOpen} onOpenChange={setCustomerOpen} />
    </>
  );
}
