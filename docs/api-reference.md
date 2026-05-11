# API Reference

## Base URL
`http://localhost:5000/api` (Development)
`https://api.ultradrive.com` (Production)

## Authentication
All protected routes require a Bearer Token:
`Authorization: Bearer <JWT_TOKEN>`

---

## Auth Endpoints

### POST `/auth/register`
Create a new user.
- **Body**: `{ name, email, password, role }`

### POST `/auth/login`
Authenticate user.
- **Body**: `{ email, password }`
- **Response**: `{ success, data: { token, user } }`

---

## Vehicle Fleet

### GET `/vehicles`
List all vehicles with optional filters.
- **Query Params**: `status`, `type`, `search`, `page`, `limit`

### POST `/vehicles`
Register a new asset.
- **Role**: `ADMIN`, `FLEET_MANAGER`
- **Body**: `{ plateNumber, make, model, year, purchaseCost, type, imageUrl }`

---

## Operational Assignments

### GET `/assignments`
Retrieve assignment stream.

### POST `/assignments`
Dispatch a vehicle.
- **Role**: `ADMIN`, `FLEET_MANAGER`
- **Body**: `{ vehicleId, driverId }`

### PATCH `/assignments/:id/return`
Mark a vehicle as returned.
- **Role**: `ADMIN`, `FLEET_MANAGER`, `FLEET_STAFF`

---

## Workforce Management

### GET `/users`
List workforce matrix.
- **Role**: `ADMIN`

---

## Audit Registry

### GET `/audit`
View operational timeline.
- **Role**: `ADMIN`
