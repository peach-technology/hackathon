import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoolHistoryQuery } from "@/hooks/api/pool";
import { useEffect } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type Point = {
  timestamp: string;
  funding_apr?: number;
  effective_apr?: number;
};

type PoolHistoryType = {
  network: number;
  poolAddress: string;
  funding_apr: { timestamp: string; value: number }[];
  effective_apr: { timestamp: string; value: number }[];
  combined_apr: { timestamp: string; value: number }[];
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
    label: "Pool",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const PoolAreaChart = ({ network, address }: PoolAreaChartProps) => {
  const { data: poolHistory, isPending, status, error } = usePoolHistoryQuery(network, address);

  const mergeHistoryBy6HoursWithAverage = (history: Omit<PoolHistoryType, "network" | "poolAddress">): Point[] => {
    const groups = new Map<
      string,
      {
        timestamp: string;
        funding_apr_values: number[];
        effective_apr_values: number[];
      }
    >();

    const add = (arr: { timestamp: string; value: number }[], key: "funding_apr" | "effective_apr") => {
      for (const { timestamp, value } of arr) {
        // 6시간 단위로 그룹화
        const date = dayjs(timestamp);
        const hour = date.hour();
        const groupedHour = Math.floor(hour / 6) * 6;
        const groupedTimestamp = date.hour(groupedHour).minute(0).second(0).millisecond(0).toISOString();

        const group = groups.get(groupedTimestamp) ?? {
          timestamp: groupedTimestamp,
          funding_apr_values: [],
          effective_apr_values: [],
        };

        if (key === "funding_apr") {
          group.funding_apr_values.push(value);
        } else {
          group.effective_apr_values.push(value);
        }

        groups.set(groupedTimestamp, group);
      }
    };

    add(history.funding_apr ?? [], "funding_apr");
    add(history.effective_apr ?? [], "effective_apr");

    // 평균값 계산하여 최종 결과 생성
    const result: Point[] = Array.from(groups.values()).map((group) => {
      const point: Point = { timestamp: group.timestamp };

      if (group.funding_apr_values.length > 0) {
        point.funding_apr =
          group.funding_apr_values.reduce((sum, val) => sum + val, 0) / group.funding_apr_values.length;
      }

      if (group.effective_apr_values.length > 0) {
        point.effective_apr =
          group.effective_apr_values.reduce((sum, val) => sum + val, 0) / group.effective_apr_values.length;
      }

      return point;
    });

    return result.sort((a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf());
  };

  useEffect(() => {
    if (status === "error") {
      toast(error?.message || error?.message);
    }
  }, [error?.message, status]);

  if (status === "error") return <p>Error</p>;

  if (isPending) return <Skeleton className="aspect-video rounded-3xl w-full" />;

  return (
    <Card className="bg-neutral-800">
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video w-full">
          <AreaChart data={mergeHistoryBy6HoursWithAverage(poolHistory)}>
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
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => dayjs(value).format("MMM D HH")}
            />

            <YAxis
              domain={["dataMin", "dataMax +5"]}
              allowDataOverflow={false}
              tickFormatter={(value) => value.toFixed(2)}
              width={45}
            />

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
