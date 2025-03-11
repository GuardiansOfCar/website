"use client";

import {
  BNB_USDT_CONTRACT,
  ETH_USDT_CONTRACT,
  ETH_ADDRESS,
  BSC_ADDRESS,
} from "@/lib/constants";
import { Network } from "@/lib/use-wallet-store";
import { useWallet } from "@/lib/use-wallet";

export function useEvmTx(provider: any | undefined) {
  const { coin, network, address } = useWallet();

  async function switchNetwork(network: Network) {
    const BSC_MAINNET_PARAMS = {
      chainId: "0x38",
      chainName: "Binance Smart Chain",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com/"],
    };

    const ETH_MAINNET_PARAMS = {
      chainId: "0x1", // Ethereum Mainnet
      chainName: "Ethereum Mainnet",
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_KEY"], // Infura 또는 다른 RPC 사용
      blockExplorerUrls: ["https://etherscan.io/"],
    };

    const params = network === "ETH" ? ETH_MAINNET_PARAMS : BSC_MAINNET_PARAMS;
    try {
      await provider!!.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: params.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await provider!!.request({
            method: "wallet_addEthereumChain",
            params: [params],
          });
          console.log("BSC network added and switched");
        } catch (addError) {
          console.error("Failed to add BSC network", addError);
        }
      } else {
        console.error("Failed to switch to BSC", error);
      }
    }
  }

  const generateSignedTransaction = async (eth: number): Promise<string> => {
    if (!provider) {
      throw new Error(
        `${network === "BNB" ? "BSC" : "ETHEREUM"} wallet not available.`,
      );
    }

    await switchNetwork(network);

    const gasPrice = await provider.request({ method: "eth_gasPrice" });
    const nonce = await provider.request({
      method: "eth_getTransactionCount",
      params: [address, "latest"],
    });

    const value =
      coin === "USDT" ? "0x0" : "0x" + (eth * 10 ** 18).toString(16);

    const receipt = network === "BNB" ? BSC_ADDRESS : ETH_ADDRESS;

    const to =
      coin === "USDT"
        ? network === "BNB"
          ? BNB_USDT_CONTRACT
          : ETH_USDT_CONTRACT
        : receipt;

    const usdtDemical = network === "BNB" ? 18 : 6;

    const tx = {
      from: address,
      to,
      value,
      gas: "0x5208",
      gasPrice,
      nonce,
      chainId: network === "BNB" ? "0x38" : "0x1",
      data:
        coin === "USDT"
          ? "0xa9059cbb" +
            receipt.replace("0x", "").padStart(64, "0") +
            (eth * 10 ** usdtDemical).toString(16).padStart(64, "0")
          : undefined,
    };

    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    return txHash!! as string;
  };

  return {
    generateSignedTransaction: generateSignedTransaction,
  };
}
