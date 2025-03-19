import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { AccountLayout } from "@solana/spl-token";

const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed",
);

export async function GET(request: NextRequest) {
  const tokenAddress = request.nextUrl?.searchParams?.get(
    "tokenAddress",
  ) as string;
  const address = request.nextUrl?.searchParams?.get("address") as string;
  const token = request.nextUrl?.searchParams?.get("token") as string;

  const pb = new PublicKey(address);
  if (token === "SOL") {
    const balance = await connection.getBalance(pb);

    return NextResponse.json({
      balance: (balance / LAMPORTS_PER_SOL).toFixed(4),
    });
  } else {
    const usdtMintAddress = new PublicKey(tokenAddress);

    const tokenAccounts = await connection.getTokenAccountsByOwner(pb, {
      mint: usdtMintAddress,
    });

    let usdtBalance = 0;
    tokenAccounts.value.forEach((accountInfo) => {
      const accountData = AccountLayout.decode(accountInfo.account.data);
      if (accountData.mint.toBase58() === usdtMintAddress.toBase58()) {
        usdtBalance += Number(accountData.amount) / 1e6; // USDT는 소수점 6자리
      }
    });

    return NextResponse.json({
      balance: usdtBalance.toFixed(4),
    });
  }
}
