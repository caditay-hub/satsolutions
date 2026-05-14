import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare productName: string;
  declare productSlug: string;
  declare productCoverImageUrl: string | null;
  declare unitPrice: string; // DECIMAL comes as string
  declare quantity: number;
  declare lineTotal: string; // DECIMAL comes as string
  declare createdAt: Date;
  declare updatedAt: Date;
}

OrderItem.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    productName: { type: DataTypes.STRING(200), allowNull: false },
    productSlug: { type: DataTypes.STRING(240), allowNull: false },
    productCoverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 }
  },
  { sequelize, tableName: "order_items" }
);

