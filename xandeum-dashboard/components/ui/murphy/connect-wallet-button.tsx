"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useCallback } from "react"

interface ConnectWalletButtonProps {
  className?: string
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const { publicKey, disconnect, connected, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = useCallback(async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58())
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }, [publicKey])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  const handleConnect = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  if (connecting) {
    return (
      <Button className={className} disabled>
        Connecting...
      </Button>
    )
  }

  if (!connected || !publicKey) {
    return (
      <Button onClick={handleConnect} className={className}>
        Connect Wallet
      </Button>
    )
  }

  const address = publicKey.toBase58()
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {shortAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyAddress}>
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVisible(true)}>
          Change Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}