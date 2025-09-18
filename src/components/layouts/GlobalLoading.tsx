import useLoadStore from "@/store/useLoadStore";
import { Spinner } from "../ui/shadcn-io/spinner";

const GlobalLoading = () => {
  const isLoading = useLoadStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-background/95 backdrop-blur flex items-center justify-center z-[999999] transition-opacity duration-300 ease-in-out opacity-100">
      <Spinner variant="default" />
    </div>
  );
};

export default GlobalLoading;
