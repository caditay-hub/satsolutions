import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// Журнал «короткий код → метка клика Google Ads» для кнопки Telegram (решение владельца 16.11.2026).
// В ссылку на бота (?start=) влезает до 64 знаков [A-Za-z0-9_-], метка клика длиннее — поэтому сайт
// кладёт сюда пару «код → метка», а бот по коду из /start g_<код> забирает метку и отдаёт её в CRM.
// Личных данных нет: код, метка клика, адрес страницы, время. Хранится 90 дней (окно конверсии Google).
// Идемпотентно: таблица создаётся, только если её ещё нет.
export const up: MigrationFn = async ({ context: qi }) => {
  const tables = await qi.showAllTables();
  const exists = tables.some((t: any) => String((t as any).tableName ?? t).toLowerCase() === "telegram_clicks");
  if (exists) return;
  await qi.createTable("telegram_clicks", {
    token: { type: DataTypes.STRING(16), primaryKey: true, allowNull: false },
    gclid: { type: DataTypes.STRING(200), allowNull: false },
    page: { type: DataTypes.STRING(300), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    usedAt: { type: DataTypes.DATE, allowNull: true }
  });
  await qi.addIndex("telegram_clicks", ["createdAt"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("telegram_clicks");
};
