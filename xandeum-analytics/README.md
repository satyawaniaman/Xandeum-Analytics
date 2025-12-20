# Xandeum Analytics Backend

High-performance API service that powers the Xandeum pNode Analytics Platform.

## 🎯 What It Does

1. **Syncs pNode Data** - Fetches node info from pRPC every 30 seconds
2. **Aggregates Stats** - CPU, RAM, storage, uptime, versions
3. **Geo-locates Nodes** - IP-based country/city lookup
4. **Caches Responses** - Redis caching for fast API responses
5. **Serves REST API** - Clean endpoints for the dashboard

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | [Hono](https://hono.dev) |
| ORM | [Prisma](https://prisma.io) |
| Database | PostgreSQL (DigitalOcean) |
| Cache | Redis (Upstash) |
| Validation | Zod + OpenAPI |
| Logging | Pino |
| Process Mgr | PM2 |

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/pnodes` | GET | All nodes with stats |
| `/pnodes/stats` | GET | Network summary only |
| `/pnodes/:ip` | GET | Single node details |
| `/pnodes/sync` | POST | Manual sync trigger |
| `/pnodes/cleanup` | POST | Remove stale nodes |

### Example Response

```json
GET /pnodes/stats
{
  "total": 232,
  "online": 188,
  "with_public_rpc": 37,
  "timestamp": "2025-12-20T09:10:52.468Z"
}
```

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | ✅ | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Upstash Redis token |
| `PRPC_URL` | ✅ | pRPC endpoint |
| `PORT` | ❌ | Server port (default: 3000) |
| `SYNC_TOKEN` | ❌ | Auth token for sync endpoint |

## 🚀 Quick Start

```bash
# Install
pnpm install

# Configure
cp .env.example .env

# Migrate database
pnpm migrate

# Development
pnpm dev

# Production
pnpm build && pnpm start
```

## 📦 Deployment

Deployed on DigitalOcean VM with PM2:

```bash
# On server
./deploy.sh

# Manual
pm2 restart xandeum-analytics
pm2 logs xandeum-analytics
```

## 🔄 Sync Architecture

```
Every 30 seconds:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    pRPC     │ ──▶ │    Sync     │ ──▶ │  PostgreSQL │
│ (gossip)    │     │   Service   │     │  (persist)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │    Redis    │
                    │   (cache)   │
                    └─────────────┘
```

## 📊 Database Schema

```prisma
model PNode {
  id                String    @id @default(uuid())
  ip                String    @unique
  address           String
  pubkey            String?
  version           String?
  lastSeenTimestamp BigInt?
  cpuPercent        Float?
  ramUsedBytes      BigInt?
  ramTotalBytes     BigInt?
  totalBytes        BigInt?
  uptimeSeconds     Int?
  latitude          Float?
  longitude         Float?
  country           String?
  city              String?
}
```
