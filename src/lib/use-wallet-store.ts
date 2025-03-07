import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Network = "ETH" | "BNB" | "SOL";
export type Coin = "ETH" | "BNB" | "SOL" | "USDT";
export type Provider = "phantom" | "metamask" | "walletconnect" | "trustwallet";

export type Info = {
  solanaAddress: string;
  icoAddress: string;
  icoNetwork: string;
  walletId: number;
  referralCode: string;
};

interface WalletStore {
  address: string;
  network: Network;
  info: Info | undefined;
  setInfo: (info: Info | undefined) => void;
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

      info: undefined,
    setInfo: (info) => set({ info }),

    setProvider: (provider) => set({ provider }),
    network: "ETH",
    coin: "ETH",
    setCoin: (coin) => set({ coin }),
    setNetwork: (network: Network) => set({ network, coin: network }),
    setAddress: (address: string) =>
      set((s) => (s.address === address ? s : { address })),

    clear: () =>
      set({
        address: "",
        network: "ETH",
        coin: "ETH",
        provider: null,
      }),
  })),
);
