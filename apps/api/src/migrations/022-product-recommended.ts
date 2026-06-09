import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("products", "recommended", { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false });
  await qi.addIndex("products", ["recommended"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeIndex("products", ["recommended"]);
  await qi.removeColumn("products", "recommended");
};

