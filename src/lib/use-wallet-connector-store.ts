import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface WalletConnectorStore {
  connect: boolean;
  setConnect: (open: boolean) => void;

  create: boolean;
  setCreate: (open: boolean) => void;
}

export const useWalletConnectorStore = create<WalletConnectorStore>()(
  devtools((set) => ({
    connect: false,
    setConnect: (connect) => set({ connect }),
    create: false,
    setCreate: (create) => set({ create }),
  })),
);
