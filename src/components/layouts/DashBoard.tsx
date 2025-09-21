import { Outlet } from "react-router";
import Header from "../common/Header";

const DashBoard = () => {
  return (
    <div className="min-h-[100vh] flex flex-col bg-neutral-800 px-2">
      <Header />
      <div className="flex flex-1 flex-col py-20 md:py-24 bg-neutral-900 rounded-2xl">
        <div className="container max-w-7xl mx-auto max-xl:px-6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
