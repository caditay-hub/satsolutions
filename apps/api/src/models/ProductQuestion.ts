import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

export type ProductQuestionStatus = "PENDING" | "APPROVED" | "HIDDEN";

/** Вопрос покупателя на карточке товара («Вопрос инженеру»).
 *  Публикуется только после ответа и модерации (status=APPROVED + answer). */
export class ProductQuestion extends Model<InferAttributes<ProductQuestion>, InferCreationAttributes<ProductQuestion>> {
  declare id: CreationOptional<string>;
  declare productId: string;
  declare name: string | null;
  declare phone: string | null;
  declare question: string;
  declare answer: string | null;
  declare status: CreationOptional<ProductQuestionStatus>;
  declare meta: unknown | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductQuestion.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    productId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: true },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "PENDING" },
    meta: { type: DataTypes.JSONB, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: "product_questions" }
);
