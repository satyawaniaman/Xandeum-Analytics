# Production Readiness Checklist

This document outlines the steps and considerations for deploying the Xandeum Analytics API to production.

## ✅ Completed Items

### Security

- [x] Environment variables moved to `.env` file (not committed to git)
- [x] `.env.example` file created for documentation
- [x] JWT_SECRET validation at startup
- [x] Redis credentials using environment variables (Upstash)
- [x] CORS configuration with environment-based origins
- [x] Docker secrets support ready

### Code Quality

- [x] TypeScript strict mode enabled
- [x] ESLint and Prettier configured
- [x] Pre-commit hooks with Husky
- [x] Lint-staged for automated checks
- [x] Proper logging client (Pino) implemented
- [x] Zod schemas for API validation

### Database

- [x] Prisma ORM configured
- [x] PostgreSQL as primary database
- [x] Migration system in place
- [x] Connection pooling via Prisma
- [x] Docker health checks for database

### Caching

- [x] Upstash Redis REST API integration
- [x] Cache TTL implemented (30 seconds for pnodes list)
- [x] No connection management needed (REST-based)

### Infrastructure

- [x] Docker containerization
- [x] Docker Compose for local development
- [x] Multi-stage initialization script
- [x] Health checks for dependencies

## 🔧 Issues Fixed

### Critical Fixes

1. **Redis Client**: Fixed Upstash Redis SDK implementation

   - Removed incompatible `redis` package methods
   - Removed manual connection management
   - Fixed import/export inconsistencies

2. **Environment Variables**: Added comprehensive validation

   - All required variables checked at startup
   - Clear error messages for missing variables
   - PORT configuration from environment

3. **Logging**: Replaced console.log/error with structured logging
   - Using Pino logger throughout
   - Proper log levels (info, warn, error)
   - Structured log formatting

## ⚠️ Items Requiring Attention

### High Priority

#### 1. Prisma Schema Warning

**Issue**: Prisma v6+ deprecation warning about `url` in schema.prisma

```
The datasource property `url` is no longer supported in schema files
```

**Status**: Warning only - still functional but should be updated
**Action Required**:

- Consider upgrading to Prisma 7 schema format when stable
- Current setup works fine for production with Prisma 6.x

#### 2. Remove Unused Dependencies

```json
"redis": "^4.7.0"  // Not needed - using @upstash/redis
```

**Action Required**:

```bash
pnpm remove redis
```

#### 3. Error Handling in Routes

**Current**: Basic error handling
**Recommended**: Add global error middleware
**Action Required**: See "Recommended Improvements" section

#### 4. Rate Limiting

**Current**: None implemented
**Recommended**: Add rate limiting middleware
**Risk**: API abuse, DDoS attacks
**Action Required**: Implement rate limiting (see below)

### Medium Priority

#### 5. API Authentication

**Current**: JWT_SECRET defined but no auth middleware on routes
**Note**: POST /pnodes/sync is unprotected
**Action Required**: Add authentication middleware or API key for sync endpoint

#### 6. Monitoring & Observability

**Current**: Basic console logging
**Missing**:

- Application Performance Monitoring (APM)
- Error tracking (e.g., Sentry)
- Metrics collection (e.g., Prometheus)
- Health check endpoint

#### 7. Database Connection URL in Docker

**Current**: Using local Redis in docker-compose, but code uses Upstash
**Issue**: CACHE_URL in docker-compose is defined but not used
**Action Required**: Remove CACHE_URL from docker-compose or use it consistently

#### 8. Graceful Shutdown

**Current**: No graceful shutdown handling
**Risk**: In-flight requests may fail during deployment
**Action Required**: Implement graceful shutdown

### Low Priority

#### 9. API Documentation

**Current**: OpenAPI schema defined but not serving UI
**Action Required**: Add Swagger UI or Scalar for API documentation

#### 10. Testing

**Current**: No tests present
**Recommended**: Add unit and integration tests
**Tools**: Vitest, Supertest

#### 11. CI/CD Pipeline

**Current**: GitHub Actions directory exists but files not reviewed
**Action Required**: Verify CI/CD pipeline configuration

## 🚀 Recommended Improvements

### 1. Add Global Error Handler

Create `src/middleware/error-handler.ts`:

```typescript
import { Context } from "hono";
import logger from "../lib/loggin-client";

export async function errorHandler(err: Error, c: Context) {
  logger.error({ err, path: c.req.path }, "Request error");

  const status = err.name === "ValidationError" ? 400 : 500;

  return c.json(
    {
      error:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
      status,
    },
    status,
  );
}
```

### 2. Add Rate Limiting

```typescript
import { rateLimiter } from "hono-rate-limiter";

app.use(
  "*",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);
```

### 3. Add Health Check Endpoint

```typescript
app.get("/health", async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    return c.json({ status: "healthy", timestamp: new Date().toISOString() });
  } catch (error) {
    return c.json({ status: "unhealthy", error: error.message }, 503);
  }
});
```

### 4. Implement Graceful Shutdown

```typescript
const server = serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});
```

### 5. Protect Sync Endpoint

Add to `src/routes/pnodes/route.ts`:

```typescript
import { bearerAuth } from "hono/bearer-auth";

const SYNC_TOKEN = process.env.SYNC_API_TOKEN;

app.post("/sync", bearerAuth({ token: SYNC_TOKEN }), async (c) => {
  // ... existing code
});
```

### 6. Add Request ID and Correlation

```typescript
import { requestId } from "hono/request-id";

app.use("*", requestId());
```

## 📋 Environment Variables Checklist

Ensure all these are set in production:

### Required

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `UPSTASH_REDIS_REST_URL` - Upstash Redis REST endpoint
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- [ ] `JWT_SECRET` - Strong random string (min 32 chars)
- [ ] `PRPC_URL` - pRPC endpoint URL

### Recommended

- [ ] `PORT` - Server port (default: 3000)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `LOG_LEVEL` - Set to `info` or `warn` in production
- [ ] `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- [ ] `SYNC_API_TOKEN` - Token for protecting /sync endpoint

## 🔐 Security Checklist

- [ ] All secrets in environment variables (not hardcoded)
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enforced (handled by reverse proxy/load balancer)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints (Zod schemas)
- [ ] SQL injection protected (Prisma ORM)
- [ ] Dependency vulnerabilities checked (`pnpm audit`)
- [ ] Container runs as non-root user (update Dockerfile)
- [ ] Sensitive data not logged

## 🐳 Docker Production Considerations

### Current Dockerfile Issues

- Running as root user (security risk)
- No multi-stage build (larger image)
- Installing dev dependencies

### Recommended Dockerfile Updates

```dockerfile
FROM node:20-slim AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
WORKDIR /app
COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/package.json ./
COPY --from=builder --chown=hono:nodejs /app/prisma ./prisma
USER hono
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 📊 Monitoring Recommendations

### Metrics to Track

- Request rate
- Response times (p50, p95, p99)
- Error rate (4xx, 5xx)
- Database query performance
- Redis cache hit rate
- Active connections
- Memory usage
- CPU usage

### Logging Best Practices

- Use structured logging (already using Pino ✓)
- Include correlation IDs
- Log all errors with context
- Don't log sensitive data (passwords, tokens)
- Use appropriate log levels

## 🧪 Testing Recommendations

### Unit Tests

- Business logic in services
- Utility functions
- Schema validations

### Integration Tests

- API endpoints
- Database operations
- External service calls (pRPC)

### E2E Tests

- Critical user flows
- Sync operations
- Error scenarios

## 📝 Documentation Needs

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Setup instructions for new developers
- [ ] Deployment guide
- [ ] Architecture diagram
- [ ] Database schema documentation
- [ ] Troubleshooting guide

## 🚀 Deployment Steps

1. **Pre-deployment**

   - Run tests
   - Check for dependency vulnerabilities
   - Review environment variables
   - Database backup

2. **Deployment**

   - Build Docker image
   - Tag with version
   - Push to registry
   - Pull on production server
   - Run database migrations
   - Start new container
   - Health check verification

3. **Post-deployment**
   - Monitor error rates
   - Check logs
   - Verify functionality
   - Monitor performance metrics

## 🔄 Maintenance Tasks

### Daily

- Monitor error logs
- Check performance metrics

### Weekly

- Review security alerts
- Check dependency updates
- Database performance review

### Monthly

- Security audit
- Dependency updates
- Performance optimization review
- Cost optimization review

## 📞 Support & Incident Response

### Key Contacts

- DevOps: [Add contact]
- Backend Lead: [Add contact]
- On-call: [Add rotation]

### Runbooks

- [ ] Service restart procedure
- [ ] Database rollback procedure
- [ ] Cache invalidation procedure
- [ ] Incident response workflow

---

**Last Updated**: [Current Date]
**Reviewed By**: [Name]
**Next Review**: [Date]
