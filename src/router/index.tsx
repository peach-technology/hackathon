import { createBrowserRouter } from "react-router";
import Home from "@/page/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export default router;
