import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

export type OrderStatus = "NEW" | "PROCESSING" | "DONE" | "CANCELLED";

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<string>;
  declare phone: string;
  declare status: OrderStatus;
  declare statusReason: string | null;
  declare totalAmount: string; // DECIMAL comes as string
  declare currency: string;
  declare meta: unknown | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "orders" }
);

