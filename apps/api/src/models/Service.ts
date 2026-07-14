import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare slug: string;
  declare excerpt: string | null;
  declare content: string | null;
  declare coverImageUrl: string | null;
  declare parentId: string | null;
  declare serviceCategoryId: string | null;
  declare overviewImageUrl: string | null;
  declare items: unknown[] | null;
  declare seoTitle: string | null;
  declare seoDescription: string | null;
  declare sortOrder: number;
  declare published: boolean;
  declare publishedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Service.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
    parentId: { type: DataTypes.UUID, allowNull: true, references: { model: "services", key: "id" }, onDelete: "SET NULL" },
    serviceCategoryId: { type: DataTypes.UUID, allowNull: true, references: { model: "service_categories", key: "id" }, onDelete: "SET NULL" },
    excerpt: { type: DataTypes.STRING(800), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    overviewImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    items: { type: DataTypes.JSONB, allowNull: true },
    seoTitle: { type: DataTypes.STRING(300), allowNull: true },
    seoDescription: { type: DataTypes.STRING(600), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "services" }
);

