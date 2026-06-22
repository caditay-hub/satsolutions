import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type ChatConversationStatus = "OPEN" | "CLOSED";

export class ChatConversation extends Model<InferAttributes<ChatConversation>, InferCreationAttributes<ChatConversation>> {
  declare id: string;
  declare visitorId: string;
  declare name: string | null;
  declare phone: string | null;
  declare email: string | null;
  declare page: string | null;
  declare status: ChatConversationStatus;
  declare lastMessageAt: Date | null;
  declare unreadCount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ChatConversation.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    visitorId: { type: DataTypes.STRING(80), allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: true },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    email: { type: DataTypes.STRING(200), allowNull: true },
    page: { type: DataTypes.STRING(300), allowNull: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "OPEN" },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
    unreadCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  },
  {
    sequelize,
    tableName: "chat_conversations",
    timestamps: true,
    indexes: [{ unique: true, fields: ["visitorId"] }]
  }
);

