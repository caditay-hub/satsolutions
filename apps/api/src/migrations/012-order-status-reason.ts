import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("orders", "statusReason", { type: DataTypes.TEXT, allowNull: true });
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("orders", "statusReason");
};

