import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface getDepositQuoteForm {
  sender: string;
  tokenInNetworkId: number;
  poolNetworkId: number;
  poolAddress: string;
  tokenInAddress: string;
  tokenInAmount: string;
  marginBufferMin: number;
  marginBufferMax: number;
  targetTickRange: number;
}

export interface getDepositQuoteResponse {
  marginRatio: number;
  tokenInNetworkId: number;
  tokenInAddress: string;
  poolNetworkId: number;
  poolAddress: string;
  margin: {
    tokenIn: {
      networkId: number;
      address: string;
      amount: string;
      amountUsd: string;
      amountRaw: string;
    };
    tokenOut: {
      networkId: number;
      address: string;
      amount: string;
      amountUsd: string;
      amountRaw: string;
    };
  };
  token0: {
    tokenIn: {
      networkId: number;
      address: string;
      amount: string;
      amountUsd: string;
      amountRaw: string;
    };
    tokenOut: {
      networkId: number;
      address: string;
      amount: string;
      amountUsd: string;
      amountRaw: string;
    };
  };
  token1: {
    tokenIn: {
      networkId: number;
      address: string;
      amount: string;
      amountUsd: string;
      amountRaw: string;
    };
    tokenOut: {
      networkId: number;
      address: string;
      amount: string;
      amountUsd: string;
      amountRaw: string;
    };
  };
}

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
