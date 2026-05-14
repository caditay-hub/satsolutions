import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type SitePageKey = "about" | "contact" | "site";

export class SitePage extends Model<InferAttributes<SitePage>, InferCreationAttributes<SitePage>> {
  declare id: string;
  declare key: SitePageKey;
  declare title: string;
  declare content: string | null;
  declare coverImageUrl: string | null;
  declare data: unknown | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

SitePage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    key: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    data: { type: DataTypes.JSONB, allowNull: true }
  },
  { sequelize, tableName: "site_pages" }
);

