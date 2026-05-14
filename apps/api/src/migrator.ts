import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";

export function createMigrator() {
  const cwd = path.dirname(fileURLToPath(import.meta.url));
  return new Umzug({
    migrations: {
      glob: ["migrations/*.{ts,js}", { cwd }]
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: "SequelizeMeta" }),
    logger: console
  });
}

export async function runMigrations() {
  const qi = sequelize.getQueryInterface();
  const tables = await qi.showAllTables();
  const hasMeta = tables.some((t: any) => String((t as any).tableName ?? t).toLowerCase() === "sequelizemeta");

  // If user ran `sequelize.sync()` before migrations existed, tables may exist but meta doesn't.
  // In that case, create meta table and mark initial migration as executed to avoid failing.
  if (!hasMeta) {
    const hasAnyCoreTable = ["users", "products", "categories", "posts"].some((name) =>
      tables.some((t: any) => String((t as any).tableName ?? t).toLowerCase() === name)
    );
    if (hasAnyCoreTable) {
      await sequelize.query('CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255) PRIMARY KEY);');
      await sequelize.query(
        'INSERT INTO "SequelizeMeta"(name) VALUES ($1) ON CONFLICT (name) DO NOTHING;',
        { bind: ["001-initial.ts"] }
      );
    }
  }

  const umzug = createMigrator();
  await umzug.up();
}

