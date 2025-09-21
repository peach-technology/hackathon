import axios from "@/lib/axios";
import type { DepositResponse } from "@/types/deposit";
import type { ExecuteParams, ExecuteResponse } from "@/types/execute";
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
