# Deployment Checklist - Improvements v2.0.0

**Date:** January 2025  
**Status:** Ready to Deploy  
**Estimated Time:** 10-15 minutes

---

## 📋 Pre-Deployment Checklist

Before you begin, ensure you have:

- [ ] Access to production server/environment
- [ ] Database backup completed
- [ ] `.env` file access
- [ ] Ability to restart services
- [ ] ~15 minutes of maintenance window

---

## 🚀 Deployment Steps

### Step 1: Update Dependencies (2 minutes)

```bash
cd xandeum-analytics
pnpm install
```

**Expected Output:**

```
✓ All dependencies installed
✓ p-limit@6.1.0 added
```

**Verify:**

```bash
grep "p-limit" package.json
# Should show: "p-limit": "^6.1.0"
```

---

### Step 2: Update Environment Variables (1 minute)

Add to your `.env` file:

```bash
# Generate a secure token
SYNC_TOKEN=$(openssl rand -hex 32)

# Or manually set
SYNC_TOKEN=your_secure_token_here_min_32_chars
```

**Verify:**

```bash
grep SYNC_TOKEN .env
# Should show your token
```

**⚠️ Important:** Save this token! You'll need it to manually trigger syncs.

---

### Step 3: Create Database Migration (2 minutes)

```bash
# Generate migration for new indexes
pnpm run migrate:dev

# When prompted, name it: "add_performance_indexes"
```

**Expected Output:**

```
✔ Migration created successfully
✔ Applied 1 migration
```

**Verify Migration:**

```bash
ls prisma/migrations/
# Should see new migration folder
```

**Alternative (Production):**

```bash
# If using production database directly
pnpm run migrate
```

---

### Step 4: Regenerate Prisma Client (1 minute)

```bash
pnpm run generate
```

**Expected Output:**

```
✔ Generated Prisma Client
```

---

### Step 5: Type Check & Build (2 minutes)

```bash
# Check for TypeScript errors
pnpm run type-check

# Build the project
pnpm run build
```

**Expected Output:**

```
✔ Type checking passed
✔ Build completed successfully
dist/ directory created
```

---

### Step 6: Restart Service (1 minute)

#### Option A: Docker Compose

```bash
docker-compose down
docker-compose up -d

# Watch logs
docker logs -f xandeum-analytics
```

#### Option B: PM2

```bash
pm2 restart xandeum-analytics
pm2 logs xandeum-analytics
```

#### Option C: Systemd

```bash
sudo systemctl restart xandeum-analytics
sudo journalctl -u xandeum-analytics -f
```

**Expected in Logs:**

```
Server is running on http://0.0.0.0:3000
Starting automated sync service...
Running initial sync...
Automated sync enabled: running every 30 seconds
```

---

## ✅ Post-Deployment Verification

### Test 1: Health Check (Critical)

```bash
curl http://localhost:3000/health
```

**Expected Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "prpc": "configured"
  },
  "uptime": 5,
  "version": "2.0.0"
}
```

**✅ Pass Criteria:** `status: "healthy"` and all services show `"ok"`

---

### Test 2: Quick Stats Endpoint (New Feature)

```bash
curl http://localhost:3000/pnodes/stats
```

**Expected Response:**

```json
{
  "total": 100,
  "online": 85,
  "with_public_rpc": 20,
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

**✅ Pass Criteria:** Returns valid statistics

---

### Test 3: Full Node List (Breaking Change Check)

```bash
curl http://localhost:3000/pnodes
```

**Expected Response Structure:**

```json
{
  "summary": {
    "total": 100,
    "online_public": 20,
    "online_private": 65,
    "offline": 10,
    "unknown": 5
  },
  "nodes": [
    {
      "id": "...",
      "address": "...",
      "status": "online_public",
      "isOnline": true,
      "hasPublicRpc": true
    }
  ],
  "timestamp": "..."
}
```

**✅ Pass Criteria:** Response has `summary` and `nodes` fields

---

### Test 4: Protected Sync Endpoint

```bash
# Test WITHOUT token (should fail)
curl -X POST http://localhost:3000/pnodes/sync

# Test WITH token (should succeed)
curl -X POST http://localhost:3000/pnodes/sync \
  -H "Authorization: Bearer YOUR_SYNC_TOKEN"
```

**Expected Response (with token):**

```json
{
  "ok": true,
  "timestamp": "2025-01-15T12:00:00.000Z",
  "message": "Sync completed successfully"
}
```

**✅ Pass Criteria:**

- Without token: 401 Unauthorized
- With token: 200 OK with success message

---

### Test 5: Automated Sync (Monitor Logs)

```bash
# Watch logs for 60 seconds
docker logs -f xandeum-analytics | grep "Sync complete"

# Or
tail -f /var/log/xandeum-analytics.log | grep "Sync complete"
```

**Expected Output (every 30 seconds):**

```
Running scheduled sync...
Sync complete in 5.23s {"total":100,"success":20,"failed":80,"successRate":"20.0%","durationMs":5234}
```

**✅ Pass Criteria:**

- Sync runs automatically every 30 seconds
- Completes in 5-10 seconds
- Success rate 15-25%

---

### Test 6: Performance Verification

Monitor one complete sync cycle:

```bash
# Start time
date

# Trigger manual sync
curl -X POST http://localhost:3000/pnodes/sync \
  -H "Authorization: Bearer YOUR_SYNC_TOKEN"

# End time
date
```

**✅ Pass Criteria:**

- Sync completes in < 10 seconds
- No timeout errors
- Success rate > 15%

---

## 🔍 Troubleshooting

### Issue: Type errors during build

**Solution:**

```bash
rm -rf node_modules dist
pnpm install
pnpm run generate
pnpm run build
```

---

### Issue: Migration fails

**Solution:**

```bash
# Check current migration status
pnpm dlx prisma migrate status

# If needed, reset (⚠️ DESTRUCTIVE)
pnpm dlx prisma migrate reset

# Then run migration again
pnpm run migrate:dev
```

---

### Issue: Health check shows unhealthy

**Check each service individually:**

```bash
# Test database
pnpm dlx prisma db execute --stdin <<< "SELECT 1"

# Test Redis
curl $UPSTASH_REDIS_REST_URL -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"

# Test pRPC
curl -X POST $PRPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"get-pods","params":[]}'
```

---

### Issue: Automated sync not running

**Check logs for errors:**

```bash
docker logs xandeum-analytics 2>&1 | grep -i error

# Restart service
docker-compose restart
```

---

### Issue: Sync taking too long (>15 seconds)

**Possible causes:**

- Network latency to pNodes
- Database slow queries
- Too many concurrent requests

**Solution:**

```bash
# Reduce concurrency in src/lib/pnode-sync.ts
# Change: batchGetStats(addresses, 15)
# To: batchGetStats(addresses, 10)

# Rebuild and restart
pnpm run build
docker-compose restart
```

---

## 🔄 Rollback Plan

If deployment fails, rollback using:

### Option 1: Git Rollback

```bash
git stash
git checkout <previous-commit-hash>
pnpm install
pnpm run build
docker-compose restart
```

### Option 2: Database Rollback

```bash
# Revert last migration
pnpm dlx prisma migrate resolve --rolled-back <migration-name>
```

---

## 📊 Monitoring (First 24 Hours)

### Key Metrics to Watch:

1. **Sync Performance**

   - Duration: Should be 5-10 seconds
   - Success rate: Should be 15-25%
   - Frequency: Every 30 seconds

2. **API Response Times**

   - `/pnodes`: < 100ms (cached)
   - `/pnodes/stats`: < 50ms (cached)
   - `/health`: < 50ms

3. **Error Rates**

   - Should remain < 1% for API endpoints
   - Sync failures at ~75-80% are expected (closed RPC ports)

4. **Database Performance**

   - Query times should be faster with new indexes
   - Monitor slow query log

5. **Redis Cache Hit Rate**
   - Should be > 90% for `/pnodes` endpoint

---

## 🎯 Success Criteria

Deployment is successful when ALL of the following are true:

- [x] Health check returns "healthy"
- [x] Automated sync runs every 30 seconds
- [x] Sync completes in < 10 seconds
- [x] Protected sync requires token
- [x] New API response structure works
- [x] No critical errors in logs
- [x] Database migrations applied
- [x] Frontend still functional (if deployed)

---

## 📝 Post-Deployment Tasks

### Update Frontend (if applicable)

The API response structure changed. Update frontend code:

```typescript
// Before
const nodes = await fetch("/pnodes").then((r) => r.json());

// After
const { nodes, summary, timestamp } = await fetch("/pnodes").then((r) =>
  r.json(),
);
```

### Update Monitoring

Configure monitoring tools to use `/health` endpoint:

```yaml
# Example: Docker Compose health check
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Update Documentation

Add SYNC_TOKEN to team documentation:

- Where to find it
- How to use it
- Who has access

---

## 🎉 Deployment Complete!

If all tests pass, your deployment is successful!

**Next Steps:**

1. Monitor logs for 1 hour
2. Check performance metrics
3. Update frontend if needed
4. Document any custom configuration
5. Celebrate! 🚀

---

**Deployment Time:** ~10-15 minutes  
**Risk Level:** Low (with rollback plan)  
**Breaking Changes:** API response structure (easy to migrate)  
**Performance Gain:** 75% faster sync times

---

**Questions?** See `IMPROVEMENTS_SUMMARY.md` for quick reference or `IMPROVEMENTS_IMPLEMENTATION.md` for full details.
