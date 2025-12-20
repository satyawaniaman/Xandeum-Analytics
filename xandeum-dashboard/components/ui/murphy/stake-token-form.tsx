"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink, ArrowRight, Coins, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

// XANDsol staking is done via the official Xandeum site
const XANDSOL_STAKE_URL = "https://xandsol.xandeum.network";

// Type for stake form values
interface StakeFormValues {
  amountToStake: number | undefined;
}

// Custom resolver for form validation
const customResolver = (data: StakeFormValues) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (data.amountToStake === undefined || data.amountToStake === null) {
    errors.amountToStake = {
      type: "required",
      message: "Amount is required",
    };
  } else if (Number(data.amountToStake) <= 0) {
    errors.amountToStake = {
      type: "min",
      message: "Amount must be greater than 0",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? data : {},
    errors,
  };
};

export function StakeForm({ className }: { className?: string }) {
  // State
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [solBalance, setSolBalance] = useState("--");
  const [amountToStake, setAmountToStake] = useState<string>("");
  const [solPrice, setSolPrice] = useState<number>(0);

  // Hooks
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // Form setup
  const form = useForm<StakeFormValues>({
    defaultValues: {
      amountToStake: undefined,
    },
    mode: "onSubmit",
    resolver: customResolver,
  });

  // Fetch SOL balance
  const fetchBalance = useCallback(async () => {
    if (!connected || !publicKey || !connection) return;

    setIsLoadingBalance(true);
    try {
      const balance = await connection.getBalance(publicKey);
      const solBalanceFormatted = (balance / LAMPORTS_PER_SOL).toFixed(4);
      setSolBalance(solBalanceFormatted);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setSolBalance("0");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [connected, publicKey, connection]);

  // Fetch SOL balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setSolBalance("--");
    }
  }, [connected, publicKey, fetchBalance]);

  // Fetch SOL price from CoinGecko (no auth required)
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await res.json();
        const price = data?.solana?.usd;
        if (price) setSolPrice(parseFloat(price));
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };
    fetchPrice();
  }, []);

  // Handle max button
  const handleUseMax = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (solBalance !== "--" && parseFloat(solBalance) > 0) {
      const maxAmount = Math.max(parseFloat(solBalance) - 0.01, 0);
      setAmountToStake(maxAmount.toFixed(4));
      form.setValue("amountToStake", maxAmount, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmountToStake(value);
      const parsedValue = value === "" ? undefined : parseFloat(value);
      form.setValue("amountToStake", parsedValue, {
        shouldValidate: false,
      });
    }
  };

  // Open XANDsol staking site
  const handleStake = () => {
    window.open(XANDSOL_STAKE_URL, "_blank");
  };

  // Calculate USD value
  const usdValue = amountToStake && solPrice
    ? (parseFloat(amountToStake) * solPrice).toFixed(2)
    : "0.00";

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Stake SOL → XANDsol
        </CardTitle>
        <CardDescription>
          Liquid staking via Xandeum
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            XANDsol staking is done through the official Xandeum staking portal for the best rates and security.
          </AlertDescription>
        </Alert>

        {/* Amount Input */}
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="amountToStake"
              render={() => (
                <FormItem className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Amount to Stake</FormLabel>
                    <div className="flex items-center text-xs text-muted-foreground space-x-1">
                      <span>Balance: {isLoadingBalance ? "..." : solBalance} SOL</span>
                      {connected && solBalance !== "--" && parseFloat(solBalance) > 0 && (
                        <span
                          className="cursor-pointer px-2 text-xs text-primary hover:underline"
                          onClick={handleUseMax}
                        >
                          MAX
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0.0"
                        value={amountToStake}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        disabled={!connected}
                        className="bg-transparent border-none text-2xl font-medium focus-visible:ring-0"
                      />
                    </FormControl>
                    <div className="min-w-[100px] bg-background flex items-center p-2 rounded-md">
                      <Image
                        src="/crypto-logos/solana-logo.svg"
                        alt="SOL"
                        width={24}
                        height={24}
                        className="mr-2 rounded-full"
                      />
                      <span className="font-medium">SOL</span>
                    </div>
                  </div>
                  {amountToStake && parseFloat(amountToStake) > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ ${usdValue} USD
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* You'll Receive */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">You&apos;ll Receive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 text-2xl font-medium">
                  {amountToStake && parseFloat(amountToStake) > 0
                    ? `~${amountToStake}`
                    : "0.0"}
                </div>
                <div className="min-w-[130px] bg-background flex items-center p-2 rounded-md">
                  <div className="w-6 h-6 mr-2 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                    X
                  </div>
                  <span className="font-medium">XANDsol</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Exchange rate: 1 SOL ≈ 1 XANDsol
              </p>
            </div>

            {/* Info */}
            <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Staking Type</span>
                <span className="font-medium">Liquid Staking</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lock Period</span>
                <span className="font-medium text-green-500">None</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rewards</span>
                <span className="font-medium">Auto-compounding</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-2">
              {!connected ? (
                <ConnectWalletButton className="w-full" />
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleStake}
                  disabled={!amountToStake || parseFloat(amountToStake) <= 0}
                >
                  Stake on XANDsol
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleStake}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open XANDsol Staking Portal
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export default StakeForm;