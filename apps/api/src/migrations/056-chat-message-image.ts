import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// Фото в онлайн-чате сайта: менеджер отвечает картинкой из Telegram-темы диалога,
// посетитель прикладывает снимок из виджета. Сам файл лежит в uploads/chat/,
// здесь — его публичный адрес. Текст у такого сообщения может быть пустым.
export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("chat_messages", "imageUrl", { type: DataTypes.STRING(500), allowNull: true });
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("chat_messages", "imageUrl");
};
