# /new-migration — Add a Flyway Database Migration

Checklist for evolving the MariaDB schema with a versioned Flyway migration
(e.g. create a table, add a column, seed data).

## Location & naming

```
src/main/resources/db/migration/
└── V{n}__{snake_case_description}.sql
```

- `V` prefix, integer version `{n}` strictly greater than the last existing one.
- Double underscore `__` between version and description.
- Description in `snake_case`: `V3__create_user_table.sql`, `V4__add_avatar_to_profile.sql`.
- One migration per logical change. Schema changes (`V_..._create/alter`) and data
  seeds (`V_..._seed`) go in separate files.

## SQL conventions (MariaDB)

- Table and column names in `snake_case`; tables singular (`profile`, `profile_skill`).
- `id BIGINT NOT NULL AUTO_INCREMENT`, `PRIMARY KEY (id)`.
- **Do not name the PRIMARY KEY constraint** — MariaDB always names it `PRIMARY` and ignores
  any custom name, warning with error 1280. Use a plain `PRIMARY KEY (id)` (FKs *can* be named).
- Explicit, **named** foreign keys: `CONSTRAINT fk_{child}_{parent} FOREIGN KEY (...) REFERENCES {parent} (id) ON DELETE CASCADE`.
- `ENGINE = InnoDB`.
- Long free text → `TEXT`; short strings → `VARCHAR(n)`.
- Escape single quotes in string literals by doubling them (`'you''ll'`).
- Use `SET @id = LAST_INSERT_ID();` to reference an auto-generated id in a seed.

## Hard rules

- **Never edit a migration that has already been applied** (Flyway validates checksums).
  To fix or change something, add a **new** migration.
- Never lower a version number or reuse one.
- `spring.jpa.hibernate.ddl-auto` is `validate` — Flyway is the single source of truth
  for the schema; Hibernate only checks the entities match.

## After creating the migration

If the migration adds/changes a table that the domain reads or writes:

- [ ] Migration file created under `db/migration/` with the next `V{n}` number
- [ ] JPA entity in `{module}/infrastructure/persistence/` matches the new columns
  (`@Column(name = "...")` for snake_case columns)
- [ ] Repository / adapter mapping updated (entity ↔ domain)
- [ ] Integration test runs against the real schema (Testcontainers MariaDB applies
  the migration automatically) — see `/it-test`
- [ ] `./gradlew build` passes (Hibernate `validate` confirms entities match the schema)
