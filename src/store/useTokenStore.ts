import type { TokenType } from "@/hooks/api/token";
import { create } from "zustand";

interface UseTokenStoreProps {
  token: TokenType;
  setToken: (token: TokenType) => void;
}

const useTokenStore = create<UseTokenStoreProps>((set) => ({
  token: {
    id: 2,
    network: 130,
    symbol: "USDC",
    contract_address: "0x078d782b760474a361dda0af3839290b0ef57ad6",
    decimals: 6,
    created_at: "2025-09-14T07:50:33.133515+00:00",
    asset: undefined,
    logo: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
    name: "USD Coin",
  },
  setToken: (token: TokenType) => set({ token }),
}));

export default useTokenStore;
