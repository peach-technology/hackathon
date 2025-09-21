import Login from "@/components/common/Login";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PoolType } from "@/hooks/api/pool";
import { useDepositMutation, useGetDepositQuoteMutation } from "@/hooks/api/position";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import type { getDepositQuoteResponse } from "@/types/getDeposit";
import ExecuteStep from "./ExecuteStep";
import type { DepositResponse } from "@/types/deposit";
import { ChevronsDown, Loader2Icon } from "lucide-react";
import GetDepositHL from "./GetDepositHL";
import GetDeposiLpPool from "./GetDeposiLpPool";
import TokenSelect from "./TokenSelect";
import useTokenStore from "@/store/useTokenStore";
import useCompleteStore from "@/store/useCompleteStore";

interface DepositProps {
  poolData: PoolType;
}

const Deposit = ({ poolData }: DepositProps) => {
  const { wallets, user } = useTurnkey();
  const setComplete = useCompleteStore((state) => state.setComplete);
  const selectToken = useTokenStore((state) => state.token);

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

  useDebounce(
    async () => {
      if (amount && user) {
        if (!poolData) return;

        try {
          const result = await GetDepositQuoteMutate({
            sender: wallets[0].accounts[0].address.toLocaleLowerCase(),
            tokenInNetworkId: selectToken.network,
            poolNetworkId: poolData.network,
            poolAddress: poolData.pool_address,
            tokenInAddress: selectToken.contract_address,
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

  const onDepositSumbmit = handleSubmit(async (data) => {
    if (!poolData) return;

    try {
      setIsExecuting(true);

      const result = await depositMutate({
        sender: wallets[0].accounts[0].address.toLocaleLowerCase(),
        tokenInNetworkId: selectToken.network,
        poolNetworkId: poolData.network,
        poolAddress: poolData.pool_address,
        tokenInAddress: selectToken.contract_address,
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

  const onExecuteComplete = (fireworks: boolean) => {
    setIsExecuting(false);
    setDepositData(undefined);
    setValue("amount", "");
    setGetDepositQuote(undefined);
    setComplete(fireworks);
  };

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
            <div className="text-4xl border rounded-xl py-12 px-4">
              <div className="flex justify-between">
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="outline-0 bg-transparent flex-1 min-w-0 text-left"
                  placeholder="0"
                  {...register("amount", {
                    required: true,
                    pattern: /^\d*\.?\d*$/,
                  })}
                />

                <TokenSelect />
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
                <ChevronsDown size={36} className="mx-auto" />
                <GetDepositHL getDepositQuote={getDepositQuote} poolData={poolData} />
                <GetDeposiLpPool getDepositQuote={getDepositQuote} poolData={poolData} />
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

            {!user && <Login buttonClass="w-full" buttonSize="default" buttonLabel="Please Login" />}
          </TabsContent>
        </Tabs>
      )}

      {depositPending && <Skeleton className="w-full md:w-[300px] lg:w-[400px] h-[200px]" />}

      {isExecuting && !depositPending && depositData && (
        <ExecuteStep depositData={depositData} onComplete={onExecuteComplete} />
      )}
    </>
  );
};

export default Deposit;
