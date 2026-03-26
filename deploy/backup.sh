#!/bin/bash
# PostgreSQL backup script — run via cron daily
set -euo pipefail

BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-school_db}"
DB_USER="${DB_USERNAME:-postgres}"

mkdir -p "$BACKUP_DIR"

echo "Starting backup at $TIMESTAMP..."
PGPASSWORD="${DB_PASSWORD}" pg_dump -h "${DB_HOST:-localhost}" -U "$DB_USER" "$DB_NAME" \
  --format=custom --compress=9 \
  -f "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.dump" -mtime +30 -delete

echo "Backup completed: ${DB_NAME}_${TIMESTAMP}.dump"
