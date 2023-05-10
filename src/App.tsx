import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig, createClient, goerli } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, polygonMumbai, optimismGoerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { BananaWallet } from "@rize-labs/banana-rainbowkit-plugin";
import { Demo } from "./demo";

function App() {
  const { chains, provider } = configureChains(
    [polygonMumbai, optimismGoerli, goerli],
    [publicProvider()]
  );
  
  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        BananaWallet({ chains, connect: { networkId: 80001 } }),
        metaMaskWallet({ chains, shimDisconnect: true }),
        rainbowWallet({ chains }),
        walletConnectWallet({ chains }),
        injectedWallet({ chains, shimDisconnect: true }),
      ],
    },
  ]);

//creating clients to use hooks of wagmi
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });
  
  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Demo />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
