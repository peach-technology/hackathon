import { Outlet } from "react-router";
import Header from "../common/Header";

const DashBoard = () => {
  return (
    <div className="min-h-[100vh] flex flex-col ">
      <Header />

      <div className="flex flex-1 flex-col py-16 px-8 md:px-14">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;
