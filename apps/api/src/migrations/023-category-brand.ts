import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("categories", "brandId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "brands", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
  await qi.addIndex("categories", ["brandId"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeIndex("categories", ["brandId"]);
  await qi.removeColumn("categories", "brandId");
};

