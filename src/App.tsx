import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  TurnkeyProvider,
  type TurnkeyProviderConfig,
} from "@turnkey/react-wallet-kit";
import router from "./router";
import { Toaster } from "./components/ui/sonner";

const turnkeyConfig: TurnkeyProviderConfig = {
  organizationId: import.meta.env.VITE_TURNKEY_ORGANIZATION_ID!,
  authProxyConfigId: import.meta.env.VITE_AUTH_PROXY_CONFIG_ID!,
  apiBaseUrl: "https://api.turnkey.com",
  auth: {
    createSuborgParams: {
      emailOtpAuth: {
        customWallet: {
          walletName: "New Wallet",
          walletAccounts: [
            {
              curve: "CURVE_SECP256K1",
              pathFormat: "PATH_FORMAT_BIP32",
              path: `m/44'/60'/0'/0/0`,
              addressFormat: "ADDRESS_FORMAT_ETHEREUM",
            },
          ],
        },
      },
    },
  },
};

const App = () => {
  return (
    <TurnkeyProvider
      config={turnkeyConfig}
      callbacks={{
        onError: (error) => console.error("Turnkey error:", error),
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ThemeProvider>
    </TurnkeyProvider>
  );
};

export default App;
