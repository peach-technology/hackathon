import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoolDetailQuery } from "@/hooks/api/pool";
import { useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PoolAreaChart from "@/components/pages/detail/AreaChart";
import Deposit from "@/components/pages/detail/Deposit";
import RollingCount from "@/components/common/Rolling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTurnkey } from "@turnkey/react-wallet-kit";

const DetailPage = () => {
  const { network, address } = useParams();
  const { user } = useTurnkey();
  const { data, isPending, status, error } = usePoolDetailQuery(network, address);

  useEffect(() => {
    if (status === "error") toast.error(error?.message);
  }, [error?.message, status]);

  if (status === "error") return <p>Error</p>;

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
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
                    {data?.token0_logo && (
                      <Avatar>
                        <AvatarImage src={data?.token0_logo} />
                      </Avatar>
                    )}
                    {data?.token1_logo && (
                      <Avatar>
                        <AvatarImage src={data?.token1_logo} />
                      </Avatar>
                    )}
                  </>
                </div>
                {data?.pool_name}
              </>
            )}
          </div>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="md:flex gap-15 relative items-start mt-20 md:mt-30">
        <div className="flex-1 space-y-16 min-w-0">
          <div className="grid grid-cols-2 md:flex md:flex-row justify-between gap-5 lg:gap-10 flex-wrap">
            <div className="bg-zinc-900 text-zinc-50 border-zinc-800 shadow-none space-y-2">
              <div className="text-xs font-medium text-zinc-400">TVL</div>
              {isPending ? (
                <Skeleton className="h-[60px] w-[160px]" />
              ) : (
                <RollingCount amount={data?.reserve_in_usd ?? 0} />
              )}
            </div>

            <div className="bg-zinc-900 text-zinc-50 border-zinc-800 shadow-none space-y-2">
              <div className="text-xs font-medium text-zinc-400">Volume 1H</div>
              {isPending ? <Skeleton className="h-[60px] w-[160px]" /> : <RollingCount amount={data?.volume_1h ?? 0} />}
            </div>

            <div className="bg-zinc-900 text-zinc-50 border-zinc-800 shadow-none space-y-2">
              <div className="text-xs font-medium text-zinc-400">Fee</div>
              {isPending ? (
                <Skeleton className="h-[60px] w-[160px]" />
              ) : (
                <RollingCount symbol="percent" amount={data?.fee ?? 0} />
              )}
            </div>

            <div />
          </div>

          <div className="space-y-20">
            <PoolAreaChart network={network} address={address} />

            {user && (
              <>
                <Separator />

                <div className="grid gap-5">
                  <Tabs defaultValue="position" className="space-y-5">
                    <TabsList className="bg-transparent space-x-6">
                      <TabsTrigger
                        value="position"
                        className="scroll-m-20 text-2xl font-semibold tracking-tight border-0 data-[state=active]:bg-transparent! cursor-pointer p-0"
                      >
                        Position
                      </TabsTrigger>
                      <Separator orientation="vertical" />
                      <TabsTrigger
                        value="transaction"
                        className="scroll-m-20 text-2xl font-semibold tracking-tight border-0 data-[state=active]:bg-transparent! cursor-pointer p-0"
                      >
                        Transaction
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="position" className="space-y-10">
                      <Card className="bg-blue-500/15">
                        <CardHeader>
                          <CardTitle className="flex gap-5 items-center">
                            <div className="rounded-lg border size-10"></div>
                            <p>
                              {data?.token0_symbol} / ${data?.token1_name}
                            </p>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Share</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Share</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Share</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Share</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Share</p>
                            <p className="text-right">qqqq</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-500/15">
                        <CardHeader>
                          <CardTitle className="flex gap-5 items-center">
                            <div className="rounded-lg border size-10"></div>
                            <p>Hyperliquid</p>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Share</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Size</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Entry</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Current</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">PnL</p>
                            <p className="text-right">qqqq</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-muted-foreground">Leverage</p>
                            <p className="text-right">qqqq</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="transaction"></TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-none sticky top-20">
          {isPending && (
            <div className="w-full md:w-[300px] lg:w-[400px]">
              <Skeleton className="w-full h-[30px]" />
              <Skeleton className="w-full h-[220px] mt-5" />
            </div>
          )}
          {!isPending && <Deposit poolData={data} />}
        </div>
      </div>
    </>
  );
};

export default DetailPage;
