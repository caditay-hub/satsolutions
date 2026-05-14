import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("solutions", "categoryId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "categories", key: "id" },
    onDelete: "SET NULL"
  });
  await qi.addIndex("solutions", ["categoryId"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeIndex("solutions", ["categoryId"]);
  await qi.removeColumn("solutions", "categoryId");
};

