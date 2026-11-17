import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

/** Журнал нажатий на кнопку Telegram у посетителей с рекламы: короткий код из ссылки на бота →
 *  метка клика Google Ads. Бот по коду забирает метку и прикладывает её к обращению в CRM.
 *  Личных данных нет. Записи старше 90 дней удаляются (routes/telegramClick.ts). */
export class TelegramClick extends Model<InferAttributes<TelegramClick>, InferCreationAttributes<TelegramClick>> {
  declare token: string;
  declare gclid: string;
  declare page: string | null;
  declare createdAt: CreationOptional<Date>;
  declare usedAt: CreationOptional<Date | null>;
}

TelegramClick.init(
  {
    token: { type: DataTypes.STRING(16), primaryKey: true, allowNull: false },
    gclid: { type: DataTypes.STRING(200), allowNull: false },
    page: { type: DataTypes.STRING(300), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    usedAt: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, tableName: "telegram_clicks", timestamps: true, updatedAt: false }
);
