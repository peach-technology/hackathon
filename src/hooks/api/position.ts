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
  marginDepositAmount: string;
  token0: {
    amount: string;
    value: string;
  };
  token1: {
    amount: string;
    value: string;
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
