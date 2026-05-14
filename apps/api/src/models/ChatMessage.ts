import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type ChatSender = "USER" | "ADMIN";

export class ChatMessage extends Model<InferAttributes<ChatMessage>, InferCreationAttributes<ChatMessage>> {
  declare id: string;
  declare conversationId: string;
  declare sender: ChatSender;
  declare text: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ChatMessage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    conversationId: { type: DataTypes.UUID, allowNull: false },
    sender: { type: DataTypes.STRING(10), allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false }
  },
  { sequelize, tableName: "chat_messages" }
);

