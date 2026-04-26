#!/usr/bin/env bash
# Initialize a PostgreSQL cluster in ./database/pgdata using host binaries.
# Requires: apt install postgresql (or matching postgres version with initdb in PATH).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PGDATA="${PGDATA:-$ROOT/database/pgdata}"
if [[ -f "$PGDATA/PG_VERSION" ]]; then
  echo "Cluster already exists: $PGDATA"
  exit 0
fi
mkdir -p "$PGDATA"
if ! command -v initdb >/dev/null 2>&1; then
  echo "initdb not found. Install PostgreSQL (e.g. sudo apt install postgresql) or use Docker:" >&2
  echo "  mkdir -p database/pgdata && docker compose up -d" >&2
  exit 1
fi
# Dev-only auth; tighten (--auth-host=scram-sha-256 + pg_hba) before any exposure.
initdb -D "$PGDATA" --username=app --auth-local=trust --auth-host=trust --locale=C -E UTF8
echo "Created cluster at $PGDATA"
echo "Start with: pg_ctl -D \"$PGDATA\" -l \"$PGDATA/logfile\" start"
