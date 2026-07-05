# About Me

Personal website built as a learning project. Implements a modern architecture with Spring Boot (Hexagonal + DDD) on the backend and Vue 3 on the frontend, deployed with Docker.

## Stack

| Layer            | Technology                                                                                   |
|------------------|----------------------------------------------------------------------------------------------|
| Backend          | Java 26 · Spring Boot 4 · Gradle                                                             |
| Persistence      | MariaDB · Spring Data JPA · Flyway (migrations)                                              |
| Frontend         | Vue 3 · Vite · TypeScript · Tailwind CSS 4 · PrimeVue · TanStack Query · Pinia · Axios · Zod |
| Server           | Nginx (reverse proxy)                                                                        |
| Containerization | Docker · Docker Compose                                                                      |

## Project Structure

```
aboutme/
├── src/                          # Java backend (Hexagonal + DDD)
│   └── main/java/com/fbisquerra/aboutme/
│       ├── profile/              # Profile module (read the CV/profile)
│       │   ├── domain/            # Profile aggregate + ProfileRepository (port)
│       │   ├── application/       # GetProfileUseCase, DTOs, ProfileMapper
│       │   └── infrastructure/    # ProfileController + JPA persistence (adapter)
│       ├── contact/              # Contact module (contact form → email via Resend)
│       │   ├── domain/            # ContactMessage + ContactEmailPort (port)
│       │   ├── application/       # SendContactMessageUseCase, DTOs
│       │   └── infrastructure/    # ContactController + Resend email adapter
│       ├── user/                 # User module (auth: login → JWT, roles ADMIN/USER)
│       │   ├── domain/            # User, Role, PasswordHasher/AccessTokenIssuer (ports)
│       │   ├── application/       # AuthenticateUserUseCase, login DTOs
│       │   └── infrastructure/    # AuthController, Spring Security config, JPA persistence
│       └── shared/               # Shared configuration
│           └── infrastructure/    # CorsConfig, RequestLoggingFilter
│   └── main/resources/
│       └── db/migration/         # Flyway SQL migrations (V1 profile, V2 seed, V3 users)
├── frontend/                     # Vue 3 + Vite + TypeScript frontend
│   └── src/
│       ├── App.vue               # Navbar + RouterView + Footer
│       ├── main.ts               # PrimeVue + TanStack Query + Pinia + router setup
│       ├── pages/                # Route-level SMART components (Home, Contact, Login, Admin)
│       ├── components/           # Presentational + layout (Navbar, Footer, Home, Experience…)
│       ├── router/              # vue-router routes + auth guard (/admin)
│       ├── queries/              # TanStack Query hooks (useProfile)
│       ├── schemas/              # Zod schemas (auth, contact) for form validation
│       ├── stores/               # Pinia — client state only (auth token)
│       ├── api/                  # axios client.ts + thin api functions
│       ├── types/                # TS interfaces (backend contracts)
│       └── test/                 # test helpers (mountWithPlugins)
├── infrastructure/
│   └── docker/                   # Dockerfiles + Nginx + Compose
│       ├── backend/Dockerfile
│       ├── frontend/Dockerfile
│       ├── frontend/nginx.conf
│       ├── frontend/nginx.prod.conf
│       ├── docker-compose.yml
│       └── docker-compose.prod.yml
└── build.gradle                  # Backend + frontend + Docker build tasks
```

## Profiles

| Profile | Use case                            | How to run                                                                    |
|---------|-------------------------------------|-------------------------------------------------------------------------------|
| `dev`   | Development with hot reload         | `./gradlew dockerRun -Pprofile=dev` (MariaDB only) + IntelliJ + `npm run dev` |
| `local` | Full production environment locally | `./gradlew dockerRun`                                                         |
| `pro`   | Production                          | `./gradlew dockerRun -Pprofile=pro`                                           |

## Development (dev profile)

The backend needs a MariaDB instance. In `dev` the backend runs as a local process,
so start just the database container first (it listens on `localhost:3306`):

```bash
# Terminal 0 — database only (starts just the `db` container)
./gradlew dockerRun -Pprofile=dev
```

```bash
# Terminal 1 — backend
./gradlew bootRun

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

Vite proxies `/api/*` requests to `localhost:8080` during development.
Flyway applies the schema and seed data (`src/main/resources/db/migration/`) on backend startup.

### Database & environment

The MariaDB connection is configured via environment variables (see `.env.example`):

| Variable                                                                           | Purpose                                                                      |
|------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| `MARIADB_DATABASE` / `MARIADB_USER` / `MARIADB_PASSWORD` / `MARIADB_ROOT_PASSWORD` | Credentials for the `db` container                                           |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD`                                           | Backend datasource (injected from compose; defaults target the `db` service) |

Copy `.env.example` to `.env` and fill in the values. Schema changes are made with
Flyway migrations — see the `/new-migration` guide.

## Local environment with Docker (local profile)

```bash
./gradlew dockerRun -x test
```

Builds the JAR and frontend, then starts:

- `frontend` — Nginx at `http://localhost:80` (serves Vue + proxies `/api/*` → backend)
- `backend` — Spring Boot at `:8080` (internal only)
- `db` — MariaDB (exposed on `localhost:3306` for inspection)

## Production environment with Docker (pro profile)

```bash
./gradlew dockerRun -Pprofile=pro
```

Merges `docker-compose.yml` (base) with `docker-compose.prod.yml` (overrides), then starts:

- `frontend` — Nginx at ports 80 (HTTP→HTTPS redirect) and 443 (HTTPS, SSL)
- `backend` — Spring Boot at `:8080` (internal only)
- `db` — MariaDB (internal only, persisted in the `db-data` volume)
- `certbot` — Let's Encrypt SSL certificate automation with 12-hour renewal

Requires `DOMAIN` set in `.env` (configured as `franbisquerra.dev`).

<!-- API documented via Swagger (pending) -->

## Tests

```bash
./gradlew test
```

Integration tests (`@SpringBootTest`) start an ephemeral MariaDB via Testcontainers and
apply the Flyway migrations, so **Docker must be running** to execute the test suite.
