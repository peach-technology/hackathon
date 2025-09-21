import { create } from "zustand";

interface UseCompleteStoreProps {
  isComplete: boolean;
  setComplete: (complete: boolean) => void;
}

const useCompleteStore = create<UseCompleteStoreProps>((set) => ({
  isComplete: false,
  setComplete: (isComplete: boolean) => {
    set({ isComplete });

    if (isComplete) {
      setTimeout(() => set({ isComplete: false }), 10000);
    }
  },
}));

export default useCompleteStore;
