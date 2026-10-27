import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// gclid у диалогов чата: виджет шлёт метку клика Google Ads отдельным полем
// (cookie _gcl_aw живёт 90 дней), бот отдаёт её в CRM для офлайн-конверсий.
// Идемпотентно, как 053: колонка добавляется только если её ещё нет.
export const up: MigrationFn = async ({ context: qi }) => {
  const table: any = await (qi as any).describeTable("chat_conversations");
  if (!table.gclid) {
    await qi.addColumn("chat_conversations", "gclid", {
      type: DataTypes.STRING(200),
      allowNull: true
    });
  }
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("chat_conversations", "gclid");
};
