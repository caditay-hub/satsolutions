import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// gclid у заявок: связка «клик по рекламе → заявка → сделка в CRM» для
// офлайн-конверсий Google Ads (uploadClickConversions с ценностью сделки).
export const up: MigrationFn = async ({ context: qi }) => {
  // Колонка добавлена на проде вручную раньше деплоя (чтобы не падал крон
  // sync-feedback CRM) — миграция должна быть идемпотентной.
  const table: any = await (qi as any).describeTable("feedback_messages");
  if (!table.gclid) {
    await qi.addColumn("feedback_messages", "gclid", {
      type: DataTypes.STRING(200),
      allowNull: true
    });
  }
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("feedback_messages", "gclid");
};
