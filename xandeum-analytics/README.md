# Xandeum Analytics Backend

High-performance API service that powers the Xandeum pNode Analytics Platform.

## 🎯 Overview

The backend is responsible for:
- **Syncing pNode data** from pRPC every 30 seconds
- **Aggregating stats** (CPU, RAM, storage, uptime)
- **Geo-locating nodes** via IP lookup
- **Caching responses** in Redis (30s TTL)
- **Serving REST API** for the dashboard

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | [Hono](https://hono.dev) |
| ORM | [Prisma](https://prisma.io) |
| Database | PostgreSQL |
| Cache | Upstash Redis |
| Validation | Zod |
| Logging | Pino |
| Deployment | PM2 on DigitalOcean |

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pnodes` | GET | All nodes with stats |
| `/pnodes/stats` | GET | Network summary |
| `/pnodes/:ip` | GET | Single node details |
| `/health` | GET | Service health |

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env

# Run database migrations
pnpm migrate

# Start dev server
pnpm dev
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | ✅ | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Upstash Redis token |
| `PRPC_URL` | ✅ | pRPC endpoint |
| `PORT` | ❌ | Server port (default: 3000) |

## 📂 Project Structure

```
src/
├── index.ts              # Server entry point
├── routes/
│   └── pnodes/           # pNode API routes
│       ├── index.ts      # Route definitions
│       └── routes.ts     # Handler logic
└── lib/
    ├── prisma-client.ts  # Database client
    └── redis-client.ts   # Cache client

prisma/
├── schema.prisma         # Database schema
└── migrations/           # Migration history
```

## 🔄 Sync Process

Every 30 seconds:
1. Fetch pod list from pRPC gossip
2. Deduplicate by IP address
3. Geo-locate via ip-api.com
4. Query each node's RPC for stats
5. Upsert to PostgreSQL
6. Invalidate Redis cache

## 📦 Deployment

```bash
# SSH to server
ssh deploy@your-server

# Pull latest
git pull origin main

# Install & build
pnpm install
pnpm build

# Restart with PM2
pm2 restart xandeum-analytics
```
