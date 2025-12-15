# Xandeum pNode Analytics

Monorepo containing the analytics backend and dashboard frontend for monitoring Xandeum pNodes.

## Structure

```
├── xandeum-analytics/    # Backend API (Hono + Prisma)
└── xandeum-dashboard/    # Frontend Dashboard (Next.js + shadcn/ui)
```

## Setup

### Backend (xandeum-analytics)

```bash
cd xandeum-analytics
pnpm install
cp .env.example .env  # Configure environment variables
pnpm dev
```

### Frontend (xandeum-dashboard)

```bash
cd xandeum-dashboard
pnpm install
pnpm dev
```

## Deployment

- **Backend**: Deployed on Digital Ocean (Docker)
- **Frontend**: Deploy on Vercel with root directory set to `xandeum-dashboard`
