import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// Отзывы/оценки сайта. Публикуются только после модерации (status=APPROVED).
// serviceKey — опц. привязка к услуге (null = отзыв о компании в целом).
export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("reviews", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    authorName: { type: DataTypes.STRING(120), allowNull: true },
    text: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "PENDING" },
    serviceKey: { type: DataTypes.STRING(40), allowNull: true },
    meta: { type: DataTypes.JSONB, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
  await qi.addIndex("reviews", ["status", "createdAt"]);
  await qi.addIndex("reviews", ["serviceKey"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("reviews");
};
