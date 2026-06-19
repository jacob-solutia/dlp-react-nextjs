// TODO (Step 2 — Routing & layouts): Build the dashboard shell here. Wrap
// {children} with the sidebar + a header so it persists across dashboard pages.
// Use <AppSidebar /> from "@/components/app-sidebar" and the sidebar primitives.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/layout
//
// TODO (Step 12 — Auth): once auth is wired, protect this layout — read the
// session on the server and redirect to /login if there isn't one.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
