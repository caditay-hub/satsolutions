import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("products", "isUsd", { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false });
  await qi.addIndex("products", ["isUsd"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeIndex("products", ["isUsd"]);
  await qi.removeColumn("products", "isUsd");
};

