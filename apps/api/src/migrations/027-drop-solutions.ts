import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.sequelize.query('DROP TABLE IF EXISTS "solutions" CASCADE');
  await qi.sequelize.query('DROP TABLE IF EXISTS "solution_categories" CASCADE');
};

export const down: MigrationFn = async () => {
  // Recreating solutions/solution_categories would require full table definitions; leave no-op.
};
