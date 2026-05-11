# UltraDrive Fleet - Backend

Production-grade Vehicle Fleet Management System Backend.

## Tech Stack
- **Node.js & Express.js** (v5)
- **TypeScript**
- **Prisma ORM** (v7) with PostgreSQL
- **JWT Authentication** & RBAC
- **Zod** Validation
- **Winston** Logging
- **Jest & Supertest** for Integration Testing

## Features
- **Auth**: Secure login with Role-Based Access Control (Admin, Manager, Staff).
- **User Management**: Admin-only CRUD operations.
- **Vehicle Management**: Inventory tracking with status distribution.
- **Assignment System**: Transactional vehicle allocation to drivers.
- **Audit Logging**: Critical action tracking for security and accountability.
- **Operational Dashboard**: Real-time stats and metrics.

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL

### Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Setup environment variables in `.env` (see `.env.example`).
4. Generate Prisma client: `npx prisma generate`
5. Run migrations: `npx prisma migrate dev`
6. Seed database: `npx prisma db seed`

### Scripts
- `npm run dev`: Start development server.
- `npm test`: Run integration tests.
- `npm run lint`: Run ESLint.
- `npm run build`: Build for production.

## License
ISC
