import { abbreviateUSD } from "@/utils/format";
import Odometer from "react-odometerjs";
import { useEffect, useMemo, useState } from "react";

interface RollingUSDProps {
  symbol?: "doller" | "percent";
  amount: number;
}

const RollingCount = ({ symbol = "doller", amount }: RollingUSDProps) => {
  const normalizedSymbol: "dollar" | "percent" = symbol === "doller" ? "dollar" : symbol;

  const { scaled, suffix } = useMemo(() => {
    if (symbol === "percent") {
      return { scaled: Number((amount / 10000).toFixed(1)), suffix: "" };
    }
    return abbreviateUSD(amount);
  }, [amount, symbol]);

  const [display, setDisplay] = useState(0);

  const formatted = useMemo(() => display.toFixed(1), [display]);
  const [intPart, decPart = ""] = formatted.split(".");

  useEffect(() => {
    setDisplay(0);
    const id = requestAnimationFrame(() => setDisplay(scaled));
    return () => cancelAnimationFrame(id);
  }, [scaled]);

  return (
    <div className="text-4xl lg:text-5xl font-semibold leading-none tracking-tight flex items-center">
      {normalizedSymbol === "dollar" && <span className="mr-0.5">$</span>}

      {normalizedSymbol === "dollar" ? (
        <>
          <Odometer value={display} format={"(,ddd).d"} />
          {suffix && <span className="ml-1">{suffix}</span>}
        </>
      ) : (
        <>
          {intPart === "0" && (
            <>
              <Odometer value={Number(intPart)} format="(,ddd)" />
            </>
          )}

          {decPart && (
            <>
              <span>.</span>
              <Odometer value={Number(decPart)} format={"d".repeat(decPart.length)} />
            </>
          )}

          <span className="ml-1">%</span>
        </>
      )}
    </div>
  );
};

export default RollingCount;
