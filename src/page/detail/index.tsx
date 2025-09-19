import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoolDetailQuery, usePoolHistoryQuery, type PoolHistoryChart, type PoolHistoryType } from "@/hooks/api/pool";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Deposit from "@/components/pages/detail/Deposit";

interface MergedHistoryRowType {
  timestamp: string;
  funding_apr?: number;
  combined_apr?: number;
  effective_apr?: number;
}

type AprKey = "funding_apr" | "combined_apr" | "effective_apr";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  funding_apr: {
    label: "funding_apr",
    color: "var(--chart-1)",
  },
  combined_apr: {
    label: "combined_apr",
    color: "var(--chart-2)",
  },
  effective_apr: {
    label: "effective_apr",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const DetailPage = () => {
  const { network, address } = useParams();

  const {
    data: poolData,
    isPending: poolDataPending,
    status: poolDataStatus,
    error: poolDataError,
  } = usePoolDetailQuery(network, address);

  const {
    data: poolHistory,
    isPending: poolHistoryPending,
    status: poolHistoryStatus,
    error: poolHistoryError,
  } = usePoolHistoryQuery(network, address);

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

  const isPending = poolDataPending || poolHistoryPending;

  useEffect(() => {
    if (poolDataStatus === "error" || poolHistoryStatus === "error") {
      toast(poolDataError?.message || poolHistoryError?.message);
    }
  }, [poolDataStatus, poolHistoryStatus, poolDataError, poolHistoryError]);

  if (poolDataStatus === "error" || poolHistoryStatus === "error") return null; // 에러 화면

  return (
    <div className="md:flex gap-8 relative items-start">
      <div className="flex-1 space-y-16 min-w-0">
        <div className="space-y-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{isPending ? <Skeleton className="w-30 h-5" /> : poolData?.pool_name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <Skeleton className=" rounded-full size-10" /> <Skeleton className="w-60 h-5" />
              </>
            )}
            {!isPending && (
              <>
                <div className="flex -space-x-4">
                  <>
                    {poolData?.token0_logo && (
                      <Avatar>
                        <AvatarImage src={poolData?.token0_logo} />
                      </Avatar>
                    )}
                    {poolData?.token1_logo && (
                      <Avatar>
                        <AvatarImage src={poolData?.token1_logo} />
                      </Avatar>
                    )}
                  </>
                </div>
                {poolData?.pool_name}
              </>
            )}
          </div>

          <Card>
            <CardContent>
              {isPending && <Skeleton className="aspect-video rounded-3xl w-full" />}
              {!isPending && (
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
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area dataKey="funding_apr" type="natural" fill="url(#funding_apr)" stroke="var(--chart-1)" />
                    <Area dataKey="combined_apr" type="natural" fill="url(#combined_apr)" stroke="var(--chart-2)" />
                    <Area dataKey="effective_apr" type="natural" fill="url(#effective_apr)" stroke="var(--chart-3)" />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="grid gap-5">
          <Tabs defaultValue="position">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="position"
                className="scroll-m-20 text-2xl font-semibold tracking-tight border-0 data-[state=active]:bg-transparent! cursor-pointer"
              >
                Position
              </TabsTrigger>
              <Separator orientation="vertical" />
              <TabsTrigger
                value="transaction"
                className="scroll-m-20 text-2xl font-semibold tracking-tight border-0 data-[state=active]:bg-transparent! cursor-pointer"
              >
                Transaction
              </TabsTrigger>
            </TabsList>
            <TabsContent value="position">
              <Separator orientation="vertical" />
              <Separator orientation="vertical" />
            </TabsContent>
            <TabsContent value="transaction">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex-none max-w-sm sticky top-18">
        {isPending && (
          <div className="w-full md:w-[300px] lg:w-[400px]">
            <Skeleton className="w-full h-[30px]" />
            <Skeleton className="w-full h-[220px] mt-5" />
          </div>
        )}
        {!isPending && <Deposit poolData={poolData} />}
      </div>
    </div>
  );
};

export default DetailPage;
