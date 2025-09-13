import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  TurnkeyProvider,
  type TurnkeyProviderConfig,
} from "@turnkey/react-wallet-kit";
import router from "./router";

const turnkeyConfig: TurnkeyProviderConfig = {
  organizationId: import.meta.env.VITE_ORGANIZATION_ID!,
  authProxyConfigId: import.meta.env.VITE_AUTH_PROXY_CONFIG_ID!,
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
        </QueryClientProvider>
      </ThemeProvider>
    </TurnkeyProvider>
  );
};

export default App;
