# Backend Plan — Vehicle Fleet Management System

## Tech Stack
* Node.js & Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication & bcrypt
* Cors, Dotenv, Morgan, Winston
* Zod (Validation)

## Development Phases

### Phase 1 — Project Initialization
* Initialize npm
* Install dependencies
* Setup folder structure:
  ```txt
  backend/
   ├── prisma/
   ├── src/
   │   ├── controllers/
   │   ├── services/
   │   ├── routes/
   │   ├── middleware/
   │   ├── validators/
   │   ├── utils/
   │   └── app.ts
  ```

### Phase 2 — Database Design (Prisma)
* Models: User, Vehicle, Assignment
* Enums: Role (ADMIN, FLEET_MANAGER, FLEET_STAFF), VehicleStatus (AVAILABLE, ASSIGNED, MAINTENANCE)

### Phase 3 — Authentication & Authorization
* Endpoints: POST /auth/login
* Middleware: authMiddleware (JWT), roleMiddleware (RBAC)

### Phase 4 — User Management API
* Endpoints: GET /users, POST /users, PATCH /users/:id

### Phase 5 — Vehicle Management API
* Endpoints: GET /vehicles, POST /vehicles, PATCH /vehicles/:id, DELETE /vehicles/:id

### Phase 6 — Assignment System (Transactional)
* Logic: Check status -> Create assignment -> Update status (Atomically using Prisma transactions)
* Endpoints: POST /assignments, PATCH /assignments/:id/return, GET /assignments/history

### Phase 8 — Logging & Audit
* Request logging (Morgan)
* Optional AuditLog table

### Phase 10 — CI/CD
* Pipeline: install -> prisma generate -> test -> build

## Testing Strategy
* Unit tests for services.
* Integration tests for API endpoints.
