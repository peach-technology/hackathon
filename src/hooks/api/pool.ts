import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface PoolType {
  id: number;
  pool_name: string;
  pool_address: string;
  network: number;
  volume_1h: number;
  volume_6h: number;
  volume_24h: number;
  reserve_in_usd: number;
  network_name: string;
  network_logo: string;
  token0: number;
  token0_name: string;
  token0_symbol: string;
  token0_logo: string;
  token0_decimals: number;
  token0_contract_address: string;
  token1: number;
  token1_name: string;
  token1_symbol: string;
  token1_logo: string;
  token1_decimals: number;
  token1_contract_address: string;
  fee: number;
  dex: number;
  dex_name: string;
  dex_protocol: string;
  dex_version: string;
  margin_ratio: number;
  pool_created_at: string;
  volume_1h_per_tvl: number;
  volume_6h_per_tvl: number;
  volume_24h_per_tvl: number;
  fee_1h: number;
  fee_6h: number;
  fee_24h: number;
  fee_1h_per_tvl_apr: number;
  fee_6h_per_tvl_apr: number;
  fee_24h_per_tvl_apr: number;
  snapshot_timestamp: string;
  pool_price: number;
  effective_apr: number;
  funding_apr: number;
  combined_apr: number;
}

const generatorPoolListQueryKey = () => {
  return ["pools"];
};

const generatorPoolDeatilQueryKey = (network?: string, address?: string) => {
  return ["pools", network, address];
};

const generatorPoolHistoryQueryKey = (network?: string, address?: string) => {
  return ["pool_history", network, address];
};

export const usePoolListQuery = () => {
  return useQuery<PoolType[]>({
    queryFn: async () => {
      const res = await axios("/pools", {
        params: {
          sort: "combined_apr",
        },
      });
      return res.data;
    },
    queryKey: generatorPoolListQueryKey(),
  });
};

export const usePoolDetailQuery = (network?: string, address?: string) => {
  return useQuery<PoolType>({
    queryFn: async () => {
      const res = await axios("/pools", {
        params: {
          network: network,
          poolAddress: address,
        },
      });
      return res.data;
    },
    enabled: Boolean(network) || Boolean(address),
    queryKey: generatorPoolDeatilQueryKey(network, address),
  });
};

export interface PoolHistoryType {
  network: number;
  poolAddress: string;
  funding_apr: PoolHistoryChart[];
  effective_apr: PoolHistoryChart[];
  combined_apr: PoolHistoryChart[];
}

export interface PoolHistoryChart {
  timestamp: string;
  value: number;
}

export const usePoolHistoryQuery = (network?: string, address?: string) => {
  return useQuery<PoolHistoryType>({
    queryFn: async () => {
      const res = await axios(`/pools/history/${network}/${address}`);
      return res.data;
    },
    enabled: Boolean(network) || Boolean(address),
    queryKey: generatorPoolHistoryQueryKey(network, address),
  });
};
