"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Friendly labels for known route segments; anything else is title-cased.
const SEGMENT_LABELS: Record<string, string> = {
  invoices: "Invoices",
  customers: "Customers",
};

function labelFor(segment: string) {
  return (
    SEGMENT_LABELS[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

// Breadcrumb that reflects the current /dashboard/* route instead of a static title.
export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Segments after the leading "dashboard" (e.g. ["invoices"]).
  const segments = pathname.split("/").filter(Boolean).slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {segments.length === 0 ? (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/dashboard/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{labelFor(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{labelFor(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
