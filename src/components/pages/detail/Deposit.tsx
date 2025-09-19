import Login from "@/components/common/Login";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PoolType } from "@/hooks/api/pool";
import { useDepositMutation, useExecuteMutation, useGetDepositQuoteMutation } from "@/hooks/api/position";
import { formatUSD } from "@/utils/format";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { Ban as BanIcon, Check as CheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import { motion } from "motion/react";
import type { DepositAndExecuteResponse } from "@/types/depositAndExecute";
import type { getDepositQuoteResponse } from "@/types/getDeposit";

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

  const { mutateAsync: depositMutate } = useDepositMutation();

  const [getDepositQuote, setGetDepositQuote] = useState<getDepositQuoteResponse>();

  const [depositData, setDepositData] = useState<DepositAndExecuteResponse>();

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
      const result = await depositMutate({
        sender: wallets[0].accounts[0].address,
        tokenInNetworkId: 130,
        poolNetworkId: poolData.network,
        poolAddress: poolData.pool_address,
        tokenInAddress: "0x078d782b760474a361dda0af3839290b0ef57ad6",
        tokenInAmount: data.amount,
        marginBufferMin: 0.2,
        marginBufferMax: 0.4,
        targetTickRange: 1000,
      });

      setDepositData(result);
    } catch (e) {
      console.error("Quote fetch error:", e);
      setDepositData(undefined);
    }
  });

  useDebounce(
    async () => {
      if (amount && user) {
        try {
          const result = await GetDepositQuoteMutate({
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
    <>
      <Tabs defaultValue="buy" className="w-full md:w-[300px] lg:w-[400px]">
        <TabsList className="bg-transparent">
          <TabsTrigger value="buy" className="cursor-pointer">
            Deposit
          </TabsTrigger>
        </TabsList>

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
              <Button variant="outline" onClick={() => setPresetAmount(10)}>
                $10
              </Button>
              <Button variant="outline" onClick={() => setPresetAmount(100)}>
                $100
              </Button>
              <Button variant="outline" onClick={() => setPresetAmount(300)}>
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
            <Button type="button" onClick={onDepositSumbmit} className="w-full h-12 text-white cursor-pointer">
              Execute
            </Button>
          )}

          {!user && <Login />}
        </TabsContent>
      </Tabs>
      {depositData && <ExecuteStep depositData={depositData} />}
    </>
  );
};

export default Deposit;

const ExecuteStep = ({ depositData }: { depositData: DepositAndExecuteResponse }) => {
  const { mutateAsync: ExecuteMutate } = useExecuteMutation();

  const [currentStep, setCurrentStep] = useState(-1); // -1: 시작 전, 0~n: 각 단계, totalSteps.length: 완료
  const [isLoading, setIsLoading] = useState(false);
  const [stepResults, setStepResults] = useState<DepositAndExecuteResponse[]>([]);
  const [error, setError] = useState(null);

  const totalSteps = depositData.totalSteps;

  const startPurchaseProcess = async () => {
    setIsLoading(true);
    setCurrentStep(-1);
    setStepResults([]);
    setError(null);

    let index = 0;

    try {
      while (index < totalSteps.length) {
        console.log(`현재 index: ${index}, Step ${index + 1}: ${totalSteps[index].type} 실행 중...`);
        setCurrentStep(index);

        const result = await ExecuteMutate(stepResults[index]);

        const stepResult = {
          stepIndex: index + 1,
          stepType: totalSteps[index].type,
          ...result,
        };

        console.log(`저장할 stepResult:`, stepResult);

        setStepResults((prev) => [...prev, stepResult]);

        console.log(`Step ${index + 1} 완료:`, result);

        index++;
      }

      setCurrentStep(totalSteps.length); // 모든 단계 완료
      console.log("모든 단계 완료!");
    } catch (error) {
      console.error("fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStatus = (index: number) => {
    if (stepResults.length > index) return "completed";
    if (currentStep === index && isLoading) return "active";
    if (error && currentStep === index) return "error";
    return "pending";
  };

  return (
    <div className="p-4 w-full md:w-[300px] lg:w-[400px] space-y-5">
      <Button type="button" onClick={startPurchaseProcess}>
        테스트 버튼
      </Button>

      <div className="relative">
        <div className="relative z-20 space-y-12">
          {totalSteps.map((_, index) => (
            <div className="flex justify-between items-center">
              <div className="size-8 rounded-full flex items-center justify-center relative">
                <motion.div
                  className="-z-10 absolute top-0 left-0 w-full h-full border rounded-full"
                  animate={{
                    scale: getStepStatus(index) === "active" ? [1, 1.1, 1] : 1,
                    backgroundColor:
                      getStepStatus(index) === "completed"
                        ? "#10b981"
                        : getStepStatus(index) === "error"
                        ? "#ef4444"
                        : getStepStatus(index) === "active"
                        ? "#3b82f6"
                        : "#000000",
                  }}
                  transition={{
                    scale: {
                      duration: 1.5,
                      repeat: getStepStatus(index) === "active" ? Infinity : 0,
                      ease: "easeInOut",
                    },
                    backgroundColor: {
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                />
                {getStepStatus(index) === "completed" ? (
                  <CheckIcon size={16} />
                ) : getStepStatus(index) === "error" ? (
                  <BanIcon size={16} />
                ) : (
                  index + 1
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {index === 0 && "Deposit Margin"}
                {index === 1 && "Swap"}
                {index === 2 && "Deposit Pool"}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/50 w-[2px] h-full left-[15px] absolute top-0 z-10">
          <motion.div
            className="bg-white"
            animate={{
              height: `${Math.min(100, (stepResults.length / (totalSteps.length - 1)) * 100)}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      <Card>
        <CardContent>
          <p>구매 정보</p>
          토큰 수량: 100 USDC
          <br />
          USD 가치: $100
        </CardContent>
      </Card>
    </div>
  );
};
