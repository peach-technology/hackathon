import { Card, CardContent } from "@/components/ui/card";
import type { PoolType } from "@/hooks/api/pool";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import { formatUSD } from "@/utils/format";

interface GetDepositHLProps {
  getDepositQuote: getDepositQuoteResponse;
  poolData: PoolType;
}

const GetDepositHL = ({ getDepositQuote }: GetDepositHLProps) => {
  return (
    <div className="space-y-2">
      <p className="px-2">Hyperliquid</p>
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="size-8 rounded-full overflow-hidden">
                  <img src="/HL_symbol_mint.png" alt="" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Hyperliquid</p>
                  {/* <p>{getDepositQuote.margin.tokenOut.networkId === 1337 ? "Hyperliquid" : hlNetwork?.name}</p> */}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex gap-2 justify-end">
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="text-muted-foreground text-xs">
                    {formatUSD(Number(getDepositQuote.margin.tokenOut.amount))}
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <p className="text-muted-foreground text-xs">Value</p>
                  <p className="text-muted-foreground text-xs">
                    ${formatUSD(Number(getDepositQuote.margin.tokenOut.amountUsd))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetDepositHL;
