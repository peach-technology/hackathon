import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface TokenType {
  id: number;
  network: number;
  symbol: string;
  contract_address: string;
  decimals: number;
  created_at: string;
  asset?: number;
  logo: string;
  name: string;
}

const generatorTokenListQueryKey = () => {
  return ["tokens"];
};

export const useTokenListQuery = () => {
  return useQuery<TokenType[]>({
    queryFn: async () => {
      const res = await axios("/tokens", {});
      return res.data;
    },
    queryKey: generatorTokenListQueryKey(),
  });
};
