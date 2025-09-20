import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import { formatUSD } from "@/utils/format";

const GetDeposiLpPool = ({ getDepositQuote }: { getDepositQuote: getDepositQuoteResponse }) => {
  return (
    <div className="space-y-2">
      <p className="px-2">LP Pool</p>
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm leading-none font-medium">TOKEN0</h4>

            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-xs">TOKEN IN</h4>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">Amount</p>
                    <p className="text-muted-foreground text-xs">
                      {formatUSD(Number(getDepositQuote?.token0.tokenIn.amount))}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">AmountUSD</p>
                    <p className="text-muted-foreground text-xs">
                      {`$${formatUSD(Number(getDepositQuote?.token0.tokenIn.amountUsd))}`}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs">TOKEN OUT</p>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">Amount</p>
                    <p className="text-muted-foreground text-xs">
                      {formatUSD(Number(getDepositQuote?.token0.tokenOut.amount))}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">AmountUSD</p>
                    <p className="text-muted-foreground text-xs">
                      {`$${formatUSD(Number(getDepositQuote?.token0.tokenOut.amountUsd))}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm leading-none font-medium">TOKEN1</h4>

            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-xs">TOKEN IN</h4>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">Amount</p>
                    <p className="text-muted-foreground text-xs">
                      {formatUSD(Number(getDepositQuote?.token1.tokenIn.amount))}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">AmountUSD</p>
                    <p className="text-muted-foreground text-xs">
                      {`$${formatUSD(Number(getDepositQuote?.token1.tokenIn.amountUsd))}`}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs">TOKEN OUT</p>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">Amount</p>
                    <p className="text-muted-foreground text-xs">
                      {formatUSD(Number(getDepositQuote?.token1.tokenOut.amount))}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground text-xs">AmountUSD</p>
                    <p className="text-muted-foreground text-xs">
                      {`$${formatUSD(Number(getDepositQuote?.token1.tokenOut.amountUsd))}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetDeposiLpPool;
