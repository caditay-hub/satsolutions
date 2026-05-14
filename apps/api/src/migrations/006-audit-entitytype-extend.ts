import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  // Postgres: extend enum type created in migration 002
  // NOTE: cannot easily "down" enum changes.
  // @ts-expect-error postgres only
  await qi.sequelize.query('ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS \'SOLUTION\';');
  // @ts-expect-error postgres only
  await qi.sequelize.query('ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS \'SERVICE\';');
  // @ts-expect-error postgres only
  await qi.sequelize.query('ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS \'PORTFOLIO\';');
};

export const down: MigrationFn = async () => {
  // no-op
};

