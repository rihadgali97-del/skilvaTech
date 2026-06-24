# SkilVaTech

> Enterprise platform combining CRM, LMS, and Professional Services management — built as a modular monolith with a React frontend and Node.js backend.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [API Overview](#api-overview)
- [Design Decisions](#design-decisions)

---

## Overview

SkilVaTech is a full-stack enterprise platform that brings together:

- **CRM** — Clients, Leads, Projects, Tickets
- **LMS** — Courses, Lessons, Enrollments
- **Services** — Service Categories, Service listings
- **Admin** — Users, Roles, Permissions (RBAC), Audit Logs, Notifications
- **Public Website** — Marketing pages (Home, About, Services, Courses, Pricing, FAQ, Contact)

---

## Architecture

```
skilvaTech/
├── server/          # Node.js + Express API (port 5050)
├── client/          # React + Vite SPA (port 5173)
├── nginx/           # Reverse proxy config
├── docker-compose.yml         # Production stack
└── docker-compose.dev.yml     # Dev infrastructure only
```

### Why a modular monolith?

A microservices architecture would introduce deployment complexity, network latency between services, and distributed transaction overhead that isn't justified at this scale. A modular monolith gives us:

- Clear module boundaries (each feature has its own folder with validation → repository → service → controller → routes)
- Single deployment unit — simpler CI/CD, no inter-service networking
- Easy to split into microservices later if scale demands it

### Module pattern

Every backend module follows the same layered structure:

```
src/modules/<feature>/
├── <feature>.validation.js   # Zod schemas — input validation only
├── <feature>.repository.js   # Prisma queries — database access only
├── <feature>.service.js      # Business logic — calls repository, throws typed errors
├── <feature>.controller.js   # HTTP layer — calls service, sends responses
└── <feature>.routes.js       # Express router — wires middleware + controller
```

This means business logic is always testable in isolation (mock the repository, test the service), and the database is never called directly from controllers.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, Zustand, React Router |
| Backend      | Node.js, Express, Prisma ORM        |
| Database     | PostgreSQL 16                       |
| Cache/Queue  | Redis 7, BullMQ                     |
| Auth         | JWT (access + refresh token rotation) |
| Validation   | Zod                                 |
| File uploads | Multer + Cloudinary                 |
| Email        | Nodemailer                          |
| Testing      | Vitest, Supertest (backend), Playwright (E2E) |
| Containers   | Docker, Docker Compose              |
| Proxy        | Nginx                               |

---

## Project Structure

```
server/src/
├── app.js                    # Express app (middleware, routes)
├── server.js                 # Entry point (DB connect, start HTTP server)
├── config/                   # env, db, redis, logger
├── modules/                  # Feature modules (auth, users, courses, clients...)
├── routes/v1.js              # Mounts all module routers
├── queues/                   # BullMQ email + notification workers
└── shared/
    ├── errors/               # AppError hierarchy (NotFoundError, etc.)
    ├── middleware/           # auth, permissions, validate, upload, error handler
    ├── services/             # email.service, storage.service
    └── utils/                # pagination, response, cache, formatters

client/src/
├── app/App.jsx               # Router — public + dashboard + auth routes
├── public/                   # Marketing website (pages, components, hooks, api)
├── modules/                  # Dashboard modules (users, courses, clients...)
└── shared/                   # Layouts, UI components, hooks, store
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop (for PostgreSQL + Redis)

### 1. Clone and install

```bash
git clone https://github.com/yourname/skilvatech.git
cd skilvaTech

cd server && npm install
cd ../client && npm install
```

### 2. Start infrastructure

```bash
# From the skilvaTech root folder
docker compose -f docker-compose.dev.yml up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 3. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your values
```

Minimum required variables:

```env
DATABASE_URL=postgresql://postgres:secret@localhost:5432/skilvatech_dev
JWT_ACCESS_SECRET=your-strong-secret-min-32-chars
JWT_REFRESH_SECRET=your-different-strong-secret
REDIS_URL=redis://127.0.0.1:6379
```

### 4. Run migrations and seed

```bash
cd server
npx prisma migrate dev
node src/prisma/seed.js
```

This creates a `super_admin` user:
- **Email:** `admin@skilvatech.com`
- **Password:** `SuperAdmin123!`

### 5. Start the apps

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

- Public website: http://localhost:5173
- Dashboard: http://localhost:5173/login
- API: http://localhost:5050/api/v1
- Health check: http://localhost:5050/api/health

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens (min 32 chars) |
| `JWT_ACCESS_EXPIRES` | | Access token lifetime (default: `15m`) |
| `JWT_REFRESH_EXPIRES` | | Refresh token lifetime (default: `7d`) |
| `REDIS_URL` | | Redis connection string — queues disabled if absent |
| `CLIENT_URL` | | Frontend URL for CORS and email links |
| `CLOUDINARY_CLOUD_NAME` | | For file uploads (optional) |
| `CLOUDINARY_API_KEY` | | For file uploads (optional) |
| `CLOUDINARY_API_SECRET` | | For file uploads (optional) |
| `SMTP_HOST` | | Email sending (optional) |
| `SMTP_USER` | | Email sending (optional) |
| `SMTP_PASSWORD` | | Email sending (optional) |

---

## Running Tests

### Setup test database

```bash
docker exec skilvatech-pg psql -U postgres -c "CREATE DATABASE skilvatech_test;"
cd server
$env:DATABASE_URL="postgresql://postgres:secret@localhost:5432/skilvatech_test"; npx prisma migrate deploy
```

### Run backend tests (Vitest)

```bash
cd server
npm test                    # All tests
npm run test:unit           # Unit tests only (fast, no DB)
npm run test:integration    # Integration tests (requires test DB)
npm run test:coverage       # With coverage report
```

### Run E2E tests (Playwright)

```bash
cd client
npx playwright install chromium   # First time only
npm run test:e2e                  # Headless
npm run test:e2e:headed           # With visible browser
```

### Test structure

```
server/tests/
├── setup.js                      # Global setup, cleanDatabase helper
├── helpers/fixtures.js           # createTestUser, createTestRole, loginAndGetToken
├── unit/
│   ├── courses/course.service.test.js
│   └── enrollments/enrollment.service.test.js
└── integration/
    ├── auth.test.js
    └── clients.test.js

client/e2e/
├── pages/index.js                # Page Object Models
└── smoke.test.js                 # Critical path E2E tests
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full production deployment instructions.

Quick start with Docker Compose:

```bash
cp .env.production .env
# Fill in all production values

docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
docker compose exec backend node src/prisma/seed.js
```

---

## API Overview

Base URL: `/api/v1`

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Users | `GET/POST /users`, `PATCH/DELETE /users/:id` |
| Roles | `GET/POST /roles`, `DELETE /roles/:id`, `PUT /roles/:id/permissions` |
| Services | `GET/POST /services`, `PATCH/DELETE /services/:id` |
| Courses | `GET/POST /courses`, `PATCH/DELETE /courses/:id`, `GET/POST /courses/:id/lessons` |
| Enrollments | `GET/POST /enrollments`, `PATCH /enrollments/:id/progress`, `PATCH /enrollments/:id/cancel` |
| Clients | `GET/POST /clients`, `PATCH/DELETE /clients/:id` |
| Leads | `GET/POST /leads`, `PATCH/DELETE /leads/:id` |
| Projects | `GET/POST /projects`, `PATCH/DELETE /projects/:id` |
| Tickets | `GET/POST /tickets`, `PATCH/DELETE /tickets/:id` |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` |
| Audit Logs | `GET /audit-logs` |
| Uploads | `POST /uploads/image`, `POST /uploads/document` |
| Health | `GET /health` |

All endpoints except health require a Bearer token (`Authorization: Bearer <token>`).

Permissions are checked per endpoint — a user must have the relevant `resource:action` permission (e.g. `courses:create`, `clients:delete`) assigned to their role.

---

## Design Decisions

**Modular monolith over microservices** — The overhead of service-to-service networking, distributed transactions, and separate deployments isn't warranted at this scale. Module boundaries are enforced by folder structure and the service/repository pattern, making extraction straightforward if needed later.

**Prisma over raw SQL** — Type-safe queries, auto-generated migrations, and a clean query API. The repository layer means we could swap Prisma for raw SQL in any module without touching service or controller code.

**JWT with refresh token rotation** — Access tokens are short-lived (15m). Refresh tokens rotate on every use — the old token is invalidated immediately, so token theft has a very narrow window.

**BullMQ for async jobs** — Emails and notifications are queued rather than sent synchronously. This keeps API response times fast and makes the system resilient to SMTP outages (jobs retry with exponential backoff).

**Redis optional** — The server starts and runs fully without Redis. Queues and caching degrade gracefully. This simplifies local development and makes the system more operationally resilient.