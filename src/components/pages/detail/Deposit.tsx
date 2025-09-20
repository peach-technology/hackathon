import Login from "@/components/common/Login";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PoolType } from "@/hooks/api/pool";
import { useDepositMutation, useGetDepositQuoteMutation } from "@/hooks/api/position";
import { formatUSD } from "@/utils/format";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import ExecuteStep from "./ExecuteStep";
import type { DepositResponse } from "@/types/deposit";
import { Loader2Icon } from "lucide-react";

interface DepositProps {
  poolData: PoolType;
}

const Deposit = ({ poolData }: DepositProps) => {
  const { wallets, user } = useTurnkey();

  const {
    mutateAsync: GetDepositQuoteMutate,
    isPending: GetDepositQuotePending,
    isError: GetDepositQuoteIsError,
    error: GetDepositQuoteError,
  } = useGetDepositQuoteMutation();

  const { mutateAsync: depositMutate, isPending: depositPending } = useDepositMutation();

  const [getDepositQuote, setGetDepositQuote] = useState<getDepositQuoteResponse>();
  const [depositData, setDepositData] = useState<DepositResponse>();
  const [isExecuting, setIsExecuting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      amount: "",
    },
  });
  const amount = watch("amount");

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount.toString());
  };

  const onDepositSumbmit = handleSubmit(async (data) => {
    try {
      setIsExecuting(true);

      const result = await depositMutate({
        sender: wallets[0].accounts[0].address,
        tokenInNetworkId: 130, // TODO 요청 성공하면 토큰 선택추가
        poolNetworkId: poolData.network,
        poolAddress: poolData.pool_address,
        tokenInAddress: "0x078d782b760474a361dda0af3839290b0ef57ad6", // TODO 요청 성공하면 토큰 선택추가
        tokenInAmount: data.amount,
        marginBufferMin: 0.2,
        marginBufferMax: 0.4,
        targetTickRange: 1000,
      });

      setDepositData(result);
    } catch (e) {
      console.error("Quote fetch error:", e);
      setDepositData(undefined);
      setIsExecuting(false);
    }
  });

  const onExecuteComplete = () => {
    setIsExecuting(false);
    setDepositData(undefined);
    // 필요하다면 폼 리셋
    setValue("amount", "");
    setGetDepositQuote(undefined);
  };

  useDebounce(
    async () => {
      if (amount && user) {
        try {
          const result = await GetDepositQuoteMutate({
            sender: wallets[0].accounts[0].address,
            tokenInNetworkId: 130, // TODO 요청 성공하면 토큰 선택추가
            poolNetworkId: poolData.network,
            poolAddress: poolData.pool_address,
            tokenInAddress: "0x078d782b760474a361dda0af3839290b0ef57ad6", // TODO 요청 성공하면 토큰 선택추가
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
    <>
      {!isExecuting && (
        <Tabs defaultValue="buy" className="w-full md:w-[300px] lg:w-[400px]">
          <TabsList className="bg-transparent">
            <TabsTrigger value="buy" className="cursor-pointer">
              Deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-5">
            <div className="text-4xl border rounded-xl py-12 px-4 flex flex-col items-center">
              <div className="flex w-full justify-center items-center gap-1 min-w-0">
                <p className="flex-none">$</p>
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
                <Button variant="outline" size="sm" onClick={() => setPresetAmount(10)}>
                  $10
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPresetAmount(100)}>
                  $100
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPresetAmount(300)}>
                  $300
                </Button>
              </div>
            </div>

            {GetDepositQuotePending && (
              <>
                <Skeleton className="w-full h-[120px]" />
                <Skeleton className="w-full h-[260px]" />
              </>
            )}

            {!GetDepositQuotePending && getDepositQuote && (
              <>
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

                <div className="space-y-2">
                  <p className="px-2">PULL</p>
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
              </>
            )}

            {GetDepositQuoteIsError && <p>{GetDepositQuoteError.message}</p>}

            {!GetDepositQuoteIsError && !GetDepositQuotePending && user && (
              <Button
                type="button"
                onClick={onDepositSumbmit}
                className="w-full h-12 text-white cursor-pointer"
                disabled={depositPending}
              >
                {depositPending ? (
                  <>
                    <Loader2Icon className="animate-spin" /> Please wait
                  </>
                ) : (
                  "Execute"
                )}
              </Button>
            )}

            {/* 버튼 크기 변경 */}
            {!user && <Login />}
          </TabsContent>
        </Tabs>
      )}

      {isExecuting && depositData && <ExecuteStep depositData={depositData} onComplete={onExecuteComplete} />}
    </>
  );
};

export default Deposit;
