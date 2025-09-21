import { abbreviateUSD } from "@/utils/format";
import Odometer from "react-odometerjs";
import { useEffect, useMemo, useState } from "react";

interface RollingUSDProps {
  symbol?: "doller" | "percent" | "none";
  amount: number;
  customSuffix?: string;
}

const RollingCount = ({ symbol = "doller", amount, customSuffix }: RollingUSDProps) => {
  const normalizedSymbol: "dollar" | "percent" | "none" = symbol === "doller" ? "dollar" : symbol ?? "none";

  const { scaled, suffix } = useMemo(() => {
    if (normalizedSymbol === "percent") {
      return { scaled: Number((amount / 10000).toFixed(3)), suffix: "" };
    }
    if (normalizedSymbol === "dollar") {
      return abbreviateUSD(amount);
    }
    return { scaled: amount, suffix: "" };
  }, [amount, normalizedSymbol]);

  const [display, setDisplay] = useState(0);

  const formatted = useMemo(() => display.toFixed(3), [display]);
  const [intPart, decPart = ""] = formatted.split(".");

  const finalSuffix = customSuffix || suffix;

  useEffect(() => {
    setDisplay(0);
    const id = requestAnimationFrame(() => setDisplay(scaled));
    return () => cancelAnimationFrame(id);
  }, [scaled]);

  return (
    <div className="text-4xl lg:text-5xl font-semibold leading-none tracking-tight flex items-center">
      {/* dollar */}
      {normalizedSymbol === "dollar" && <span className="mr-0.5">$</span>}

      {normalizedSymbol === "dollar" ? (
        <>
          <Odometer value={display} format={"(,ddd).d"} />
          {suffix && <span className="ml-1">{suffix}</span>}
        </>
      ) : normalizedSymbol === "percent" ? (
        <>
          {intPart === "0" && <Odometer value={Number(intPart)} format="(,ddd)" />}
          {decPart && (
            <>
              <span>.</span>
              <Odometer value={Number(decPart)} format={"d".repeat(decPart.length)} />
            </>
          )}
          {customSuffix ? <span className="ml-1">{customSuffix}</span> : <span className="ml-1">%</span>}
        </>
      ) : (
        <>
          <Odometer value={display} format={"(,ddd).d"} />
          {finalSuffix && <span className="ml-1">{finalSuffix}</span>}
        </>
      )}
    </div>
  );
};

export default RollingCount;
