import { CustomerTable } from "@/components/customer-table";
import { getCustomers } from "@/lib/queries";

export default async function CustomersPage() {
  const rows = await getCustomers();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="px-4 lg:px-6">
        <h2 className="text-lg font-semibold leading-none">Customers</h2>
      </div>
      <CustomerTable customers={rows} fillHeight />
    </div>
  );
}
