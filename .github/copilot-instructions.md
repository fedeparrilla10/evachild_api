# Copilot Instructions for EvaChild API

## Project Overview

EvaChild API is a Node.js backend using Express and Prisma ORM, designed for managing users, roles, classes, children, and related educational entities. The codebase is modular, with clear separation between controllers, services, and routes for each domain model.

## Architecture & Patterns

- **Layered Structure:**
  - `src/controllers/`: Express route handlers, minimal logic, delegate to services.
  - `src/services/`: Business logic and direct Prisma queries. Each service matches a model (e.g., `classService.ts`, `childService.ts`).
  - `src/routes/`: Route definitions, one file per model, imported in `server.ts`.
  - `src/server.ts`: Main Express app, registers all routes under `/api/*`.
- **Prisma ORM:**
  - Database schema in `prisma/app/generated/prisma/client/schema.prisma`.
  - Models: `User`, `Role`, `Class`, `Child`, `Milestone`, etc.
  - Use `prisma.<model>.findMany()`, `findUnique()`, `create()`, `update()`, `delete()` in services.
- **TypeScript:**
  - All source files use TypeScript. Types for request bodies are defined in services.

## Developer Workflows

- **Development Server:**
  - Start with: `pnpm run dev` (uses `ts-node-dev` for hot reload).
- **Database Migrations:**
  - Run: `pnpm run migrate` (calls `npx prisma migrate dev`).
  - Direct SQL: Use `prisma db execute --stdin --schema=prisma/schema.prisma` for manual queries.
- **Adding Models:**
  - Update `schema.prisma`, run migration, then create matching service, controller, and route files.
- **API Endpoints:**
  - RESTful, grouped by resource: `/api/users`, `/api/roles`, `/api/classes`, `/api/children`, etc.
  - Each resource supports GET (all/by id), POST (create), PUT (update), DELETE (remove).

## Conventions & Patterns

- **Service Pattern:**
  - All DB access is via service files. Controllers never query Prisma directly.
- **Error Handling:**
  - Controllers catch errors and respond with status 500 and `{ error: "Internal Server Error" }`.
- **Type Safety:**
  - Request body types are explicitly defined in services and used in controller logic.
- **File Naming:**
  - Singular for models/services/controllers (e.g., `classService.ts`), plural for routes (e.g., `classRoutes.ts`).
- **Route Registration:**
  - All routes registered in `server.ts` under `/api/*`.

## Integration Points

- **Database:** MySQL via Prisma ORM.
- **Environment Variables:** DB connection string in `.env` as `DATABASE_URL`.
- **Dependencies:**
  - Express, Prisma, ts-node-dev, TypeScript, MySQL2, bcrypt, dotenv, cors.

## Example: Adding a New Resource

1. Check if the model already exists in `schema.prisma`.
2. Define model in `schema.prisma`.
3. Run migration (`pnpm run migrate`).
4. Create service, controller, and route files in `src/`.
5. Register route in `server.ts`.

## Key Files

- `src/server.ts`: App entrypoint, route registration.
- `src/services/*Service.ts`: Business logic and DB access.
- `src/controllers/*Controller.ts`: API logic and error handling.
- `src/routes/*Routes.ts`: Route definitions.
- `prisma/app/generated/prisma/client/schema.prisma`: DB schema.
