import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("products", "brandId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "brands", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
  await qi.addIndex("products", ["brandId"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("products", "brandId");
};

