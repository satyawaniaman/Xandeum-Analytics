import { PublicKey } from "@solana/web3.js";

// Jupiter Ultra API (requires API key)
export const JUP_ULTRA_API = "https://lite.jup.ag/ultra/v1";
// Standard Jupiter API (v6) - Updated to v1 per user requirement for Ultra Swap
export const JUP_API = "https://api.jup.ag/swap/v1";

// API Key for Ultra Swap
export const JUP_API_KEY = process.env.NEXT_PUBLIC_JUP_SWAP_V1_API_KEY || "";

export const JUP_REFERRAL_ADDRESS = "JUPTRFXx5qe2wMFBtC7c7s6DvS3weDgAZu7Lr4ZKtoQ";

export const DEFAULT_OPTIONS = {
  SLIPPAGE_BPS: 50, // 0.5%
};

export const TOKENS = {
  // Native SOL (wrapped)
  SOL: new PublicKey("So11111111111111111111111111111111111111112"),
  // Xandeum Token
  XAND: new PublicKey("XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx"),
  // USD Coin
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  // Tether USD
  USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")
};

// Token decimals lookup (for tokens not yet queried on-chain)
export const TOKEN_DECIMALS: Record<string, number> = {
  // SOL (wrapped)
  "So11111111111111111111111111111111111111112": 9,
  // XAND (assuming 9 decimals like SOL - update if different)
  "XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx": 9,
  // USDC
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 6,
  // USDT
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": 6,
};