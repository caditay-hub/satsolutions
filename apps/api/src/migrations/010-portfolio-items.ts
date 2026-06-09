import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("portfolio_projects", "items", { type: DataTypes.JSONB, allowNull: true });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeColumn("portfolio_projects", "items");
};

