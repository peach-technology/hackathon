import { Outlet } from "react-router";
import Header from "../common/Header";

const DashBoard = () => {
  return (
    <div className="min-h-[100vh] flex flex-col bg-[oklch(0.19 0 0)]">
      <Header />

      <div className="flex flex-1 flex-col py-8 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;
