# /verify-e2e — Verify a Backend Change Against the Real App

Smoke-test a backend change end-to-end (real HTTP, real MariaDB) without running
`./gradlew test` and without touching the user's running processes.

## Ground rules

- **Never kill or restart the user's backend on `:8080`** (IntelliJ / compose) — launch a
  second instance on another port instead.
- The dev database belongs to the user: if a check mutates data, **save the original state
  first and restore it at the end** (e.g. GET the entity before, PUT it back after).
- Never print secrets from `.env` — use them only inside shell variables.

## 1. Prerequisites

The dev `db` container must be up (`docker ps` → `aboutme-db-1 … healthy`). If not:
`./gradlew dockerRun -Pprofile=dev`.

## 2. Launch a verification instance on `:8082`

`bootRun` does not load `.env`, and the datasource default points at host `db` — override
it to `localhost`. Run in background:

```bash
cd /path/to/aboutme && set -a && source .env && set +a && \
SERVER_PORT=8082 \
DB_URL="jdbc:mariadb://localhost:3306/${MARIADB_DATABASE}" \
DB_USERNAME="$MARIADB_USER" DB_PASSWORD="$MARIADB_PASSWORD" \
./gradlew bootRun --console=plain -q
```

Poll `http://localhost:8082/api/profile` until it returns 200 (Flyway + Boot ≈ 10 s with a
warm daemon). Confirm in the log that Tomcat bound `:8082` before trusting a fast 200.

## 3. Admin token (for protected endpoints)

```bash
token=$(curl -s -X POST http://localhost:8082/api/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}" \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')
```

## 4. Exercise the change

Cover at least: the happy path, `401` without token (protected endpoints), and `400` on
invalid payload (Bean Validation). Assert side effects with a follow-up GET.

## 5. Tear down

Kill the bootRun process (its PID is in the startup log line), then confirm:
`:8082` unreachable, `:8080` still returns 200, and any mutated data restored.

Remind the user their `:8080` backend still runs the **old** code — they must restart it
themselves to try the change from the Vite frontend.
