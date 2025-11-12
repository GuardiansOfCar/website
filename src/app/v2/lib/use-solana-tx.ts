import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";
import { SOL_ADDRESS, SOL_USDT_CONTRACT } from "@/app/v2/lib/constants";
import { useWallet } from "@/app/v2/lib/use-wallet";
import { trackPurchase } from "@/app/v2/lib/utils";

export function useSolanaTx(solana: any | undefined) {
  const { coin, address } = useWallet();

  async function generateSignedTransaction(amt: number): Promise<string> {
    if (!solana) {
      throw new Error("Solana not available.");
    }

    const sender = new PublicKey(address);
    const toAddress = new PublicKey(SOL_ADDRESS);
    const usdtAddress = new PublicKey(SOL_USDT_CONTRACT);

    const senderATA = await getAssociatedTokenAddress(usdtAddress, sender);
    const recipientATA = await getAssociatedTokenAddress(
      usdtAddress,
      toAddress,
    );

    const { blockhash } = await fetch(`/api/solana`).then((res) => res.json());

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: sender,
    }).add(
      coin === "USDT"
        ? createTransferInstruction(
            senderATA,
            recipientATA,
            sender,
            amt * 10 ** 6,
          )
        : SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: toAddress,
            lamports: amt * 10 ** 9,
          }),
    );

    const signedTransaction = await solana.signTransaction(transaction);

    const txRes = await fetch(`/api/solana`, {
      method: "POST",
      body: JSON.stringify({ payload: signedTransaction.serialize() }),
    });

    if (txRes.status != 200 && txRes.status !== 201) {
      throw new Error("Failed to broadcast transaction.");
    }

    const { tx } = await txRes.json();
    
    // Track purchase for Google Analytics with automatic USD conversion
    // Uses the actual coin type (SOL or USDT) and amount for accurate USD calculation
    await trackPurchase(tx, amt, coin === "USDT" ? "USDT" : "SOL");
    
    return tx;
  }

  return {
    generateSignedTransaction: generateSignedTransaction,
  };
}
