import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type FeedbackStatus = "NEW" | "DONE";

export class FeedbackMessage extends Model<InferAttributes<FeedbackMessage>, InferCreationAttributes<FeedbackMessage>> {
  declare id: string;
  declare name: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare message: string;
  declare status: FeedbackStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}

FeedbackMessage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: true },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    email: { type: DataTypes.STRING(200), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "NEW" }
  },
  { sequelize, tableName: "feedback_messages" }
);

