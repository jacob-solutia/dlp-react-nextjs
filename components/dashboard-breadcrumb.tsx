import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// TODO (Navigation, bonus): make this reactive to the current route
// (e.g. "Dashboard / Invoices") with the usePathname() hook instead of always
// showing "Dashboard".
// Docs: https://nextjs.org/docs/app/api-reference/functions/use-pathname
export function DashboardBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
