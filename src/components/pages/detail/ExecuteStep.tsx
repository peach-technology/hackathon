import { useExecuteMutation } from "@/hooks/api/position";
import { motion } from "motion/react";
import type { DepositResponse } from "@/types/deposit";
import { useCallback, useEffect, useState } from "react";
import { Check as CheckIcon } from "lucide-react";
import { Ban as BanIcon } from "lucide-react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import type { Activity, ExecuteResponse } from "@/types/execute";
import { toast } from "sonner";

interface ExecuteStepProps {
  depositData: DepositResponse;
  onComplete: () => void;
}

type StepStatus = "pending" | "active" | "completed" | "error";

interface StepResult {
  stepIndex: number;
  status: "success" | "error";
  data?: ExecuteResponse;
  error?: unknown;
}

const ExecuteStep = ({ depositData, onComplete }: ExecuteStepProps) => {
  const { wallets } = useTurnkey();
  const { mutateAsync: ExecuteMutate } = useExecuteMutation();

  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const totalSteps = depositData.totalSteps;

  const getStepStatus = (index: number): StepStatus => {
    const result = stepResults.find((r) => r.stepIndex === index);

    if (result) {
      return result.status === "success" ? "completed" : "error";
    }

    if (index === currentStep && isExecuting) {
      return "active";
    }

    return "pending";
  };

  const executeStep = useCallback(
    async (stepIndex: number) => {
      try {
        setIsExecuting(true);

        const executeParams = {
          type: "deposit",
          sender: wallets[0].accounts[0].address,
          stepIndex,
          positionId: depositData.position.id,
          totalTokenIn: depositData.totalTokenIn,
          totalSteps: depositData.totalSteps,
        };

        console.log(`Executing step ${stepIndex}:`, executeParams);

        const result = await ExecuteMutate(executeParams);

        // 성공한 결과 저장
        setStepResults((prev) => {
          // 이미 같은 stepIndex가 있는지 확인
          const existingIndex = prev.findIndex((r) => r.stepIndex === stepIndex);
          if (existingIndex >= 0) {
            // 이미 있으면 업데이트
            const updated = [...prev];
            updated[existingIndex] = {
              stepIndex,
              status: "success",
              data: result,
            };
            return updated;
          } else {
            // 없으면 새로 추가
            return [
              ...prev,
              {
                stepIndex,
                status: "success",
                data: result,
              },
            ];
          }
        });

        console.log(`Step ${stepIndex} completed:`, result);
      } catch (error) {
        console.error(`Step ${stepIndex} failed:`, error);

        // 실패한 결과 저장
        setStepResults((prev) => {
          // 이미 같은 stepIndex가 있는지 확인
          const existingIndex = prev.findIndex((r) => r.stepIndex === stepIndex);
          if (existingIndex >= 0) {
            // 이미 있으면 업데이트
            const updated = [...prev];
            updated[existingIndex] = {
              stepIndex,
              status: "error",
              error,
            };
            return updated;
          } else {
            // 없으면 새로 추가
            return [
              ...prev,
              {
                stepIndex,
                status: "error",
                error,
              },
            ];
          }
        });
      } finally {
        setIsExecuting(false);
      }
    },
    [ExecuteMutate, depositData.position.id, depositData.totalSteps, depositData.totalTokenIn, wallets]
  );

  // 다음 스텝 실행 또는 완료 처리
  useEffect(() => {
    if (!isExecuting) {
      const currentStepResult = stepResults.find((r) => r.stepIndex === currentStep);

      if (currentStepResult) {
        if (currentStepResult.status === "error") {
          // 에러 발생 시 실행 중단
          console.error("Execution stopped due to error at step", currentStep);
          return;
        }

        if (currentStep < totalSteps.length - 1) {
          // 다음 스텝으로 이동
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);

          // 1초 후 다음 스텝 실행 (UI 효과를 위해)
          setTimeout(() => {
            executeStep(nextStep);
          }, 1000);
        } else {
          // 3초 후 완료 콜백 호출 (완료 상태를 보여주기 위해)
          setTimeout(() => {
            onComplete();
            toast.success("All steps completed successfully!");
          }, 3000);
        }
      }
    }
  }, [stepResults, currentStep, isExecuting, totalSteps.length, executeStep, onComplete]);

  useEffect(() => {
    if (stepResults.length === 0) {
      executeStep(0);
    }
  }, [executeStep, stepResults.length]);

  return (
    <div className="p-4 w-full md:w-[300px] lg:w-[400px] space-y-5">
      <div className="relative">
        <div className="relative z-20 space-y-12">
          {depositData.totalSteps.map((_, index) => (
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

      {/* Error Display */}
      {stepResults.some((r) => r.status === "error") && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">Execution Failed</p>
          <p className="text-red-600 text-xs mt-1">An error occurred during step execution. Please try again.</p>
        </div>
      )}

      {/* Transaction Results Display */}
      {stepResults.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-medium text-white">Transaction History</h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="space-y-3">
              {stepResults.map(
                (result, index) =>
                  result.status === "success" &&
                  result.data?.activities && (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-green-500 rounded-full inline-flex items-center justify-center mr-2">
                          <span className="text-white text-xs">✓</span>
                        </span>
                        <span className="font-medium text-green-800">
                          Step {result.stepIndex + 1}:{" "}
                          {result.stepIndex === 0 ? "Deposit Margin" : result.stepIndex === 1 ? "Swap" : "Deposit Pool"}
                        </span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {result.data.activities.map((activity: Activity, actIndex: number) => (
                          <div key={actIndex} className="text-green-600 text-xs bg-green-50 p-2 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="capitalize font-medium">
                                {activity.activity} - {activity.type}
                              </span>
                              <span className="font-mono">{Math.abs(activity.amount).toFixed(6)}</span>
                            </div>
                            {activity.hash && (
                              <div>
                                TX:{" "}
                                <code className="bg-green-100 px-1 rounded text-xs font-mono">
                                  {activity.hash.slice(0, 8)}...{activity.hash.slice(-6)}
                                </code>
                              </div>
                            )}
                            <div className="text-xs text-green-500 mt-1">
                              Network: {activity.network} | Value: ${Math.abs(activity.value).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecuteStep;
