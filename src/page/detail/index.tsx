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
import Deposit from "@/components/pages/detail/Deposit";
import PoolAreaChart from "@/components/pages/detail/AreaChart";

const DetailPage = () => {
  const { network, address } = useParams();

  const {
    data: poolData,
    isPending: poolDataPending,
    status: poolDataStatus,
    error: poolDataError,
  } = usePoolDetailQuery(network, address);

  const isPending = poolDataPending;

  useEffect(() => {
    if (poolDataStatus === "error") {
      toast(poolDataError?.message);
    }
  }, [poolDataStatus, poolDataError]);

  if (poolDataStatus === "error") return null; // 에러 화면

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

          <PoolAreaChart network={network} address={address} />
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
