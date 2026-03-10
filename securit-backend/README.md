# PrivacyLens Backend API

> Real-Time Behavioral Privacy Intelligence — Backend API Server

## Tech Stack

| Component  | Technology               | Purpose                       |
|------------|--------------------------|-------------------------------|
| API Server | Node.js + Fastify + TS   | REST API endpoints            |
| Database   | PostgreSQL               | Primary data store            |
| Cache      | Redis                    | Rate limiting + query caching |
| Queue      | Apache Kafka             | Async event processing        |
| Storage    | MinIO                    | Object/report storage         |
| Search     | OpenSearch               | Full-text intelligence search |
| Hosting    | **Vercel**               | Serverless deployment         |

## Quick Start

### Local Development
```bash
npm install
cp .env.example .env    # Edit with your local DB/Redis connections
npm run dev             # Start dev server at http://localhost:3000
```

### Database Setup
```bash
npm run migrate   # Run SQL migrations
npm run seed      # Seed sample data
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel            # Follow prompts, set env vars in Vercel dashboard
```

> **Environment Variables**: Set all values from `.env.example` in the Vercel project settings dashboard. Use managed PostgreSQL (e.g., Neon, Supabase) and managed Redis (e.g., Upstash) for production.

## API Endpoints

| Method | Endpoint                         | Auth | Description                 |
|--------|----------------------------------|------|-----------------------------|
| POST   | `/v1/auth/register`              | No   | Register device → JWT       |
| POST   | `/v1/auth/refresh`               | No   | Refresh access token        |
| POST   | `/v1/threat/domain`              | JWT  | Domain reputation check     |
| POST   | `/v1/threat/ip`                  | JWT  | IP reputation check         |
| GET    | `/v1/blocklists/domains`         | JWT  | Tracker domain blocklist    |
| GET    | `/v1/blocklists/ips`             | JWT  | Malicious IP blocklist      |
| GET    | `/v1/apps/reputation/:pkg`       | JWT  | App privacy score & SDKs    |
| POST   | `/v1/geoip/lookup`               | JWT  | GeoIP lookup                |
| POST   | `/v1/reports/upload`             | JWT  | Upload privacy report       |
| GET    | `/v1/reports/history`            | JWT  | Report history              |
| GET    | `/v1/alerts/explain/:code`       | JWT  | Alert explanation           |
| GET    | `/v1/updates/check`              | JWT  | Intelligence version check  |
| GET    | `/health`                        | No   | Health check                |

Swagger UI: `http://localhost:3000/docs`

## Project Structure

```
src/
├── config/          # env, database, redis, kafka, minio, logger
├── db/
│   ├── migrations/  # SQL schema (7 tables)
│   ├── migrate.ts   # Migration runner
│   └── seed.ts      # Sample data seeder
├── middleware/       # JWT auth, Redis rate limiting
├── routes/          # 8 route modules (13 endpoints)
├── schemas/         # Zod validation schemas
└── server.ts        # Fastify server + Vercel handler
vercel.json          # Vercel deployment config
```

## Security

- JWT authentication on all protected endpoints
- Redis-backed rate limiting (100 req/min)
- Helmet security headers
- Zod input validation
- Parameterized SQL queries (injection-safe)
- CORS configuration
