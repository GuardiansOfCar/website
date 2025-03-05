import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { SOL_ADDRESS } from "@/lib/constants";

export function useSolanaTx(solana: any | undefined) {
  async function generateSignedTransaction(
    from: string,
    amt: number,
  ): Promise<string> {
    if (!solana) {
      throw new Error("Solana not available.");
    }

    const toAddress = new PublicKey(SOL_ADDRESS); // 받는 주소
    const lamports = amt * 1000000000;

    // 트랜잭션 생성

    const { blockhash } = await fetch(`/api/solana`).then((res) => res.json());

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(from),
        toPubkey: toAddress,
        lamports: lamports,
      }),
    );
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(from);

    const signedTransaction = await solana.signTransaction(transaction);

    const txRes = await fetch(`/api/solana`, {
      method: "POST",
      body: JSON.stringify({ payload: signedTransaction.serialize() }),
    });

    if (txRes.status != 200 && txRes.status !== 201) {
      throw new Error("Failed to broadcast transaction.");
    }

    const { tx } = await txRes.json();
    return tx;
  }

  return {
    generateSignedTransaction: generateSignedTransaction,
  };
}
