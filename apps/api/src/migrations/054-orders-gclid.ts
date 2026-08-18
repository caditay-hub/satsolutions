import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

// gclid у заказов корзины — та же связка «клик по рекламе → сделка», что и у
// заявок форм (053). Колонка добавлена на проде вручную раньше деплоя
// (разблокировали синк заказов в CRM) — миграция идемпотентна.
export const up: MigrationFn = async ({ context: qi }) => {
  const table: any = await (qi as any).describeTable("orders");
  if (!table.gclid) {
    await qi.addColumn("orders", "gclid", {
      type: DataTypes.STRING(200),
      allowNull: true
    });
  }
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.removeColumn("orders", "gclid");
};
