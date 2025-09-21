import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPositionsAddress, type PositionAddressResponse } from "@/hooks/api/position";
import { useTokenListQuery } from "@/hooks/api/token";
import TokenList from "./TokenList";
import { Skeleton } from "@/components/ui/skeleton";
import type { PoolType } from "@/hooks/api/pool";

const Position = ({ poolData }: { poolData?: PoolType }) => {
  const { data, isPending } = useGetPositionsAddress();
  const { data: TokenData } = useTokenListQuery();

  const filteredData = filterDataByPool(data, poolData?.id);

  return (
    <>
      {isPending ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <Card className="bg-blue-500/15">
          <CardHeader>
            <CardTitle className="flex gap-5 items-center">LP Pool</CardTitle>
          </CardHeader>

          {(filteredData?.tokens ?? []).length > 0 ? (
            <CardContent className="space-y-3 flex justify-between gap-5 flex-wrap">
              <TokenList
                title="Current Balance"
                tokens={filteredData?.tokens || []}
                tokenData={TokenData || []}
                valueKey="amount"
              />
              <TokenList
                title="Your Unclaimed Swap Fee"
                tokens={filteredData?.tokens || []}
                tokenData={TokenData || []}
                valueKey="fee"
              />
            </CardContent>
          ) : (
            <CardContent className="text-center">No results.</CardContent>
          )}
        </Card>
      )}

      {isPending ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <Card className="bg-red-500/15">
          <CardHeader>
            <CardTitle className="flex gap-5 items-center">Hyperliquid</CardTitle>
          </CardHeader>
          {(filteredData?.assets ?? []).length > 0 ? (
            <CardContent className="space-y-3 flex justify-between gap-5 flex-wrap">
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">Share</p>
                <p className="text-right">{filteredData?.assets[0]?.size}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">Entry</p>
                <p className="text-right">{filteredData?.assets[0]?.entry}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">Current</p>
                <p className="text-right">{filteredData?.assets[0]?.notional_value}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">PnL</p>
                <p className="text-right">{filteredData?.assets[0]?.upnl}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-muted-foreground">Leverage</p>
                <p className="text-right">{filteredData?.assets[0]?.leverage}</p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="text-center">No results.</CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default Position;

const filterDataByPool = (data?: PositionAddressResponse, targetPoolId?: number) => {
  if (!data || !data.positions) return null;

  // 1. pool ID로 position 찾기
  const targetPosition = data.positions.find((position) => position.pool === targetPoolId);

  if (!targetPosition) {
    return {
      position: null,
      tokens: [],
      assets: [],
    };
  }

  const positionId = targetPosition.id;

  // 2. position ID로 tokens 필터링
  const filteredTokens = data.tokens?.filter((token) => token.position === positionId) || [];

  // 3. position ID로 assets 필터링
  const filteredAssets = data.assets?.filter((asset) => asset.position === positionId) || [];

  return {
    position: targetPosition,
    tokens: filteredTokens,
    assets: filteredAssets,
  };
};
