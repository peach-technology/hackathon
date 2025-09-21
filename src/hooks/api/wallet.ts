/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/react-wallet-kit";

interface walletForm {
  method: string;
  params: {
    subOrgId: string;
    walletId: string;
    delegatedUserId: string;
    name: string;
    address: string;
  };
}

const generatorGetWalletBalanceQueryKey = (wallets?: any) => {
  return ["wallet_balance", wallets];
};

export const useWalletMutaiton = () => {
  return useMutation({
    mutationFn: async (data: walletForm) => {
      const res = await axios.post("/wallets", data);
      return res.data;
    },
  });
};

export const useGetWalletBalance = () => {
  const { wallets } = useTurnkey();
  return useQuery<WalletBalanceResponse[]>({
    queryFn: async () => {
      const res = await axios(`/wallets/balance/${wallets[0].accounts[0].address}`);
      return res.data;
    },
    enabled: Boolean(wallets),
    queryKey: generatorGetWalletBalanceQueryKey(wallets),
  });
};

export interface WalletBalanceResponse {
  id: number;
  balance: number;
  value: number;
  updated_at?: string;
  created_at: string;
  wallet?: Wallet;
  token: Token;
}

export interface Wallet {
  id: number;
  address: string;
}

export interface Token {
  id: number;
  logo: string;
  symbol: string;
  network: Network;
  decimals: number;
  contract_address: string;
}

export interface Network {
  id: number;
  logo: string;
  name: string;
}
