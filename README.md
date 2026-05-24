# About Me

Personal website built as a learning project. Implements a modern architecture with Spring Boot (Hexagonal + DDD) on the backend and Vue 3 on the frontend, deployed with Docker.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 26 · Spring Boot 4 · Gradle |
| Frontend | Vue 3 · Vite 5 · TypeScript · Axios · Tailwind CSS 4 · Pinia |
| Server | Nginx (reverse proxy) |
| Containerization | Docker · Docker Compose |

## Project Structure

```
aboutme/
├── src/                          # Java backend (Hexagonal + DDD)
│   └── main/java/com/fbisquerra/aboutme/
│       ├── home/                 # Home module
│       │   └── infrastructure/controller/HomeController.java
│       ├── profile/              # Profile module
│       │   ├── domain/model/Profile.java
│       │   ├── domain/repository/ProfileRepository.java
│       │   ├── application/dto/ProfileResponse.java
│       │   ├── application/usecase/GetProfileUseCase.java
│       │   ├── infrastructure/persistence/JsonProfileRepository.java
│       │   └── infrastructure/controller/ProfileController.java
│       └── shared/               # Shared configuration
│           └── infrastructure/config/CorsConfig.java
├── frontend/                     # Vue 3 + Vite + TypeScript frontend
│   └── src/
│       ├── App.vue
│       ├── main.ts
│       ├── types/profile.ts      # TypeScript interfaces
│       ├── api/client.ts
│       ├── api/profile.ts
│       ├── stores/profile.ts     # Pinia store
│       └── components/
│           ├── Home.vue
│           ├── Navbar.vue
│           ├── Experience.vue
│           └── BackToTop.vue
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

| Profile | Use case | How to run |
|---------|----------|------------|
| `dev` | Development with hot reload | IntelliJ + `npm run dev` |
| `local` | Full production environment locally | `./gradlew dockerRun` |
| `pro` | Production | `./gradlew dockerRun -Pprofile=pro` |

## Development (dev profile)

```bash
# Terminal 1 — backend
./gradlew bootRun

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

Vite proxies `/api/*` requests to `localhost:8080` during development.

## Local environment with Docker (local profile)

```bash
./gradlew dockerRun -x test
```

Builds the JAR and frontend, then starts:
- `frontend` — Nginx at `http://localhost:80` (serves Vue + proxies `/api/*` → backend)
- `backend` — Spring Boot at `:8080` (internal only)

## Production environment with Docker (pro profile)

```bash
./gradlew dockerRun -Pprofile=pro
```

Merges `docker-compose.yml` (base) with `docker-compose.prod.yml` (overrides), then starts:
- `frontend` — Nginx at ports 80 (HTTP→HTTPS redirect) and 443 (HTTPS, SSL)
- `backend` — Spring Boot at `:8080` (internal only)
- `certbot` — Let's Encrypt SSL certificate automation with 12-hour renewal

Requires `DOMAIN` set in `.env` (configured as `franbisquerra.dev`).

<!-- API documented via Swagger (pending) -->

## Tests

```bash
./gradlew test
```
