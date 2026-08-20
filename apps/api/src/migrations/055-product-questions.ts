import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// Q&A на карточках товаров («Вопрос инженеру»). Публикуются только
// отвеченные и одобренные вопросы (status=APPROVED + answer).
export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("product_questions", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: true },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "PENDING" },
    meta: { type: DataTypes.JSONB, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
  await qi.addIndex("product_questions", ["productId", "status"]);
  await qi.addIndex("product_questions", ["status", "createdAt"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("product_questions");
};
