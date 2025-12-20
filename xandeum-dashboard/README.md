# Xandeum Analytics Dashboard

Modern web dashboard for monitoring the Xandeum pNode network in real-time.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Real-time Stats** | Live node counts with animated number tickers |
| **Interactive Map** | World map with clustered node markers |
| **Node Monitoring** | Searchable list with detailed node pages |
| **Token Analytics** | XAND price and liquidity charts |
| **Pod Credits** | Node rankings and credit scores |
| **Xandbot AI** | AI assistant trained on Xandeum docs |
| **Token Swap** | Trade XAND via Jupiter integration |
| **SOL Staking** | Stake SOL for XANDsol with rewards calculator |
| **Theming** | Light, Dark, System, and Xandeum themes |

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | Shadcn UI + Radix |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Maps | React Simple Maps |
| State | TanStack Query + Zustand |
| AI | Vercel AI SDK + Gemini |
| Wallet | Solana Wallet Adapter |

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `GEMINI_API_KEY` | Google Gemini API key (for Xandbot) |

## 📂 Project Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Main overview
│   ├── nodes/page.tsx        # Node list
│   ├── nodes/[address]/      # Node details
│   ├── network/page.tsx      # Analytics
│   ├── trade/page.tsx        # Swap interface
│   └── stake/page.tsx        # SOL staking
├── docs/                     # Documentation pages
└── api/                      # API routes

components/
├── dashboard/                # Feature components
│   ├── node-map.tsx          # Interactive map
│   ├── stat-card.tsx         # Animated cards
│   └── credits-card.tsx      # Credit display
├── ai-chat-drawer.tsx        # Xandbot UI
└── ui/                       # Shadcn components

hooks/
├── use-pnodes.ts             # Node data
├── use-xandeum-token.ts      # Token data
└── use-pod-credits.ts        # Credits data
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview with map & KPIs |
| `/dashboard/nodes` | Full node list |
| `/dashboard/nodes/:ip` | Node details |
| `/dashboard/network` | Charts & analytics |
| `/dashboard/trade` | Token swap |
| `/dashboard/stake` | SOL staking for XANDsol |
| `/docs` | Platform documentation |

## 🎨 Theming

Access via navbar settings:
- **Light** — Clean white interface
- **Dark** — Dark mode
- **System** — Follows OS preference
- **Xandeum** — Custom brand colors

## 📦 Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

Deploy on Vercel, Railway, or any Node.js host.
