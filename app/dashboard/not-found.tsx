import Link from "next/link";

import { Button } from "@/components/ui/button";

// Rendered when a dashboard route calls notFound() — e.g. an unknown invoice.
export default function DashboardNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Not found</h2>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find what you were looking for.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
