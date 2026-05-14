import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  // Nested categories
  await qi.addColumn("categories", "parentId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "categories", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
  await qi.addIndex("categories", ["parentId"]);

  // Product fields
  await qi.addColumn("products", "price", {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  });

  await qi.addColumn("products", "characteristics", {
    type: DataTypes.JSONB,
    allowNull: true
  });
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("products", "characteristics");
  await qi.removeColumn("products", "price");
  await qi.removeColumn("categories", "parentId");
};

