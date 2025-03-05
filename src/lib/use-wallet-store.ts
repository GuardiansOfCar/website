import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Network = "ETH" | "BNB" | "SOL";
export type Coin = "ETH" | "BNB" | "SOL" | "USDT";
export type Provider = "phantom" | "metamask" | "walletconnect" | "trustwallet";

interface WalletStore {
  address: string;
  network: Network;

  provider: Provider | null;
  coin: Coin;
  setCoin: (coin: Coin) => void;
  setProvider: (Provider: Provider) => void;

  setAddress: (address: string) => void;
  setNetwork: (network: Network) => void;
  clear: () => void;
}

export const useWalletStore = create<WalletStore>()(
  devtools((set) => ({
    address: "",
    provider: null,
    setProvider: (provider) => set({ provider }),
    network: "ETH",
    coin: "ETH",
    setCoin: (coin) => set({ coin }),
    setNetwork: (network: Network) =>
      set({ network, coin: network, address: "", provider: null }),
    setAddress: (address: string) => set({ address }),

    clear: () =>
      set({
        address: "",
        network: "ETH",
        coin: "ETH",
        provider: null,
      }),
  })),
);
