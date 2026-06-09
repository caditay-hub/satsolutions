import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("portfolio_projects", "portfolioCategoryId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "portfolio_categories", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
  await qi.addIndex("portfolio_projects", ["portfolioCategoryId"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeColumn("portfolio_projects", "portfolioCategoryId");
};

