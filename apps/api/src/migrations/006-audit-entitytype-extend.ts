import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  // Postgres: extend enum type created in migration 002
  // NOTE: cannot easily "down" enum changes.
  await qi.sequelize.query('ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS \'SOLUTION\';');
  await qi.sequelize.query('ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS \'SERVICE\';');
  await qi.sequelize.query('ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS \'PORTFOLIO\';');
};

export const down: MigrationFn = async () => {
  // no-op
};

