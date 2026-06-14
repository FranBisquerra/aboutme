# AI Guide - About Me Project

## Project Overview

**Goal**: Create a personal "About Me" page with multiple technical features implemented as a learning exercise.

**Tech Stack**:
- **Backend**: Spring Boot 4.0.4 (Java 26) with Hexagonal Architecture + DDD
- **Frontend**: Vue 3.5.34 + Vite 5 + TypeScript + Tailwind CSS 4 + Axios + Pinia
- **Build**: Gradle (backend + Docker tasks), npm (frontend)
- **Containerization**: Docker + Docker Compose (local and production)
- **SSL/TLS**: Let's Encrypt (Certbot, automatic renewal)
- **Version control**: Git (main/develop branches)

**Purpose**: Progressively implement features such as authentication, message queues, email sending, etc., with the goal of learning how they are implemented in a real application.

---

## Project Structure - Frontend (Vue 3)

```
frontend/
├── src/
│   ├── App.vue                    # Root component
│   ├── main.ts                    # Entry point
│   ├── index.css                  # Global styles + Tailwind
│   ├── types/                     # TypeScript interfaces (contract with backend)
│   ├── api/                       # HTTP clients (Axios)
│   ├── stores/                    # Pinia stores (global state)
│   └── components/                # UI components
├── env.d.ts                       # Vite + Vue type declarations
├── tsconfig.json
├── index.html
├── vite.config.ts
└── package.json
```

**Frontend conventions**:
- TypeScript in all `.ts` files and `<script setup lang="ts">` in components
- Components in PascalCase with `.vue` extension
- Styles with Tailwind CSS classes (no custom CSS except `index.css`)
- HTTP calls centralized in `api/`
- Global state in `stores/` (Pinia) — shared data fetched once, not per component
- Backend contracts typed in `types/`

---

## Project Structure - Backend (Hexagonal + DDD)

### Hexagonal Architecture (Ports and Adapters)

The application is organized in **modules by aggregate**, each with three layers:

```
src/main/java/com/fbisquerra/aboutme/
│
├── shared/                              # Shared code across modules
│   ├── domain/
│   │   ├── DomainEvent.java           # Base class for events
│   │   ├── DomainException.java       # Base domain exception
│   │   └── ValueObject.java           # Interface/base class for VOs
│   └── infrastructure/
│       └── config/                     # Shared configuration
│
├── {module}/                           # Module (Root Aggregate)
│   │
│   ├── domain/                         # DOMAIN LAYER
│   │   ├── model/                      # Aggregates, Entities, Value Objects
│   │   │   ├── {Aggregate}.java
│   │   │   ├── {AggregateId}.java     # ID Value Object
│   │   │   └── {OtherVO}.java
│   │   ├── repository/                 # PORT: Persistence interface
│   │   │   └── {Aggregate}Repository.java
│   │   ├── service/                    # Domain Services (pure logic)
│   │   │   └── {Feature}DomainService.java
│   │   └── event/                      # Domain Events
│   │       └── {Event}Event.java
│   │
│   ├── application/                    # APPLICATION LAYER
│   │   ├── usecase/                    # Use Cases (orchestration)
│   │   │   └── {Action}UseCase.java
│   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── {Aggregate}Request.java
│   │   │   └── {Aggregate}Response.java
│   │   ├── mapper/                     # Domain ↔ DTO mapping
│   │   │   └── {Aggregate}Mapper.java
│   │   └── command/                    # CQRS: Commands
│   │       └── {Command}Command.java
│   │
│   └── infrastructure/                 # INFRASTRUCTURE LAYER
│       ├── controller/                 # ADAPTER: REST API
│       │   └── {Aggregate}Controller.java
│       ├── persistence/                # ADAPTER: Data Access
│       │   ├── entity/                  # JPA @Entity classes (own subpackage)
│       │   │   └── {Aggregate}JpaEntity.java
│       │   ├── {Aggregate}JpaRepository.java (Spring Data)
│       │   └── Jpa{Aggregate}Repository.java (Port adapter — named by technology, not "Impl")
│       ├── event/                      # ADAPTER: Event publishing
│       │   └── {Aggregate}EventPublisher.java
│       └── config/                     # Module configuration
│           └── {Aggregate}Config.java
│
└── resources/
    ├── application.yml                 # Main configuration
    ├── application-dev.yml
    └── application-prod.yml
```

---

## Key DDD Concepts

| Concept | Description | Location |
|---------|-------------|----------|
| **Aggregate** | Root of a Bounded Context with full lifecycle | `domain/model/{Aggregate}.java` |
| **Value Object** | Immutable object with no own identity | `domain/model/{VO}.java` |
| **Entity** | Object with unique identity (within the aggregate) | `domain/model/` |
| **Repository (Port)** | Abstract interface, no persistence details | `domain/repository/` |
| **Repository (Adapter)** | Concrete implementation with JPA | `infrastructure/persistence/` |
| **Domain Service** | Pure business logic (no Spring) | `domain/service/` |
| **Application Service / UseCase** | Action orchestration, transactions | `application/usecase/` |
| **Domain Event** | Important business occurrence | `domain/event/` |
| **DTO** | Object for transferring data between layers | `application/dto/` |
| **Mapper** | Convert between domain entities and DTOs | `application/mapper/` |

---

## Development Philosophy

### Iteration and Incrementality

- **Small, working versions**: Better to have a simple feature that works than many half-done features
- **Add dependencies on demand**: Only when truly needed, not "just in case"
- **Refactor gradually**: Improve design as requirements grow
- **Validate frequently**: Compile and test regularly to catch problems early
- **Continuous integration**: Changes are integrated frequently into `develop`

### YAGNI Principle (You Aren't Gonna Need It)

- Implement only what is needed now
- Design for extensibility but don't over-engineer
- Add features only when explicitly requested
- Don't add code "just in case"
- Don't use complex patterns if a simple solution works

### Dependency Management

- Add dependencies when needed for a specific feature
- Document why each dependency is added
- Use stable, well-maintained versions
- Review licenses and compatibility
- Don't add libraries to "follow trends"
- Don't duplicate functionality already present in current dependencies

---

## Deployment with Gradle + Docker

### Available Gradle Tasks

| Task | Command | Description |
|------|---------|-------------|
| `installFrontend` | (internal) | Runs `npm install` in `frontend/` |
| `buildFrontend` | (internal) | Runs `npm run build` (produces `frontend/dist/`) |
| `dockerRun (dev)` | `./gradlew dockerRun -Pprofile=dev` | Profile `dev`: starts only the `db` (MariaDB) container, no build |
| `dockerRun` | `./gradlew dockerRun` | Profile `local`: builds and starts 3 containers (`db`, `backend`, `frontend`) |
| `dockerRun (pro)` | `./gradlew dockerRun -Pprofile=pro` | Profile `pro`: 4 containers with SSL (`db`, `backend`, `frontend`, `certbot`) |
| `dockerStop` | `./gradlew dockerStop` | Stops active containers |
| `dockerStart` | `./gradlew dockerStart` | Resumes already-created containers |

The `build` task depends on `buildFrontend`, so compiling the backend already includes compiling the frontend.

### Environment Profiles

| Profile | Compose file | Containers | Access |
|---------|-------------|------------|--------|
| `dev` | `docker-compose.dev.yml` | `db` only (backend/frontend run locally) | backend `:8080`, frontend `:5173`, db `:3306` |
| `local` | `docker-compose.local.yml` | `db`, `frontend`, `backend` | `http://localhost` |
| `pro` | `docker-compose.prod.yml` | `db`, `frontend`, `backend`, `certbot` | `https://<DOMAIN>` |

### Compose strategy: base + override

`docker-compose.yml` is the base file (profile `local`). For `pro`, `docker-compose.prod.yml` is applied on top with an additional `-f`, adding/overriding only the differences:
- Nginx adds port 443, SSL volumes and the `nginx.prod.conf` config
- Backend forces `SPRING_PROFILES_ACTIVE: pro` and `restart: unless-stopped`
- The `certbot` service is added (only exists in `pro`)
- Requires `DOMAIN` variable in `.env` (currently `franbisquerra.dev`)

---

## AI RESTRICTIONS AND GUIDELINES

### Critical Restrictions

**GIT - COMMITS**:
- **DO NOT COMMIT ANYTHING WITHOUT EXPLICIT USER INSTRUCTION**
- Before any action, inform the user of the plan
- Always verify with `git status` before considering changes
- When authorized, make atomic commits with clear messages
- Never force-push
- Never modify existing commit history

**TESTS**:
- **DO NOT RUN `./gradlew test` UNLESS EXPLICITLY INSTRUCTED**
- Compiling with `./gradlew build` to verify compilation errors is fine
- If there are compilation failures, report to the user INSTEAD OF committing
- Only run tests when the user explicitly requests it

**CODE CHANGES**:
- Before making significant changes, **inform the user of the complete plan**
- Wait for **explicit confirmation** before proceeding
- If there are doubts about design or architecture, **ask first**
- Do not assume user preferences

### Best Practices

- Maintain consistency with the proposed structure
- Create files in the correct folders following the convention
- Write clear documentation in code (comments and docstrings)
- Use descriptive names for variables, methods and classes
- Look up official documentation before improvising
- Check existing structure before adding new things
- Clearly and strictly separate: **Domain** (no Spring), **Application** (orchestration), **Infrastructure** (adapters)
- Use DTOs to expose data in REST APIs
- Make Value Objects immutable and validate in the constructor

### Spring Boot 4 Compatibility Notes

- **Jackson 3.x**: El paquete cambió de `com.fasterxml.jackson` a `tools.jackson`. Usar `tools.jackson.databind.ObjectMapper`, `tools.jackson.databind.JsonNode`, etc.
- **MockMvc**: `@AutoConfigureMockMvc` eliminado — configurar con `MockMvcBuilders.webAppContextSetup(context).build()`
- **Jackson como dependencia explícita**: `spring-boot-starter-json` debe declararse explícitamente en `build.gradle`
- **Mockito como Java agent**: Java 26 no permite carga dinámica de agentes; Mockito debe configurarse como `-javaagent` vía configuración `mockitoAgent` en `build.gradle`

### Code Style (Java)

Idiomatic-style rules the project follows (documented here, not enforced by tooling).
Apply them to new/changed code:

- **Prefer `var` for local variables** when the type is evident from the right-hand side
  (e.g. `var user = userRepository.findByUsername(...)`, `var users = new ArrayList<User>()`).
  Keep the explicit type when it aids readability or the inferred type is not obvious
  (e.g. a method returning a generic/raw type, ternaries, or `var x = null`). `var` is for
  **local variables only** — never for fields, method parameters, or return types.

### Avoid

- Do not commit without explicit instruction
- Do not run tests without explicit instruction
- Do not mix business logic in controllers
- Do not import Spring in the domain layer (`domain/` must have no `@annotations`)
- Do not use JPA entities directly in business logic
- Do not leave commented or dead code
- Do not hardcode values; use `application.yml`
- Do not create new layers/modules without documenting their purpose
- Do not ignore separation of concerns

### Skills (invoke on demand)

Detailed workflow guides are available as slash commands:

- `/unit-test` — conventions and examples for backend unit tests (JUnit 5, Mockito, Hamcrest, fixtures)
- `/it-test` — conventions and examples for integration tests (MockMvc, Spring Boot 4 setup)
- `/new-module` — checklist for creating a new DDD module end-to-end
- `/new-page` — standard recipe for adding a Vue frontend page (smart pages + presentational components, store vs api, async state, tests)
- `/new-migration` — checklist for adding a Flyway database migration (naming, MariaDB SQL conventions, entity sync)
- `/commit` — git commit conventions (ask first, atomic commits, English, `<Feature>: <Verb>` subject)

---

## Current Technical Configuration

**Backend (Spring Boot)**:
- Version: 4.0.4
- Java: 26
- Current dependencies:
  - `spring-boot-starter-web`
  - `spring-boot-starter-json` (Jackson 3.x — required explicitly, not transitive in Spring Boot 4)
  - `spring-boot-starter-mail`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-validation` (Bean Validation on request DTOs)
  - `spring-boot-starter-security` + `spring-boot-starter-oauth2-resource-server` (JWT auth, HS256)
  - `mariadb-java-client` (JDBC driver)
  - `flyway-core` + `flyway-mysql` (schema migrations)

**Database**: MariaDB (latest) via Docker. Schema owned by Flyway migrations in
`src/main/resources/db/migration/`. `spring.jpa.hibernate.ddl-auto: validate` —
Hibernate never mutates the schema. Profile data lives in normalized tables
(`profile`, `profile_language`, `profile_skill`, `profile_experience`, `profile_education`).
Integration tests use Testcontainers MariaDB (`AbstractIntegrationTest`).

**Build**: Gradle 9.x

**Package**: `com.fbisquerra.aboutme`

**Frontend (Vue 3 + TypeScript)**:
- Vue: 3.5.34
- Vite: 5.4.11
- TypeScript: 6.x
- Tailwind CSS: 4.3.0 (via plugin `@tailwindcss/vite`)
- Axios: 1.7.9
- Pinia: 3.0.4

---

## Where to Find Information

- **DDD Documentation**: Eric Evans - Domain Driven Design
- **Hexagonal Architecture**: Alistair Cockburn
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Configuration**: `src/main/resources/application.yml`

---

**Last updated**: Profile moved from JSON to MariaDB + Flyway (2026-06-07)
**Version**: 4.1
**Status**: Under active development
