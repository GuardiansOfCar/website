import { PropsWithChildren } from "react";
import "./globals.css";

export default function V2RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="antialiased">{props.children}</body>
    </html>
  );
}

