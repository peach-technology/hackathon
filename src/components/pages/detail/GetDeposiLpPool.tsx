import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PoolType } from "@/hooks/api/pool";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import { formatUSD } from "@/utils/format";

interface GetDeposiLpPoolProps {
  getDepositQuote: getDepositQuoteResponse;
  poolData: PoolType;
}

const GetDeposiLpPool = ({ getDepositQuote, poolData }: GetDeposiLpPoolProps) => {
  return (
    <div className="space-y-2">
      <p className="px-2">{poolData.dex_name}</p>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="size-8 rounded-full overflow-hidden">
                <img src={poolData.token0_logo} alt="" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>{`${getDepositQuote.margin.tokenOut.address.slice(
                  0,
                  8
                )}...${getDepositQuote.margin.tokenOut.address.slice(-8)}`}</p>
                <p>{getDepositQuote.margin.tokenOut.networkId}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="text-muted-foreground text-xs">
                {formatUSD(Number(getDepositQuote?.token0.tokenOut.amount))}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="size-8 rounded-full overflow-hidden">
                <img src={poolData.token1_logo} alt="" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>{`${getDepositQuote.margin.tokenOut.address.slice(
                  0,
                  8
                )}...${getDepositQuote.margin.tokenOut.address.slice(-8)}`}</p>
                <p>{getDepositQuote.margin.tokenOut.networkId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="text-muted-foreground text-xs">
                {formatUSD(Number(getDepositQuote?.token1.tokenOut.amount))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetDeposiLpPool;
