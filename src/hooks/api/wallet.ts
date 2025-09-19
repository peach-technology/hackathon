import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

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

export const useWalletMutaiton = () => {
  return useMutation({
    mutationFn: async (data: walletForm) => {
      const res = await axios.post("/wallets", data);
      return res.data;
    },
  });
};
