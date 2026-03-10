# PrivacyLens Backend API — Walkthrough

## What Was Built

A complete, production-ready backend API for the **PrivacyLens** Android cybersecurity application, using **TypeScript + Fastify + PostgreSQL + Redis + MinIO + OpenSearch**.

## Project Structure

```
src/
├── config/
│   ├── env.ts           ← Centralized environment config
│   ├── logger.ts        ← Pino logger (pretty dev / JSON prod)
│   ├── database.ts      ← PostgreSQL pool + query helpers
│   ├── redis.ts         ← Redis client + cache helper
│   └── minio.ts         ← MinIO object storage client
├── db/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  ← 7 tables, indexes, triggers
│   ├── migrate.ts       ← Migration runner with tracking
│   └── seed.ts          ← Sample data (domains, IPs, apps, alerts)
├── middleware/
│   ├── auth.ts          ← JWT plugin + authenticate decorator
│   └── rateLimit.ts     ← Redis-backed rate limiter
├── schemas/
│   └── validation.ts    ← Zod schemas for all request bodies
├── routes/
│   ├── auth.ts          ← POST /register, POST /refresh
│   ├── threat.ts        ← POST /domain, POST /ip
│   ├── blocklists.ts    ← GET /domains, GET /ips
│   ├── apps.ts          ← GET /reputation/:package_name
│   ├── geoip.ts         ← POST /lookup
│   ├── reports.ts       ← POST /upload, GET /history
│   ├── alerts.ts        ← GET /explain/:alert_code
│   ├── updates.ts       ← GET /check
│   └── permissions.ts   ← App permissions management
└── server.ts            ← Fastify app bootstrap
```

## API Endpoints (15 total)

| Method | Endpoint                         | Auth | Description                 |
|--------|----------------------------------|------|-----------------------------|
| POST   | `/v1/auth/register`              | ❌    | Register device → JWT       |
| POST   | `/v1/auth/refresh`               | ❌    | Refresh access token        |
| POST   | `/v1/threat/domain`              | ✅    | Domain reputation check     |
| POST   | `/v1/threat/ip`                  | ✅    | IP reputation check         |
| GET    | `/v1/blocklists/domains`         | ✅    | Tracker domain blocklist    |
| GET    | `/v1/blocklists/ips`             | ✅    | Malicious IP blocklist      |
| GET    | `/v1/apps/reputation/:pkg`       | ✅    | App privacy score           |
| POST   | `/v1/geoip/lookup`               | ✅    | GeoIP lookup                |
| POST   | `/v1/reports/upload`             | ✅    | Upload privacy report       |
| GET    | `/v1/reports/history`            | ✅    | Get report history          |
| GET    | `/v1/alerts/explain/:code`       | ✅    | Alert explanation           |
| GET    | `/v1/updates/check`              | ✅    | Intelligence version check  |
| GET    | `/v1/permissions/:package_name`  | ✅    | Get app permissions        |
| POST   | `/v1/permissions/request`        | ✅    | Update app permissions     |
| GET    | `/health`                        | ❌    | Health check                |

## Docker Services (6 containers)

| Container         | Image                          | Port(s)     |
|-------------------|--------------------------------|-------------|
| privacylens-api   | Custom (Node 20 Alpine)        | 3000        |
| privacylens-postgres | PostgreSQL 16 Alpine        | 5432        |
| privacylens-redis | Redis 7 Alpine                 | 6379        |
| privacylens-minio | MinIO latest                   | 9000, 9001  |
| privacylens-opensearch | OpenSearch 2.12            | 9200, 9600  |

## Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Redis-backed rate limiting (100 req/min)
- ✅ Helmet security headers
- ✅ Zod input validation on all endpoints
- ✅ Parameterized SQL queries (injection protection)
- ✅ CORS configuration
- ✅ Non-root Docker container
- ✅ Graceful shutdown handling

## Verification

- **TypeScript compilation**: ✅ Passes with zero errors
- **Dependencies installed**: ✅ All packages resolved
- **Swagger docs**: Available at `/docs` endpoint
