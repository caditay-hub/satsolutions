import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// Голосовые, видео и файлы в онлайн-чате сайта (06.10.2026). Раньше чат принимал только
// текст и фото: договор PDF, голосовое или видео менеджера из Telegram-темы клиенту на
// сайт не доходили. Вложение — JSON { url, kind, name, size, mime, duration }; сам файл
// лежит в uploads/chat/.
export const up: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("chat_messages", "attachment", { type: DataTypes.JSONB, allowNull: true });
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("chat_messages", "attachment");
};
