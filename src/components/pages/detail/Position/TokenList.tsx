import type { Token } from "@/hooks/api/position";
import type { TokenType } from "@/hooks/api/token";
import { formatUSD } from "@/utils/format";

interface TokenListProps {
  title: string;
  tokens: Token[];
  tokenData: TokenType[];
  valueKey: "amount" | "fee";
}

const TokenList = ({ title, tokens, tokenData, valueKey }: TokenListProps) => {
  return (
    <div>
      <p>{title}</p>
      <div className="space-y-2 mt-5">
        {tokens.map((t) => {
          const tokenInfo = tokenData.find((d) => d.symbol === t.token.symbol);
          return (
            <div key={t.id} className="flex gap-2 items-center">
              <div className="size-5 rounded-full overflow-hidden">
                <img src={tokenInfo?.logo} alt={t.token.symbol} />
              </div>
              <p>
                {formatUSD(t[valueKey])} {t.token.symbol}{" "}
                <span className="text-muted-foreground">
                  ({formatUSD((t[valueKey] ?? 0) * (t.token.asset?.mark ?? 1))})
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenList;
