import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, linea, lineaSepolia, bsc } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  ssr: true,
  chains: [mainnet, bsc],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
});
