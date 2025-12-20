# Xandeum pNode Analytics Platform

<video src="./xandeum-dashboard/public/video/readme-demo-video.mp4" width="100%" controls>
  Your browser does not support the video tag.
</video>

---

## ✨ Features

- **Real-time Dashboard** — Monitor 200+ pNodes with live statistics
- **Interactive Map** — Geographic distribution with clustered markers
- **Token Analytics** — XAND price, liquidity, and market trends
- **Pod Credits** — Node rankings and credit scores
- **Xandbot AI** — AI assistant trained on Xandeum docs
- **Token Swap** — Trade XAND via Jupiter integration
- **SOL Staking** — Stake SOL to receive XANDsol (liquid staking)
- **Theming** — Light, Dark, and custom Xandeum themes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     XANDEUM NETWORK                          │
│         pNodes emit heartbeats via pRPC gossip               │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │    ANALYTICS BACKEND    │
              │    (Hono + Prisma)      │
              │                         │
              │  • Sync every 30s       │
              │  • PostgreSQL storage   │
              │  • Redis caching        │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   ANALYTICS DASHBOARD   │
              │    (Next.js 16)         │
              │                         │
              │  • Real-time charts     │
              │  • Interactive map      │
              │  • Xandbot AI           │
              │  • Wallet integration   │
              └─────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Hono, Prisma, PostgreSQL, Upstash Redis |
| **Frontend** | Next.js 16, Shadcn UI, Tailwind CSS |
| **Charts** | Recharts |
| **Maps** | React Simple Maps |
| **AI** | Google Gemini (Vercel AI SDK) |
| **Wallet** | Solana Wallet Adapter |
| **Swap** | Jupiter Aggregator |

---

## 📂 Project Structure

```
xandeum-analytics/
├── xandeum-analytics/        # Backend API
│   ├── src/
│   │   ├── routes/pnodes/    # API endpoints
│   │   └── lib/              # Database & cache clients
│   ├── prisma/               # Database schema
│   └── README.md             # Backend docs
│
├── xandeum-dashboard/        # Frontend App
│   ├── app/
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── docs/             # Documentation pages
│   │   └── api/              # API routes (chat, credits)
│   ├── components/           # UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities
│   └── README.md             # Frontend docs
│
├── README.md                 # This file
└── LICENSE                   # AGPL-3.0
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- Upstash Redis account

### Backend

```bash
cd xandeum-analytics
pnpm install
cp .env.example .env
# Configure DATABASE_URL, UPSTASH_*, PRPC_URL
pnpm migrate
pnpm dev
```

### Frontend

```bash
cd xandeum-dashboard
pnpm install
cp .env.example .env.local
# Configure NEXT_PUBLIC_API_URL, GEMINI_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🔑 Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `PRPC_URL` | pRPC endpoint for node data |

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `GEMINI_API_KEY` | Google Gemini API key (for Xandbot) |

---

## 📜 License

**Source Available License** - Copyright © 2024 Aman Satyawani

This project is **NOT open source**. The source code is publicly available for viewing and educational purposes only.

**You may NOT:**
- ❌ Use for commercial purposes
- ❌ Copy, distribute, or redistribute
- ❌ Create derivative works
- ❌ Deploy as a public service

See [LICENSE](./LICENSE) for full terms.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ for the Xandeum community
</p>
