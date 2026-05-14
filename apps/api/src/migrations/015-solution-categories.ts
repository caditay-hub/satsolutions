import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("solution_categories", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "solution_categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.addIndex("solution_categories", ["parentId"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("solution_categories");
};

