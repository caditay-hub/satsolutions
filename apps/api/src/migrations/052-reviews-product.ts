import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// Отзывы на товары: productId (null = отзыв о компании/услуге).
export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("reviews", "productId", { type: DataTypes.UUID, allowNull: true });
  await qi.addIndex("reviews", ["productId"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("reviews", "productId");
};
