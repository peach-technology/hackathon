import Login from "@/components/common/Login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PoolType } from "@/hooks/api/pool";
import { useGetDepositQuoteMutation, type getDepositQuoteResponse } from "@/hooks/api/position";
import { formatUSD } from "@/utils/format";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import { toast } from "sonner";

interface DepositProps {
  poolData: PoolType;
}

const Deposit = ({ poolData }: DepositProps) => {
  const { wallets, user } = useTurnkey();
  const { mutateAsync, isPending, isError, error } = useGetDepositQuoteMutation();

  const { register, watch, setValue } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const [getDepositQuote, setGetDepositQuote] = useState<getDepositQuoteResponse>();

  const amount = watch("amount");

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount.toString());
  };

  useDebounce(
    async () => {
      if (amount && user) {
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

          {isPending && (
            <>
              <Skeleton className="w-full h-[120px]" />
              <Skeleton className="w-full h-[260px]" />
            </>
          )}

          {!isPending && getDepositQuote && (
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

          {isError && <p>{error.message}</p>}

          {!isError && !isPending && user && (
            <Button type="submit" className="w-full h-12 text-white cursor-pointer">
              Execute
            </Button>
          )}

          {!user && <Login />}
        </TabsContent>
      </Tabs>
      <ExecuteStep />
    </>
  );
};

export default Deposit;

const ExecuteStep = () => {
  // 요청 성공 목업
  const mockPurchaseResponse = {
    type: "deposit",
    position: {
      id: 11,
      wallet: 5,
      pool: 1,
      updated_at: "2025-09-19T10:53:33.322414+00:00",
      created_at: "2025-09-19T10:53:33.322414+00:00",
      margin_buffer_max: 0.4,
      margin_buffer_min: 0.2,
      subaccount: "0x206064c83fc8f0fcc00e705e49f7a2d32890f040",
      tick_range_target: 1000,
      pool_price_lower: null,
      pool_price_upper: null,
      active: false,
    },
    totalTokenIn: {
      networkId: 130,
      address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
      amount: "100",
      amountUsd: "100000000",
      amountRaw: "100000000",
    },
    totalSteps: [
      {
        type: "depositMargin",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
            amount: "13.793103",
          },
        ],
        tokenOut: [
          {
            networkId: 1337,
            address: "0x00000000000000000000000000000000",
            amount: "13.761201",
          },
        ],
      },
      {
        type: "swap",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            networkId: 130,
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
          },
        ],
        tokenOut: [
          {
            networkId: 130,
            address: "0x4200000000000000000000000000000000000006",
          },
        ],
      },
      {
        type: "depositPool",
        pool: {
          networkId: 130,
          address: "0x8927058918e3cff6f55efe45a58db1be1f069e49",
        },
        tokenIn: [
          {
            address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
          },
          {
            address: "0x4200000000000000000000000000000000000006",
          },
        ],
      },
    ],
  };

  const [currentStep, setCurrentStep] = useState(-1); // -1: 시작 전, 0~n: 각 단계, totalSteps.length: 완료
  const [isLoading, setIsLoading] = useState(false);
  const [stepResults, setStepResults] = useState<any[]>([]);
  const [error, setError] = useState(null);

  // 예시 API 요청
  const executeStepMutation = {
    mutateAsync: async (stepData) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve({
              success: true,
              txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              gasUsed: Math.floor(Math.random() * 100000) + 21000,
              blockNumber: Math.floor(Math.random() * 1000) + 18000000,
              stepType: stepData.type,
            });
          } else {
            reject(new Error(`${stepData.type} 실행 실패`));
          }
        }, Math.random() * 2000 + 1000);
      });
    },
  };

  // 테스트용 시작버튼
  const startPurchaseProcess = async () => {
    setIsLoading(true);
    setCurrentStep(-1);
    setStepResults([]);
    setError(null);

    const totalSteps = mockPurchaseResponse.totalSteps;
    let index = 0;

    try {
      while (index < totalSteps.length) {
        setCurrentStep(index);

        console.log(`현재 index: ${index}, Step ${index + 1}: ${totalSteps[index].type} 실행 중...`);

        const result = await executeStepMutation.mutateAsync(totalSteps[index]);

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
      console.error(`Step ${index + 1} 실행 중 오류:`, error);
      setError(error.message);
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
          {mockPurchaseResponse.totalSteps.map((step, index) => (
            <div className="flex justify-between items-center">
              <div
                className={`size-10 border rounded-full flex items-center justify-center bg-black transition-all duration-300 ${
                  getStepStatus(index) === "completed"
                    ? "bg-green-500 text-white"
                    : getStepStatus(index) === "active"
                    ? "bg-blue-500 text-white animate-pulse"
                    : getStepStatus(index) === "error"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {getStepStatus(index) === "completed" ? "✓" : getStepStatus(index) === "error" ? "✗" : index + 1}
              </div>
              <p className="text-muted-foreground text-xs">
                {index === 0 && "Deposit Margin"}
                {index === 1 && "Swap"}
                {index === 2 && "Deposit Pool"}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/50 w-[2px] h-full left-[19px] absolute top-0 z-10">
          <div
            className="bg-white"
            style={{
              height: `${Math.min(100, (stepResults.length / (mockPurchaseResponse.totalSteps.length - 1)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {stepResults.length > 0 && (
        <Card className="bg-emerald-50">
          <CardContent className="space-y-2">
            {stepResults.map((result, index) => (
              <div key={index} className="text-sm border-b border-green-200 pb-2 last:border-b-0">
                <div className="flex items-center mb-1">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✓</span>
                  </span>
                  <span className="font-medium text-green-800">
                    Step {result.stepIndex}: {result.stepType}
                  </span>
                </div>
                <div className="text-green-600 ml-6 space-y-1">
                  <div>
                    TX Hash: <code className="bg-green-100 px-1 rounded text-xs">{result.txHash}</code>
                  </div>
                  <div>Gas Used: {result.gasUsed.toLocaleString()}</div>
                  <div>Block: #{result.blockNumber.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>구매 정보</CardTitle>
        </CardHeader>
        <CardContent>
          토큰 수량: 100 USDC
          <br />
          USD 가치: $100
        </CardContent>
      </Card>
    </div>
  );
};
