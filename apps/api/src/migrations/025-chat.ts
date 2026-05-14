import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("chat_conversations", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    visitorId: { type: DataTypes.STRING(80), allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: true },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    email: { type: DataTypes.STRING(200), allowNull: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "OPEN" },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
  await qi.addIndex("chat_conversations", ["visitorId"], { unique: true });
  await qi.addIndex("chat_conversations", ["status"]);
  await qi.addIndex("chat_conversations", ["lastMessageAt"]);

  await qi.createTable("chat_messages", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "chat_conversations", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    sender: { type: DataTypes.STRING(10), allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
  await qi.addIndex("chat_messages", ["conversationId"]);
  await qi.addIndex("chat_messages", ["createdAt"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("chat_messages");
  await qi.dropTable("chat_conversations");
};

