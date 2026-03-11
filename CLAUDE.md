# CLAUDE.md — School Management System

## Project Overview
Multi-tenant school management system (SaaS). Each school = 1 PostgreSQL schema.

## Tech Stack
- **Backend**: Spring Boot 4.0.3, Java 17, PostgreSQL, Flyway, MapStruct, Lombok
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, React Hook Form + Zod
- **Infra**: Docker, Nginx

## Project Structure
```
school-Sytem/
├── school-system-back/         # Spring Boot API
│   └── src/main/java/com/schoolSys/schooolSys/
│       ├── student/            # Each module has: Controller, Service, Repository, DTO, Entity, Mapper
│       ├── teacher/
│       ├── finance/
│       ├── note/
│       ├── examen/
│       ├── bulletin/
│       ├── tenant/             # Multi-tenancy (schema-per-tenant)
│       └── common/             # Shared: ApiResponse, exceptions, config
├── school-system-front/        # React SPA
│   └── src/
│       ├── pages/              # One page per feature
│       ├── components/         # Reusable UI (shadcn/ui based)
│       ├── hooks/              # Custom hooks (useStudents, useFinance...)
│       ├── services/           # Axios API calls
│       └── types/              # TypeScript interfaces
```

## Commands
```bash
# Backend
cd school-system-back && mvn spring-boot:run -Dspring-boot.run.profiles=dev
cd school-system-back && mvn test

# Frontend
cd school-system-front && npm run dev      # Dev server :5173
cd school-system-front && npm run build    # Production build
cd school-system-front && npm run test     # Vitest
cd school-system-front && npm run lint     # ESLint

# Docker (dev — PostgreSQL only)
docker compose -f docker-compose.dev.yml up -d

# Docker (full stack)
docker compose up --build
```

## Conventions

### Git
- Branch: `main` → `develop` → `feature/SEC-001-jwt-auth`
- Commit: `feat(auth): implement JWT token generation [SEC-001]`
- Prefixes: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Always include ticket ID in branch name and commit message

### Backend
- Package-per-feature (not package-per-layer)
- Controller → Service → Repository pattern
- DTOs for all API input/output (never expose entities directly)
- MapStruct for entity ↔ DTO mapping
- ApiResponse<T> wrapper for all responses
- Flyway migrations: `V{number}__{description}.sql`
- Tenant header: `X-Tenant-ID`

### Frontend
- Functional components only (no class components)
- Custom hooks for all API interactions (useXxx pattern)
- React Query for server state, Context for UI state
- Zod schemas for all form validation
- shadcn/ui components — do not install other UI libraries
- Sonner for toast notifications
- File naming: PascalCase for components, camelCase for hooks/utils

### API
- Base URL: `/api/`
- RESTful: GET (list/read), POST (create), PUT (update), DELETE
- Pagination: `?page=0&size=10&sort=nom,asc`
- Filtering: query params `?nom=xxx&classeId=1`
- Response format: `{ success: true, data: {...}, message: "..." }`

### Database
- Table names: snake_case, French (eleves, enseignants, paiements)
- Column names: snake_case
- All tables have: id (BIGSERIAL), created_at, updated_at
- Foreign keys: `{table_singular}_id` (eleve_id, classe_id)
- Enums: stored as VARCHAR with CHECK constraint

## Current State (as of Sprint 0)
- Auth: NOT implemented (all endpoints are .permitAll())
- Multi-tenant: schema-per-tenant architecture in place
- Modules done: Students, Teachers, Classes, Niveaux, Modules, Domaines, Notes, Examens, Bulletins, Finance (paiements, depenses, caisse, remises, relances)
- Modules missing: Auth, Absences, Emploi du temps, Messagerie, Portail parent
