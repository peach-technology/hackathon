import { Button } from "@/components/ui/button";
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
import {
  usePoolDetailQuery,
  usePoolHistoryQuery,
  type PoolHistoryChart,
  type PoolHistoryType,
} from "@/hooks/api/pool";
import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";

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
    // data: poolData,
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

  useEffect(() => {
    if (poolDataStatus === "error" || poolHistoryStatus === "error") {
      toast(poolDataError?.message || poolHistoryError?.message);
    }
  }, [poolDataStatus, poolHistoryStatus, poolDataError, poolHistoryError]);

  const [val, setVal] = useState("0");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");

    if (digits === "") digits = "0";

    setVal(digits);
  };

  const mergeHistory = (
    poolHistory: Omit<PoolHistoryType, "network" | "poolAddress">
  ): MergedHistoryRowType[] => {
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

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const isPending = poolDataPending || poolHistoryPending;

  if (poolDataStatus === "error" || poolHistoryStatus === "error") return null; // 에러 화면

  return (
    <div className="flex gap-8 relative items-start">
      <div className="flex-2 space-y-16">
        <Card>
          <CardContent>
            {isPending && <Skeleton className="h-[400px] rounded-3xl w-full" />}
            {!isPending && (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <AreaChart data={mergeHistory(poolHistory)}>
                  <defs>
                    <linearGradient
                      id="funding_apr"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="combined_apr"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="effective_apr"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) =>
                      dayjs(value).format("MMM D, HH:mm")
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    dataKey="funding_apr"
                    type="natural"
                    fill="url(#funding_apr)"
                    stroke="var(--chart-1)"
                  />
                  <Area
                    dataKey="combined_apr"
                    type="natural"
                    fill="url(#combined_apr)"
                    stroke="var(--chart-2)"
                  />
                  <Area
                    dataKey="effective_apr"
                    type="natural"
                    fill="url(#effective_apr)"
                    stroke="var(--chart-3)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

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
            <TabsContent value="transaction">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 max-w-sm sticky top-18">
        {isPending && (
          <>
            <Skeleton className="w-[100px] h-[30px]" />
            <Skeleton className="w-full h-[220px] mt-5" />
          </>
        )}
        {!isPending && (
          <Tabs defaultValue="buy" className="w-[400px]">
            <TabsList className="bg-transparent">
              <TabsTrigger value="buy" className="cursor-pointer">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="cursor-pointer">
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-5">
              <div className="text-4xl border rounded-xl py-12 px-4 flex flex-col items-center">
                <div className="flex w-full justify-center items-center gap-1 min-w-0">
                  <p className="flex-none">US$</p>
                  <input
                    value={val}
                    onChange={onChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="outline-0 bg-transparent w-6"
                    style={{ width: `${Math.max(1, val.length) * 24}px` }}
                  />
                </div>
                <div className="flex gap-2 items-center mt-8">
                  <Button variant="outline" onClick={() => setVal("100")}>
                    $100
                  </Button>
                  <Button variant="outline" onClick={() => setVal("300")}>
                    $300
                  </Button>
                  <Button variant="outline" onClick={() => setVal("1000")}>
                    $1000
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sell" className="space-y-5">
              <div className="text-4xl border rounded-xl py-12 px-4 flex flex-col items-center">
                <div className="flex w-full justify-center items-center gap-1 min-w-0">
                  <p className="flex-none">US$</p>
                  <input
                    value={val}
                    onChange={onChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="outline-0 bg-transparent w-6"
                    style={{ width: `${Math.max(1, val.length) * 24}px` }}
                  />
                </div>
                <div className="flex gap-2 items-center mt-8">
                  <Button variant="outline" onClick={() => setVal("100")}>
                    25%
                  </Button>
                  <Button variant="outline" onClick={() => setVal("300")}>
                    50%
                  </Button>
                  <Button variant="outline" onClick={() => setVal("1000")}>
                    75%
                  </Button>
                  <Button variant="outline" onClick={() => setVal("1000")}>
                    100%
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
