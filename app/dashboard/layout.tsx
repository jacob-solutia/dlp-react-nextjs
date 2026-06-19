import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { CreateMenu } from "@/components/create-menu";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Shared shell for every /dashboard/* route. The sidebar + header render once
// and stay put while the page content swaps on navigation.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The real auth gate. The proxy does a fast cookie check, but this validates
  // the session against the database and gives us the signed-in user.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = {
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.image ?? "",
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="h-svh overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="px-4">
            <CreateMenu />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4 md:py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
