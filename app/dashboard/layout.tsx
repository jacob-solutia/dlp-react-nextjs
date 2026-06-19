import { AppSidebar } from "@/components/app-sidebar";
import { CreateMenu } from "@/components/create-menu";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Shared shell for every /dashboard/* route — the sidebar + header render once
// and persist while the page swaps on navigation.
//
// TODO (Auth): protect this route. Read the session here
// (auth.api.getSession) and redirect to /login if there's none, then pass the
// signed-in user to <AppSidebar user={...} /> instead of its hardcoded one.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
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
