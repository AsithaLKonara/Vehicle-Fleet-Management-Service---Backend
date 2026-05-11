# UltraDrive Architecture Overview

## System Context
UltraDrive is an enterprise-grade Fleet Management System designed for large-scale operational logistics. It follows a modern, distributed architecture with a focus on security, scalability, and premium user experience.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router), Tailwind CSS 4+, Framer Motion, React Query, Lucide/HeroIcons.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Winston Logger.
- **Database**: PostgreSQL (Prisma-managed).
- **Security**: JWT-based Authentication, Role-Based Access Control (RBAC), Helmet, Express Rate Limit.
- **Testing**: Jest (Unit/Integration), Playwright (E2E).

## Component Architecture

### 1. Frontend (Next.js)
- **App Router**: Leveraging Server Components for data fetching and Client Components for interactivity.
- **Layout System**: Centralized `ClientLayout` for managing the premium sidebar state and page transitions.
- **Design System**: A custom glassmorphic design system defined in `globals.css` with Tailwind 4 theme extensions.
- **Auth Layer**: `AuthContext` provides real-time session management and automatic route protection.

### 2. Backend (Node.js/Express)
- **Layered Architecture**: Controllers -> Services -> Prisma (Data Layer).
- **Middleware Chain**: Correlation ID -> Helmet -> Rate Limiter -> Auth -> RBAC -> Controller.
- **Transactional Integrity**: All critical dispatch workflows use DB-level atomic transactions to prevent double-booking.

## Data Model (ER)
- **User**: Operators with roles (ADMIN, FLEET_MANAGER, FLEET_STAFF).
- **Vehicle**: Assets tracked by plate number, manufacturer, and operational status.
- **Assignment**: Linking users to vehicles with dispatch/return timestamps.
- **AuditLog**: Immutable ledger of all administrative and operational actions.

## Deployment Strategy
- **Frontend**: Vercel (Optimized for Next.js).
- **Backend**: Railway/Render (Dockerized Express app).
- **Database**: Neon (Serverless Postgres) or Supabase.
