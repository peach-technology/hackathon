import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoolHistoryQuery, type PoolHistoryType } from "@/hooks/api/pool";
import { useEffect } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type MergedPoint = {
  date: string;
  funding_apr?: number;
  effective_apr?: number;
};

interface PoolAreaChartProps {
  network?: string;
  address?: string;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  funding_apr: {
    label: "Funding",
    color: "var(--chart-1)",
  },
  effective_apr: {
    label: "Effective",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const PoolAreaChart = ({ network, address }: PoolAreaChartProps) => {
  const { data: poolHistory, isPending, status, error } = usePoolHistoryQuery(network, address);

  const mergeHistory = (history: Omit<PoolHistoryType, "network" | "poolAddress">): MergedPoint[] => {
    const byDate: Record<
      string,
      { fundingSum: number; fundingCount: number; effectiveSum: number; effectiveCount: number }
    > = {};

    const add = (arr: { timestamp: string; value: number }[], key: "funding" | "effective") => {
      arr.forEach(({ timestamp, value }) => {
        const date = dayjs(timestamp).format("YYYY-MM-DD");
        if (!byDate[date]) {
          byDate[date] = { fundingSum: 0, fundingCount: 0, effectiveSum: 0, effectiveCount: 0 };
        }
        if (key === "funding") {
          byDate[date].fundingSum += value;
          byDate[date].fundingCount += 1;
        } else {
          byDate[date].effectiveSum += value;
          byDate[date].effectiveCount += 1;
        }
      });
    };

    add(history.funding_apr, "funding");
    add(history.effective_apr, "effective");

    const points: MergedPoint[] = Object.keys(byDate)
      .sort()
      .map((date) => {
        const d = byDate[date];
        return {
          date,
          funding_apr: d.fundingCount ? d.fundingSum / d.fundingCount : undefined,
          effective_apr: d.effectiveCount ? d.effectiveSum / d.effectiveCount : undefined,
        };
      });

    if (points.length === 1) {
      const only = points[0];
      return [
        { ...only, date: dayjs(only.date).subtract(1, "day").format("YYYY-MM-DD") },
        only,
        { ...only, date: dayjs(only.date).add(1, "day").format("YYYY-MM-DD") },
      ];
    }

    return points;
  };

  useEffect(() => {
    if (status === "error") {
      toast(error?.message || error?.message);
    }
  }, [error?.message, status]);

  if (status === "error") return <p>Error</p>;

  if (isPending) return <Skeleton className="aspect-video rounded-3xl w-full" />;

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video w-full">
          <AreaChart data={mergeHistory(poolHistory)}>
            <defs>
              <linearGradient id="funding_apr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="effective_apr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => dayjs(value).format("MMM D")}
            />

            <YAxis hide domain={["dataMin-1", "dataMax +1"]} allowDataOverflow={false} />

            <Area dataKey="funding_apr" type="monotone" stackId="1" fill="url(#funding_apr)" stroke="var(--chart-1)" />
            <Area
              dataKey="effective_apr"
              type="monotone"
              stackId="1"
              fill="url(#effective_apr)"
              stroke="var(--chart-3)"
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(value) => dayjs(value).format("YYYY-MM-DD")}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PoolAreaChart;
