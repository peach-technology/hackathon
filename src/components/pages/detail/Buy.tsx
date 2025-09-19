import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import type { PoolType } from "@/hooks/api/pool";
import {
  useGetDepositQuoteMutation,
  type getDepositQuoteResponse,
} from "@/hooks/api/position";
import { formatUSD } from "@/utils/format";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";

interface BuyProps {
  poolData: PoolType;
}

const Buy = ({ poolData }: BuyProps) => {
  const { wallets } = useTurnkey();
  const { mutateAsync, isPending, isError, error } =
    useGetDepositQuoteMutation();
  const { register, watch, setValue } = useForm({
    defaultValues: {
      amount: "",
    },
  });
  const [getDepositQuote, setGetDepositQuote] =
    useState<getDepositQuoteResponse>();

  const amount = watch("amount");

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount.toString());
  };

  useDebounce(
    async () => {
      if (amount) {
        try {
          const result = await mutateAsync({
            sender: wallets[0].accounts[0].address,
            tokenInNetworkId: 130,
            poolNetworkId: poolData.network,
            poolAddress: poolData.pool_address,
            tokenInAddress: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            tokenInAmount: amount,
            marginBufferMin: 0.2,
            marginBufferMax: 0.4,
            targetTickRange: 1000,
          });
          setGetDepositQuote(result);
        } catch (error) {
          console.error("Quote fetch error:", error);
          setGetDepositQuote(undefined);
        }
      } else {
        setGetDepositQuote(undefined);
      }
    },
    300,
    [amount]
  );

  return (
    <TabsContent value="buy" className="space-y-5">
      <div className="text-4xl border rounded-xl py-12 px-4 flex flex-col items-center">
        <div className="flex w-full justify-center items-center gap-1 min-w-0">
          <p className="flex-none">US$</p>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            className="outline-0 bg-transparent flex-1 min-w-0 text-center"
            placeholder="0"
            {...register("amount", {
              required: true,
              pattern: /^\d*\.?\d*$/,
            })}
          />
        </div>
        <div className="flex gap-2 items-center mt-8">
          <Button variant="outline" onClick={() => setPresetAmount(100)}>
            $100
          </Button>
          <Button variant="outline" onClick={() => setPresetAmount(300)}>
            $300
          </Button>
          <Button variant="outline" onClick={() => setPresetAmount(1000)}>
            $1000
          </Button>
        </div>
      </div>

      {isPending && (
        <>
          <Skeleton className="w-full h-[120px]" />
          <Skeleton className="w-full h-[260px]" />
        </>
      )}
      {!isPending && getDepositQuote && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>SHORT</CardTitle>
            </CardHeader>
            <CardContent>
              ${formatUSD(Number(getDepositQuote?.marginDepositAmount))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>LONG</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                token0 : <br />
                {getDepositQuote?.token0.amount} <br />$
                {formatUSD(Number(getDepositQuote?.token0.value))}
              </p>

              <Separator />

              <p>
                token1 :<br />
                {getDepositQuote?.token1.amount}
                <br />${formatUSD(Number(getDepositQuote?.token1.value))}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {isError && <p>{error.message}</p>}

      <Button type="submit" className="w-full h-12 text-white cursor-pointer">
        Submit
      </Button>
    </TabsContent>
  );
};

export default Buy;
