import { createBrowserRouter } from "react-router";
import DashBoard from "@/components/layouts/DashBoard";
import HomePage from "@/page/home";
import DetailPage from "@/page/detail";
import SwapPage from "@/components/pages/swap/SwapPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashBoard />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "detail/:network/:address",
        element: <DetailPage />,
      },
      {
        path: "swap",
        element: <SwapPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div className="flex items-center justify-center min-h-screen text-white bg-black">NotFound</div>,
  },
]);

export default router;
