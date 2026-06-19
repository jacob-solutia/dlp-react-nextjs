"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CustomerForm } from "@/components/customer-form";
import type { Customer } from "@/lib/schema";

// Slide-out sheet that shows a customer and lets you edit it. `children` is the
// trigger (e.g. the customer name in the table).
export function CustomerDetailDrawer({
  customer,
  children,
}: {
  customer: Customer;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{customer.name}</DrawerTitle>
          <DrawerDescription>
            Edit this customer and save your changes.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm">
          <CustomerForm
            customer={customer}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
