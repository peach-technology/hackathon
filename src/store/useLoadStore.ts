import { create } from "zustand";

interface UseLoadStoreProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoadStore = create<UseLoadStoreProps>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

export default useLoadStore;
