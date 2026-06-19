import Link from "next/link";

import { Button } from "@/components/ui/button";

// Root 404: shown for any URL that doesn't match a route.
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          That page doesn&apos;t exist (yet).
        </p>
      </div>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </main>
  );
}
