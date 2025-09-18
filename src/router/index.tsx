import { createBrowserRouter } from "react-router";
import DashBoard from "@/components/layouts/DashBoard";
import HomePage from "@/page/home";
import DetailPage from "@/page/detail";

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
    ],
  },
]);

export default router;
