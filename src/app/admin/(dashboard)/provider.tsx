"use client";

import { createContext, PropsWithChildren } from "react";

export const TokenContext = createContext("");

export default function AdminProvider({
  children,
  token,
}: PropsWithChildren<{ token: string }>) {
  return (
    <TokenContext.Provider value={token}>{children} </TokenContext.Provider>
  );
}
