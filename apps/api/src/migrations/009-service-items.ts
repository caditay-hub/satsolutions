import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("services", "items", { type: DataTypes.JSONB, allowNull: true });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeColumn("services", "items");
};

