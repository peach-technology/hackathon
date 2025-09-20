import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoolHistoryQuery, type PoolHistoryChart, type PoolHistoryType } from "@/hooks/api/pool";
import { useEffect } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type AprKey = "funding_apr" | "combined_apr" | "effective_apr";

interface MergedHistoryRowType {
  timestamp: string;
  funding_apr?: number;
  combined_apr?: number;
  effective_apr?: number;
}

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
  combined_apr: {
    label: "Combined",
    color: "var(--chart-2)",
  },
  effective_apr: {
    label: "Effective",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const PoolAreaChart = ({ network, address }: PoolAreaChartProps) => {
  const { data: poolHistory, isPending, status, error } = usePoolHistoryQuery(network, address);

  // 히스토리 묶음
  const mergeHistory = (poolHistory: Omit<PoolHistoryType, "network" | "poolAddress">): MergedHistoryRowType[] => {
    const map = new Map<string, MergedHistoryRowType>();

    const add = (arr: PoolHistoryChart[], key: AprKey) => {
      arr.forEach(({ timestamp, value }) => {
        if (!map.has(timestamp)) {
          map.set(timestamp, { timestamp });
        }
        const row = map.get(timestamp)!;
        row[key] = value;
      });
    };

    add(poolHistory.funding_apr, "funding_apr");
    add(poolHistory.combined_apr, "combined_apr");
    add(poolHistory.effective_apr, "effective_apr");

    return Array.from(map.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
              <linearGradient id="combined_apr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="effective_apr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => dayjs(value).format("MMM D, HH:mm")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              domain={["dataMin", "dataMax"]}
              allowDataOverflow={false}
            />
            <Area dataKey="funding_apr" type="monotone" fill="url(#funding_apr)" stroke="var(--chart-1)" />
            <Area dataKey="combined_apr" type="monotone" fill="url(#combined_apr)" stroke="var(--chart-2)" />
            <Area dataKey="effective_apr" type="monotone" fill="url(#effective_apr)" stroke="var(--chart-3)" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(value) => dayjs(value).format("YYYY/MM/DD HH:mm")}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PoolAreaChart;
