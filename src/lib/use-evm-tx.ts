"use client";

import { EVM_ADDRESS, wrapWindow } from "@/lib/constants";
import { Network } from "@/lib/use-wallet-store";

export function useEvmTx(provider: any | undefined) {
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
      console.log(`Switched to ${network}`);
    } catch (error: any) {
      if (error.code === 4902) {
        // BSC 네트워크가 Metamask에 없으면 추가
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

  const generateSignedTransaction = async (
    network: Network,
    address: string,
    eth: number,
  ): Promise<string> => {
    if (!provider) {
      throw new Error("Ethereum not available.");
    }

    await switchNetwork(network);

    const gasPrice = await provider.request({ method: "eth_gasPrice" });

    const tx = {
      from: address,
      to: EVM_ADDRESS,
      value: "0x" + (eth * 10 ** 18).toString(16),
      gas: "0x5208",
      gasPrice: gasPrice,
      nonce: await provider.request({
        method: "eth_getTransactionCount",
        params: [address, "latest"],
      }),
      chainId: network === "BNB" ? "0x38" : "0x1",
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
