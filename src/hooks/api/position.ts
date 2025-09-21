/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "@/lib/axios";
import type { DepositResponse } from "@/types/deposit";
import type { ExecuteParams, ExecuteResponse } from "@/types/execute";
import type { getDepositQuoteForm, getDepositQuoteResponse } from "@/types/getDeposit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/react-wallet-kit";

const generatorPositionAddressQueryKey = (wallets?: any) => {
  return ["position_address", wallets];
};

export const useGetDepositQuoteMutation = () => {
  return useMutation({
    mutationFn: async (params: getDepositQuoteForm) => {
      const res = await axios.post<getDepositQuoteResponse>("/positions", {
        method: "getDepositQuote",
        params,
      });
      return res.data;
    },
  });
};

export const useDepositMutation = () => {
  return useMutation({
    mutationFn: async (params: getDepositQuoteForm) => {
      const res = await axios.post<DepositResponse>("/positions", {
        method: "deposit",
        params,
      });
      return res.data;
    },
    retry: 0,
  });
};

export const useExecuteMutation = () => {
  return useMutation({
    mutationFn: async (params: ExecuteParams) => {
      const res = await axios.post<ExecuteResponse>("/positions", {
        method: "execute",
        params,
      });

      return res.data;
    },
    retry: 0,
  });
};

export const useGetPositionsAddress = () => {
  const { wallets } = useTurnkey();

  return useQuery<PositionAddressResponse>({
    queryFn: async () => {
      const res = await axios(`/positions`, {
        params: {
          address: wallets[0].accounts[0].address.toLocaleLowerCase(),
        },
      });
      return res.data;
    },
    enabled: Boolean(wallets),
    queryKey: generatorPositionAddressQueryKey(wallets),
  });
};

export interface PositionAddressResponse {
  positions: Position[];
  tokens: Token[];
  assets: Asset2[];
}

export interface Position {
  id: number;
  wallet?: Wallet;
  pool: number;
  updated_at: string;
  created_at: string;
  margin_buffer_max: number;
  margin_buffer_min: number;
  subaccount: string;
  tick_range_target: number;
  pool_price_lower: number;
  pool_price_upper: number;
  active: boolean;
  pool_token_id: number;
  margin_used: number;
  notional_value: number;
  maintenance_margin: number;
  withdrawable: number;
  safety_factor?: number;
  account_value: number;
}

export interface Wallet {
  id: number;
  address: string;
}

export interface Token {
  id: number;
  position: number;
  amount: number;
  fee: number;
  fee_collected: any;
  fee_collected_usd: any;
  created_at: string;
  updated_at: string;
  token: Token2;
}

export interface Token2 {
  id: number;
  asset?: Asset;
  symbol: string;
}

export interface Asset {
  id: number;
  mark: number;
  symbol: string;
}

export interface Asset2 {
  id: number;
  asset: number;
  entry: number;
  upnl: number;
  updated_at: string;
  created_at: string;
  size: number;
  position: number;
  notional_value: number;
  leverage: number;
  liquidation: number;
  margin_used: number;
}
