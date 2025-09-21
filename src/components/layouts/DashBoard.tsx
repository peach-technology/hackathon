import { Outlet } from "react-router";
import Header from "../common/Header";
import { FireworksBackground } from "../ui/shadcn-io/fireworks-background";
import { motion, AnimatePresence } from "motion/react";
import useCompleteStore from "@/store/useCompleteStore";

const DashBoard = () => {
  const isComplete = useCompleteStore((state) => state.isComplete);

  return (
    <div className="min-h-[100vh] flex flex-col bg-neutral-800 px-2">
      <Header />
      <div className="flex flex-1 flex-col py-20 md:py-24 bg-neutral-900 rounded-2xl relative">
        <div className="container max-w-7xl mx-auto max-xl:px-6 relative ">
          <Outlet />
        </div>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center rounded-xl pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FireworksBackground
                className="absolute inset-0 flex items-center justify-center rounded-xl"
                population={8}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashBoard;
