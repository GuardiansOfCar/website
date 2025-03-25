import { Network, Provider, useWalletStore } from "@/lib/use-wallet-store";
import { useDisconnect } from "@reown/appkit/react";
import { ethers } from "ethers";
import {BNB_USDT_CONTRACT, ETH_USDT_CONTRACT, SOL_USDT_CONTRACT} from "@/lib/constants";

export function useWallet() {
  const walletStore = useWalletStore();

  const { disconnect } = useDisconnect();

  const getUSDTBalance = async (
    account: string,
    provider: any,
    contractAddress: string,
    is18?: boolean,
  ) => {
    const provider2 = new ethers.BrowserProvider(provider);
    const contract = new ethers.Contract(
      contractAddress,
      ["function balanceOf(address owner) view returns (uint256)"],
      provider2,
    );
    const balance = await contract.balanceOf(account);
    return parseFloat(ethers.formatUnits(balance, is18 ? 18 : 6)).toFixed(4);
  };

  return {
    getAmount: async () => {
      if (!walletStore.address) return 0.0;
      try {
        if (walletStore.network === "SOL") {
          const { balance } = await fetch(
            `/api/solana/amount?token=${walletStore.coin}&address=${walletStore.address}&tokenAddress=${SOL_USDT_CONTRACT}`,
          ).then((res) => res.json());
          return balance;
        } else {
          if (walletStore.coin === "USDT")
            return await getUSDTBalance(
              walletStore.address,
              walletStore.providerObj,
              walletStore.network === "ETH"
                ? ETH_USDT_CONTRACT
                : BNB_USDT_CONTRACT,
              walletStore.network === "BNB",
            );

          const balance = await walletStore.providerObj.request({
            method: "eth_getBalance",
            params: [walletStore.address, "latest"],
          });

          return parseFloat(ethers.formatEther(balance)).toFixed(4);
        }
      } catch (e: unknown) {
        console.error(e);
        return 0.0;
      }
    },
    set: (
      address: string,
      provider: Provider,
      network?: Network,
      obj?: any,
    ) => {
      if (!address) return alert("You don't have wallet to set.");

      walletStore.setAddress(address);
      walletStore.setProvider(provider);
      if (network !== undefined) {
        walletStore.setNetwork(network);
      }
      if (obj !== undefined) {
        walletStore.setProviderObj(obj);
      }
    },
    address: walletStore.address,
    id: walletStore.info?.walletId,
    solanaAddress: walletStore.info?.solanaAddress,
    provider: walletStore.provider,
    referral: walletStore.info?.referralCode,
    icoAddress: walletStore.info?.icoAddress,
    network: walletStore.network,
    coin: walletStore.coin,
    setCoin: walletStore.setCoin,
    setNetwork: async (net: Network) => {
      if (walletStore.provider === "walletconnect") {
        await disconnect();
      }
      walletStore.clear();
      walletStore.setNetwork(net);
    },
    disconnect: async () => {
      if (walletStore.provider === "walletconnect") {
        await disconnect();
      }
      walletStore.clear();
    },
  };
}
