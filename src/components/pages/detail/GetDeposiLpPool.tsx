import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetListNetworks } from "@/hooks/api/networks";
import type { PoolType } from "@/hooks/api/pool";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import { formatUSD } from "@/utils/format";

interface GetDeposiLpPoolProps {
  getDepositQuote: getDepositQuoteResponse;
  poolData: PoolType;
}

const GetDeposiLpPool = ({ getDepositQuote, poolData }: GetDeposiLpPoolProps) => {
  const { data: networks } = useGetListNetworks();
  const lp0Network = networks?.find((n) => n.id === getDepositQuote.token0.tokenOut.networkId);
  const lp1Network = networks?.find((n) => n.id === getDepositQuote.token1.tokenOut.networkId);

  return (
    <div className="space-y-2">
      <p className="px-2">{poolData.pool_name}</p>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="size-8 rounded-full overflow-hidden">
                <img src={poolData.token0_logo} alt="" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>{poolData.token0_name}</p>
                <p>{lp0Network?.name}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex gap-2 justify-end">
                <p className="text-muted-foreground text-xs">Amount</p>
                <p className="text-muted-foreground text-xs">
                  {formatUSD(Number(getDepositQuote?.token0.tokenOut.amount))}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <p className="text-muted-foreground text-xs">Value</p>
                <p className="text-muted-foreground text-xs">
                  ${formatUSD(Number(getDepositQuote?.token0.tokenOut.amountUsd))}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="size-8 rounded-full overflow-hidden">
                <img src={poolData.token1_logo} alt="" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>{poolData.token1_name}</p>
                <p>{lp1Network?.name}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex gap-2 justify-end">
                <p className="text-muted-foreground text-xs">Amount</p>
                <p className="text-muted-foreground text-xs">
                  {formatUSD(Number(getDepositQuote?.token1.tokenOut.amount))}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <p className="text-muted-foreground text-xs">Value</p>
                <p className="text-muted-foreground text-xs">
                  ${formatUSD(Number(getDepositQuote.token1.tokenOut.amountUsd))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetDeposiLpPool;
