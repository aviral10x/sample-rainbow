import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { BananaWallet } from "@rize-labs/banana-rainbowkit-plugin";
import { Demo } from "./demo";

function App() {
  const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [publicProvider()]
  );
  // const { connectors } = getDefaultWallets({
  //   appName: "My RainbowKit App",
  //   chains,
  // });

  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        BananaWallet({
          chains,
          connect: {
            networkId: 80001
          }
        }),
      ]
    }])

  const wagmiConfig = createClient({
    autoConnect: true,
    connectors,
    provider
  });
  
  return (
    <div className="App">
      <WagmiConfig client={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Demo />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
