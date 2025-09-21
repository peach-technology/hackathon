import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const generatorGetListNetworksQueryKey = () => {
  return ["networks"];
};

export const useGetListNetworks = () => {
  return useQuery<NetworkResponse[]>({
    queryFn: async () => {
      const res = await axios(`/networks`);
      return res.data;
    },
    queryKey: generatorGetListNetworksQueryKey(),
  });
};

export interface NetworkResponse {
  id: number;
  name: string;
  rpc_url: string;
  created_at: string;
  native_address: string;
  logo: string;
  native_decimals: number;
}
