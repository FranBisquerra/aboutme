# AI Guide - About Me Project

Personal website running in production (auth, email sending, backoffice…), built with
production-grade architecture and practices. Features are delivered incrementally, and
the codebase is designed to evolve into a full product.

Stack, project structure, run profiles and deployment live in the **README**. This file
covers the rules and conventions for working on the code.

---

## Critical Restrictions

**GIT**:

- **DO NOT COMMIT OR PUSH WITHOUT EXPLICIT USER INSTRUCTION** — see `/commit`.
- Verify with `git status` before staging; atomic commits with clear messages.
- Never force-push, never modify existing commit history.

**TESTS**:

- **DO NOT RUN `./gradlew test` UNLESS EXPLICITLY INSTRUCTED** (needs Docker, slow).
- Compiling with `./gradlew build` to check for compilation errors is fine.
- If compilation fails, report it to the user instead of committing.

**CODE CHANGES**:

- Before significant changes, inform the user of the complete plan and wait for
  explicit confirmation.
- If in doubt about design or architecture, ask first — don't assume preferences.

---

## Philosophy: YAGNI, incremental

- Small working versions over many half-done features; refactor gradually as requirements grow.
- Implement only what is needed now — no "just in case" code, layers, or patterns.
- Add dependencies only when a specific feature needs them; don't duplicate what
  current dependencies already provide.

---

## Architecture

**Backend** (`com.fbisquerra.aboutme` — Spring Boot 4, Java 26): Hexagonal + DDD.
One module per aggregate (`profile`, `contact`, `user`, plus `shared`), each with three layers:

- `domain/` — model, ports (e.g. `{Aggregate}Repository`), pure logic.
  **No Spring imports or annotations.** Value Objects immutable, validated in the constructor.
- `application/` — use cases (orchestration only), DTOs, mappers. No business logic.
- `infrastructure/` — the only layer touching JPA/HTTP/external systems: controllers,
  persistence adapters (`Jpa{Aggregate}Repository` — named by technology, never `Impl`).

Full structure, naming and checklist: `/new-module`.

**Database**: MariaDB. Schema owned by Flyway migrations (`src/main/resources/db/migration/`);
`spring.jpa.hibernate.ddl-auto: validate` — Hibernate never mutates the schema. See `/new-migration`.

**Frontend** (Vue 3 + TypeScript): smart pages / presentational components, grouped by domain
then feature (`pages/front/*`, `pages/backoffice/*`) with per-route layouts (`DefaultLayout`
public / `AdminLayout` admin dashboard) selected via `meta.layout`; server state in
TanStack Query, client state in Pinia; UI with **Nuxt UI** (auto-imported `U*` components,
Tailwind 4, lucide icons) — chosen over PrimeVue when v5 went commercial; forms with `UForm`
+ Zod; HTTP centralized in `api/` over `client.ts`. Full recipe: `/new-page`.

---

## Frontend Testing Strategy

Which layer a test belongs to — the question is not "unit vs e2e", it's what the test protects.

- **Pure logic → test it directly.** `utils/`, `stores/`, `api/client.ts` (interceptors), and
  components whose logic is their own DOM/state with no backend (`BackToTop.vue`). Cheap, fast,
  and awkward to reach from above.
- **Anything else → page test with `mountWithPlugins` (the default).** It installs the real
  router, Pinia, Nuxt UI and TanStack Query and mocks only the HTTP edge (`vi.spyOn(api/*)`).
  Assert **user-visible behaviour + the payload sent to `api/*`**, never internals.
  `pages/front/login/LoginPage.test.ts` is the reference.
- **Don't write**: tests asserting that a component renders some copy or that a static element
  exists, and tests for presentational components (props in / emits out) with no logic — the
  page test that uses them already covers those. A test that only breaks when the wording
  changes has negative value; delete it instead of updating it.

**Known gap, accepted**: `api/*` is always mocked, so a change in the backend DTO shape breaks
nothing in the frontend suite. It is caught by hand with `/verify-e2e`. If browser e2e is ever
added, it runs only on PRs labelled `autodeploy`, never on every PR to develop.

CI (`.github/workflows/pr-checks.yml`) gates merges on `./gradlew test`, `npm run type-check`
and `npm test`.

---

## Spring Boot 4 Compatibility Notes

- **Jackson 3.x**: package moved from `com.fasterxml.jackson` to `tools.jackson`
  (`tools.jackson.databind.ObjectMapper`, etc.), and `spring-boot-starter-json` must be
  declared explicitly in `build.gradle` (no longer transitive).
- **MockMvc**: `@AutoConfigureMockMvc` removed — set it up with
  `MockMvcBuilders.webAppContextSetup(context).build()`.
- **Mockito as Java agent**: Java 26 forbids dynamic agent loading; Mockito runs as
  `-javaagent` via the `mockitoAgent` configuration in `build.gradle`.

## Code Style (Java)

- **Prefer `var` for local variables** when the type is evident from the right-hand side
  (e.g. `var user = userRepository.findByUsername(...)`). Keep the explicit type when the
  inferred type is not obvious (generic-heavy returns, ternaries, `var x = null`).
  `var` is for **local variables only** — never fields, parameters, or return types.

## Avoid

- Business logic in controllers; JPA entities in business logic (map to domain first).
- Spring imports in `domain/`.
- Exposing domain objects via REST — always DTOs.
- Hardcoded values — use `application.yml`.
- Commented-out or dead code.
- New layers/modules without documenting their purpose.

---

## Skills (invoke on demand)

- `/unit-test` — backend unit tests (JUnit 5, Mockito, Hamcrest, fixtures)
- `/it-test` — backend integration tests (MockMvc, Testcontainers, Spring Boot 4 setup)
- `/new-module` — checklist for a new DDD module end-to-end
- `/new-page` — recipe for a new Vue page (smart/presentational, TanStack Query, forms)
- `/new-migration` — Flyway migration (naming, MariaDB conventions, entity sync)
- `/verify-e2e` — smoke-test a backend change against the real app (second instance on `:8082`)
- `/commit` — commit conventions (ask first, atomic, `<Feature>: <Verb>` subject)
