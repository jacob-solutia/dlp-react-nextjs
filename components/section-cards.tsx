import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { formatUSD } from "@/lib/format";

export type DashboardStats = {
  totalBilled: number;
  paidTotal: number;
  pendingTotal: number;
  paidCount: number;
  pendingCount: number;
  invoiceCount: number;
  customerCount: number;
};

export function SectionCards({ stats }: { stats: DashboardStats }) {
  const paidRate = stats.invoiceCount
    ? Math.round((stats.paidCount / stats.invoiceCount) * 100)
    : 0;
  const pendingRate = 100 - paidRate;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total billed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatUSD(stats.totalBilled)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Across {stats.invoiceCount} invoices
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Paid</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatUSD(stats.paidTotal)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {paidRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.paidCount} paid invoices <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {paidRate}% of invoices collected
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Outstanding</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatUSD(stats.pendingTotal)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              {pendingRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.pendingCount} awaiting payment{" "}
            <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {pendingRate}% of invoices unpaid
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.customerCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Total customers on file</div>
        </CardFooter>
      </Card>
    </div>
  );
}
