import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building01Icon } from "@hugeicons/core-free-icons";

import { LoginForm } from "@/components/login-form";

// Server component: reads the optional ?redirect= param and passes it to the
// client form. (The proxy already keeps signed-in users away from /login.)
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
          <HugeiconsIcon icon={Building01Icon} strokeWidth={2} />
        </div>
        <span className="font-semibold">Invoices App</span>
      </Link>

      <LoginForm redirectTo={redirect ?? "/dashboard"} />
    </div>
  );
}
