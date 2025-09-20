import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import { formatUSD } from "@/utils/format";

const GetDepositHL = ({ getDepositQuote }: { getDepositQuote: getDepositQuoteResponse }) => {
  return (
    <div className="space-y-2">
      <p className="px-2">HL</p>
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs">TOKEN IN</h4>
            <div className="flex justify-between">
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="text-muted-foreground text-xs">
                {formatUSD(Number(getDepositQuote?.margin.tokenIn.amount))}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground text-xs">AmountUSD</p>
              <p className="text-muted-foreground text-xs">
                {`$${formatUSD(Number(getDepositQuote?.margin.tokenIn.amountUsd))}`}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs">TOKEN OUT</h4>
            <div className="flex justify-between">
              <p className="text-muted-foreground text-xs">Amount</p>
              <p className="text-muted-foreground text-xs">
                {formatUSD(Number(getDepositQuote?.margin.tokenOut.amount))}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground text-xs">AmountUSD</p>
              <p className="text-muted-foreground text-xs">
                {`$${formatUSD(Number(getDepositQuote?.margin.tokenOut.amountUsd))}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetDepositHL;
