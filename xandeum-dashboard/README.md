# Xandeum Analytics Dashboard

Modern, responsive web dashboard for monitoring the Xandeum pNode network.

## ✨ Features

### 📊 Network Overview
- Real-time node statistics with animated counters
- Interactive world map with clustered markers
- Status distribution charts
- Network health gauge

### 🖥️ Node Monitoring
- Searchable, filterable node list
- Individual node detail pages
- Performance metrics (CPU, RAM, storage)
- Version and uptime tracking

### 💰 Token Analytics
- Live XAND price from DexScreener
- 24h price/liquidity charts
- Swap interface (Jupiter-powered)
- Wallet connection (Phantom, Solflare)

### 🏆 Pod Credits
- Credit score display on node details
- Network rank (#X of Y nodes)
- Performance tier badges
- Top performers leaderboard

### 🤖 Xandbot AI Assistant
- Powered by Google Gemini
- Trained on official Xandeum docs
- Real-time network context
- Rate limited (10 req/min)

### 🎨 Theming
- Light / Dark / System modes
- Custom Xandeum brand theme
- Mobile-responsive design

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | Shadcn UI + Radix |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Maps | React Simple Maps |
| State | TanStack Query + Zustand |
| Animation | Framer Motion |
| AI | Vercel AI SDK + Gemini |
| Wallet | Solana Wallet Adapter |

## 📁 Project Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Main overview
│   ├── nodes/
│   │   ├── page.tsx          # Node list
│   │   └── [address]/page.tsx  # Node details
│   ├── network/page.tsx      # Network analytics
│   └── trade/page.tsx        # Swap interface
└── api/
    ├── chat/route.ts         # Xandbot API
    ├── pod-credits/route.ts  # Credits proxy
    └── proxy/route.ts        # Backend proxy

components/
├── dashboard/
│   ├── node-map.tsx          # Interactive map
│   ├── stat-card.tsx         # Animated stats
│   ├── credits-card.tsx      # Credit score
│   └── mini-nodes-table.tsx  # Top performers
├── ai-chat-drawer.tsx        # Xandbot drawer
└── ui/                       # Shadcn components

hooks/
├── use-pnodes.ts             # Node data hook
├── use-xandeum-token.ts      # Token data hook
└── use-pod-credits.ts        # Credits hook
```

## ⚙️ Environment Variables

Create `.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-api.com

# Gemini API Key (for Xandbot)
GEMINI_API_KEY=your-gemini-api-key
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
pnpm start
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing / redirect |
| `/dashboard` | Main overview with map |
| `/dashboard/nodes` | Full node list |
| `/dashboard/nodes/:ip` | Node details |
| `/dashboard/network` | Charts & analytics |
| `/dashboard/trade` | Token swap |

## 🎨 Theming

Switch themes via the navbar toggle:

- **Light** - Clean white UI
- **Dark** - Dark mode
- **System** - Follow OS preference
- **Xandeum** - Custom brand colors with background

## 🤖 Xandbot Configuration

Xandbot uses the Vercel AI SDK with Google Gemini:

```typescript
// app/api/chat/route.ts
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const model = google('gemini-2.0-flash');
```

To change models (if hitting quota):
- `gemini-1.5-flash` - More available quota
- `gemini-1.5-pro` - Higher quality

## 📦 Deployment

Deploy on Vercel (recommended) or any Node.js host:

```bash
# Build
pnpm build

# Start production server
pnpm start
```

Required env vars on host:
- `NEXT_PUBLIC_API_URL`
- `GEMINI_API_KEY`
