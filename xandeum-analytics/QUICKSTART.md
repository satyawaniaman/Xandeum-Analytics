# Xandeum Analytics - Quick Start Guide

> **Status:** ✅ Production Ready

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Upstash Redis account (or Redis server)
- pnpm installed (`npm install -g pnpm`)

## Quick Start (Development)

### 1. Clone and Install

```bash
cd xandeum-analytics
pnpm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```bash
# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/xandeum_analytics
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
JWT_SECRET=your_super_secret_key_min_32_chars
PRPC_URL=http://173.212.203.145:6000/rpc

# Optional
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Set Up Database

```bash
# Run migrations
pnpm run migrate:dev

# Generate Prisma client
pnpm run generate
```

### 4. Start Development Server

```bash
pnpm run dev
```

Server will start at `http://localhost:3000`

## Quick Start (Production with Docker)

### 1. Prepare Environment

```bash
cp .env.example .env
# Edit .env with production values
```

### 2. Build and Deploy

```bash
# Build image
docker build -t xandeum-analytics:latest .

# Run with docker-compose (includes PostgreSQL and Redis)
docker-compose up -d

# Or run standalone (requires external DB and Redis)
docker run -d \
  --name xandeum-analytics \
  -p 3000:3000 \
  --env-file .env \
  xandeum-analytics:latest
```

### 3. Verify Deployment

```bash
# Check logs
docker logs -f xandeum-analytics

# Test API
curl http://localhost:3000/pnodes
```

## API Endpoints

### GET `/pnodes`

Get list of pNodes (cached for 30 seconds)

```bash
curl http://localhost:3000/pnodes
```

**Response:**

```json
[
  {
    "id": "...",
    "address": "123.45.67.89:8000",
    "pubkey": "...",
    "version": "1.0.0",
    "lastSeenTimestamp": 1234567890,
    "lastSeen": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST `/pnodes/sync`

Manually trigger sync from pRPC to database

```bash
curl -X POST http://localhost:3000/pnodes/sync
```

**Response:**

```json
{
  "ok": true
}
```

⚠️ **Security Note:** This endpoint should be protected with authentication in production!

### GET `/openapi`

OpenAPI specification

```bash
curl http://localhost:3000/openapi
```

## Common Tasks

### Run Database Migrations

```bash
# Development
pnpm run migrate:dev

# Production
pnpm run migrate
```

### Sync pNodes Data

```bash
# Via API
curl -X POST http://localhost:3000/pnodes/sync

# Via script
pnpm run db:seed
```

### Build for Production

```bash
pnpm run build
pnpm run start
```

### Check Code Quality

```bash
# Type check
pnpm run type-check

# Lint
pnpm run lint

# Format
pnpm run format
```

## Environment Variables Reference

### Required

| Variable                   | Description                           | Example                                    |
| -------------------------- | ------------------------------------- | ------------------------------------------ |
| `DATABASE_URL`             | PostgreSQL connection string          | `postgresql://user:pass@localhost:5432/db` |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST endpoint           | `https://your-redis.upstash.io`            |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authentication token    | `AXXXabc...`                               |
| `JWT_SECRET`               | Secret for JWT signing (min 32 chars) | `your-super-secret-key`                    |
| `PRPC_URL`                 | pRPC endpoint URL                     | `http://host:6000/rpc`                     |

### Optional

| Variable          | Description                           | Default       |
| ----------------- | ------------------------------------- | ------------- |
| `PORT`            | Server port                           | `3000`        |
| `NODE_ENV`        | Environment (development/production)  | `development` |
| `LOG_LEVEL`       | Logging level (debug/info/warn/error) | `info`        |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins          | `[]`          |

## Troubleshooting

### "Missing required environment variable"

**Solution:** Check that all required environment variables are set in your `.env` file.

### "Redis Client Error"

**Solution:**

- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are correct
- Check Upstash dashboard for connection details
- Ensure Redis instance is active

### "Prisma Client Error"

**Solution:**

```bash
# Regenerate Prisma client
pnpm run generate

# Reset database (WARNING: deletes all data)
pnpm dlx prisma migrate reset
```

### "Cannot connect to database"

**Solution:**

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings
- Test connection: `psql $DATABASE_URL`

### Port already in use

**Solution:**

```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Production Checklist

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] `NODE_ENV=production`
- [ ] Strong `JWT_SECRET` (min 32 random characters)
- [ ] Database backups configured
- [ ] Monitoring/logging set up
- [ ] CORS origins configured
- [ ] Rate limiting implemented (recommended)
- [ ] Health checks configured
- [ ] SSL/HTTPS enabled (via reverse proxy)

## Performance Tips

1. **Redis Caching:** Adjust TTL based on data freshness needs
2. **Database Indexes:** Review slow queries and add indexes
3. **Connection Pooling:** Prisma handles this automatically
4. **Load Balancing:** Use multiple instances behind a load balancer
5. **Monitoring:** Track response times and error rates

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` by default
2. **Use strong secrets** - Generate with: `openssl rand -base64 32`
3. **Enable HTTPS** - Use a reverse proxy (nginx, Caddy, Traefik)
4. **Implement rate limiting** - Protect against abuse
5. **Add authentication** - Especially for `/sync` endpoint
6. **Keep dependencies updated** - Run `pnpm audit` regularly
7. **Monitor logs** - Set up alerting for errors

## Getting Help

- **Documentation:** See `PRODUCTION_CHECKLIST.md` for detailed guide
- **API Docs:** Visit `/openapi` endpoint when server is running
- **Issues:** Check logs with `docker logs` or `pnpm run dev`

## Next Steps

After getting started:

1. Review `PRODUCTION_READY_SUMMARY.md` for production recommendations
2. Implement recommended security enhancements
3. Set up monitoring and alerting
4. Configure automated backups
5. Create deployment automation/CI-CD

---

**Happy deploying! 🚀**
