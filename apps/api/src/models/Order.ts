import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type OrderStatus = "NEW" | "PROCESSING" | "DONE" | "CANCELLED";

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: string;
  declare phone: string;
  declare status: OrderStatus;
  declare statusReason: string | null;
  declare totalAmount: string; // DECIMAL comes as string
  declare currency: string;
  declare meta: unknown | null;
  // Google Click ID: заказ пришёл с рекламы → офлайн-конверсия при закрытии сделки
  declare gclid: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Order.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    phone: { type: DataTypes.STRING(32), allowNull: false },
    status: { type: DataTypes.STRING(24), allowNull: false, defaultValue: "NEW" },
    statusReason: { type: DataTypes.TEXT, allowNull: true },
    totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "UZS" },
    meta: { type: DataTypes.JSONB, allowNull: true },
    gclid: { type: DataTypes.STRING(200), allowNull: true }
  },
  { sequelize, tableName: "orders" }
);

