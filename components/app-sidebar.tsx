import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building01Icon,
  DashboardSquare01Icon,
  Invoice01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: DashboardSquare01Icon },
  { title: "Invoices", url: "/dashboard/invoices", icon: Invoice01Icon },
  { title: "Customers", url: "/dashboard/customers", icon: UserMultipleIcon },
]

type SidebarUser = { name: string; email: string; avatar: string }

// Default shown until the Auth step passes the real signed-in user down from
// the dashboard layout.
const demoUser: SidebarUser = {
  name: "Demo User",
  email: "demo@solutia.test",
  avatar: "",
}

export function AppSidebar({
  user = demoUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: SidebarUser }) {
  // TODO (Navigation): These use plain <a> tags, so every click does a
  // full page reload. Swap them for <Link> from next/link, add "use client", and
  // highlight the active item with the usePathname() hook (SidebarMenuButton
  // takes an `isActive` prop).
  // Docs: https://nextjs.org/docs/app/api-reference/components/link
  //       https://nextjs.org/docs/app/api-reference/functions/use-pathname
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={Building01Icon} strokeWidth={2} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Solutia</span>
                  <span className="truncate text-xs">Invoices App</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
