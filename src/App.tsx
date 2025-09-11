import { RouterProvider } from "react-router";
import router from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
