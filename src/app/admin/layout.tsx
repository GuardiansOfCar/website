import type { Metadata } from "next";
import "../globals.css";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "GUARDIANS OF THE CAR",
};

export default async function AdminLayout(props: PropsWithChildren) {
  return (
    <html lang={"ko"}>
      <body className={`antialiased`}>{props.children}</body>
    </html>
  );
}
