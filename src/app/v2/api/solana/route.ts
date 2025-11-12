import { Connection } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed",
);

export async function GET() {
  let blockhash = (await connection.getLatestBlockhash("finalized")).blockhash;

  return NextResponse.json({
    blockhash,
  });
}

export async function POST(reqest: NextRequest) {
  const data = await reqest.json();

  const tx = await connection.sendRawTransaction(data.payload);

  return NextResponse.json({
    tx,
  });
}
