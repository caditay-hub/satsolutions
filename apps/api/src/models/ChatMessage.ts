import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type ChatSender = "USER" | "ADMIN";

/** Вложение сообщения чата (кроме фото — у фото своё поле imageUrl). */
export type ChatAttachment = {
  url: string;
  kind: "voice" | "audio" | "video" | "file";
  name: string;
  size: number;
  mime: string;
  duration?: number | null;
};

export class ChatMessage extends Model<InferAttributes<ChatMessage>, InferCreationAttributes<ChatMessage>> {
  declare id: string;
  declare conversationId: string;
  declare sender: ChatSender;
  declare text: string;
  declare imageUrl: CreationOptional<string | null>;
  declare attachment: CreationOptional<ChatAttachment | null>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ChatMessage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    conversationId: { type: DataTypes.UUID, allowNull: false },
    sender: { type: DataTypes.STRING(10), allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    attachment: { type: DataTypes.JSONB, allowNull: true }
  },
  { sequelize, tableName: "chat_messages" }
);

