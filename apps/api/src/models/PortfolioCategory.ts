import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

export class PortfolioCategory extends Model<InferAttributes<PortfolioCategory>, InferCreationAttributes<PortfolioCategory>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare parentId: string | null;
  declare coverImageUrl: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PortfolioCategory.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    parentId: { type: DataTypes.UUID, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "portfolio_categories" }
);

