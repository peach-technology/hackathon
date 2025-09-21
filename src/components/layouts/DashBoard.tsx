import { Outlet } from "react-router";
import Header from "../common/Header";

const DashBoard = () => {
  return (
    <div className="min-h-[100vh] flex flex-col bg-neutral-900 px-2">
      <Header />
      <div className="flex flex-1 flex-col py-12 md:py-16 px-4 md:px-14 bg-background rounded-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;
