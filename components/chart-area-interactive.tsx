"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const chartConfig = {
  paid: { label: "Paid", color: "var(--chart-1)" },
  pending: { label: "Pending", color: "var(--chart-2)" },
} satisfies ChartConfig;

type Row = { month: string; paid: number; pending: number };
type View = "all" | "paid" | "pending";

export function ChartAreaInteractive({ data }: { data: Row[] }) {
  const [view, setView] = React.useState<View>("all");

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Billed by month</CardTitle>
        <CardDescription>Paid vs pending invoice totals (USD)</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as View)}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="paid">Paid</ToggleGroupItem>
            <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-paid)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-paid)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {(view === "all" || view === "pending") && (
              <Area
                dataKey="pending"
                type="natural"
                fill="url(#fillPending)"
                stroke="var(--color-pending)"
                stackId="a"
              />
            )}
            {(view === "all" || view === "paid") && (
              <Area
                dataKey="paid"
                type="natural"
                fill="url(#fillPaid)"
                stroke="var(--color-paid)"
                stackId="a"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
