import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("portfolio_categories", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "portfolio_categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.addIndex("portfolio_categories", ["parentId"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("portfolio_categories");
};

