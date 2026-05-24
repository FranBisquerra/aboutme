# AI Guide - About Me Project

## Project Overview

**Goal**: Create a personal "About Me" page with multiple technical features implemented as a learning exercise.

**Tech Stack**:
- **Backend**: Spring Boot 4.0.4 (Java 26) with Hexagonal Architecture + DDD
- **Frontend**: Vue 3.5.34 + Vite 5 + Tailwind CSS 4 + Axios
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
│   ├── main.js                    # Entry point
│   ├── index.css                  # Global styles + Tailwind
│   ├── api/                       # HTTP clients (Axios)
│   ├── data/                      # Static data (JSON)
│   └── components/                # UI components
├── index.html
├── vite.config.js
└── package.json
```

**Frontend conventions**:
- Components in PascalCase with `.vue` extension
- Styles with Tailwind CSS classes (no custom CSS except `index.css`)
- HTTP calls centralized in `api/`
- Static profile data in `data/` (no API)

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
│       │   ├── {Aggregate}JpaEntity.java
│       │   ├── {Aggregate}JpaRepository.java (Spring Data)
│       │   └── {Aggregate}RepositoryImpl.java (Port implementation)
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
| `dockerRun` | `./gradlew dockerRun` | Profile `local`: builds and starts 2 containers |
| `dockerRun (pro)` | `./gradlew dockerRun -Pprofile=pro` | Profile `pro`: 3 containers with SSL |
| `dockerStop` | `./gradlew dockerStop` | Stops active containers |
| `dockerStart` | `./gradlew dockerStart` | Resumes already-created containers |

The `build` task depends on `buildFrontend`, so compiling the backend already includes compiling the frontend.

### Environment Profiles

| Profile | Compose file | Containers | Access |
|---------|-------------|------------|--------|
| `dev` | — | none (local processes) | backend `:8080`, frontend `:5173` |
| `local` | `docker-compose.yml` | `frontend`, `backend` | `http://localhost` |
| `pro` | `docker-compose.prod.yml` | `frontend`, `backend`, `certbot` | `https://<DOMAIN>` |

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

---

## Unit Testing

### Test Structure

```
src/test/java/com/fbisquerra/aboutme/
│
└── {module}/
    ├── domain/                         # Domain logic tests (no Spring)
    │   ├── model/
    │   │   └── {Aggregate}Test.java
    │   ├── service/
    │   │   └── {Feature}DomainServiceTest.java
    │   └── value/
    │       └── {VO}Test.java
    │
    ├── application/                    # Use case tests
    │   └── usecase/
    │       └── {Action}UseCaseTest.java
    │
    └── fixtures/                       # Reusable test data
        └── {Entity}Fixture.java
```

### Frameworks and Libraries

- **Testing**: JUnit 5 (Jupiter)
- **Mocking**: Mockito
- **Assertions**: Hamcrest
- **HTTP Testing**: MockMvc
- **Fixtures**: Factory Methods Pattern

### Testing Principles

**Goal**: Ensure consistency, CI/CD reliability and code maintainability.

**Domain Layer Tests**:
- Pure unit tests (no `@SpringBootTest`)
- Validate business logic and domain rules
- Test Value Objects and their validations
- Test Aggregate behavior
- Do not mock internal domain dependencies
- No Spring annotations

**Application Layer Tests**:
- Use `@ExtendWith(MockitoExtension.class)`
- Mock repositories and domain services
- Test use case orchestration
- Validate DTO mapping
- Do not load Spring context
- Use `doReturn(...).when(mock).method()` syntax (not `when(...).thenReturn(...)`)

**Integration Tests** (with MockMvc):
- Use `@SpringBootTest` to load context
- Set up MockMvc manually via `MockMvcBuilders.webAppContextSetup(context).build()` in `@BeforeEach` (`@AutoConfigureMockMvc` no existe en Spring Boot 4)
- Use MockMvc to test controllers
- Validate full request → response flow
- Functionally named tests
- Do not test without MockMvc

### Test Structure: Arrange-Act-Assert

All tests follow the AAA pattern:

```
1. ARRANGE   → Prepare test data (fixtures)
2. ACT       → Execute the action to test
3. ASSERT    → Validate results with Hamcrest
```

### Test Naming

**High-level functional names** (not technical):

```
shouldSuccessfullyRegisterUserWithValidEmail()
shouldThrowExceptionWhenEmailAlreadyExists()
shouldValidatePasswordComplexity()
shouldAuthenticateUserWithCorrectCredentials()
shouldReturnUnauthorizedWhenPasswordIsWrong()
shouldReturnHttpCreatedStatusOnSuccessfulRegistration()
```

**Fixture location**:
```
{Entity}Fixture.java      # Factory Methods for creating test data
```

### Testing Conventions

- One test per expected behavior
- Independent tests (no execution order dependency)
- Data setup via fixtures (Factory Methods)
- Use Hamcrest matchers for readable assertions
- Write tests as good practice (TDD recommended)
- Keep tests simple and focused
- Do not test trivial getters/setters
- Do not hardcode magic values (use fixtures)
- Do not use `Thread.sleep()` in tests
- Do not share state between tests
- **Do not write unit tests for fixtures** — fixtures are test helpers, not production code

### Fixtures: Factory Methods

Fixtures provide consistent data for tests via Factory Methods:

```
UserFixture.java
├── validUser()                    # Valid user with standard data
├── userWithoutEmail()             # User without email
├── adminUser()                    # User with admin role
└── customUser(...)                # Custom factory method
```

Benefits:
- Test data reuse
- Easy centralized maintenance
- Descriptive names
- Flexibility to create variants

### Assertions with Hamcrest

Use readable and expressive matchers for validations.

---

## Current Technical Configuration

**Backend (Spring Boot)**:
- Version: 4.0.4
- Java: 26
- Current dependencies:
  - `spring-boot-starter-web`
  - `spring-boot-starter-json` (Jackson 3.x — required explicitly, not transitive in Spring Boot 4)
- Pending dependencies (to add when needed):
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-validation`
  - `spring-boot-starter-security`
  - Database driver (PostgreSQL or H2)

**Build**: Gradle 8.x

**Package**: `com.fbisquerra.aboutme`

**Frontend (Vue 3)**:
- Vue: 3.5.34
- Vite: 5.4.11
- Tailwind CSS: 4.3.0 (via plugin `@tailwindcss/vite`)
- Axios: 1.7.9

---

## Where to Find Information

- **DDD Documentation**: Eric Evans - Domain Driven Design
- **Hexagonal Architecture**: Alistair Cockburn
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Configuration**: `src/main/resources/application.yml`

---

**Last updated**: Migration to Vue 3 + deployment tools (2026-05-24)
**Version**: 4.0
**Status**: Under active development
