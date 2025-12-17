"use client"

import React, { useMemo, createContext } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  WalletProvider as SolanaWalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

// Import wallet adapter CSS for modal styling
import "@solana/wallet-adapter-react-ui/styles.css"

// Context for sharing endpoint with other components (for Jupiter API etc)
interface ModalContextState {
  endpoint: string
  isMainnet: boolean
}

export const ModalContext = createContext<ModalContextState>({
  endpoint: "",
  isMainnet: false,
})

interface WalletProviderProps {
  children: React.ReactNode
  network?: WalletAdapterNetwork
}

export function WalletProvider({
  children,
  network = WalletAdapterNetwork.Devnet
}: WalletProviderProps) {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    }
    return clusterApiUrl(network)
  }, [network])

  const isMainnet = network === WalletAdapterNetwork.Mainnet

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  const contextValue = useMemo(() => ({
    endpoint,
    isMainnet,
  }), [endpoint, isMainnet])

  return (
    <ModalContext.Provider value={contextValue}>
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </ModalContext.Provider>
  )
}
