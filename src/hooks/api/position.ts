import axios from "@/lib/axios";
import type { DepositAndExecuteResponse } from "@/types/depositAndExecute";
import type { getDepositQuoteForm, getDepositQuoteResponse } from "@/types/getDeposit";
import { useMutation } from "@tanstack/react-query";

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
      const res = await axios.post<DepositAndExecuteResponse>("/positions", {
        method: "deposit",
        params,
      });
      return res.data;
    },
  });
};

export const useExecuteMutation = () => {
  return useMutation({
    mutationFn: async (params: DepositAndExecuteResponse) => {
      const res = await axios.post<DepositAndExecuteResponse>("/positions", {
        method: "execute",
        params,
      });
      return res.data;
    },
  });
};
