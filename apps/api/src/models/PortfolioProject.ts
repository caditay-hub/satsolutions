import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class PortfolioProject extends Model<
  InferAttributes<PortfolioProject>,
  InferCreationAttributes<PortfolioProject>
> {
  declare id: string;
  declare title: string;
  declare slug: string;
  declare excerpt: string | null;
  declare content: string | null;
  declare coverImageUrl: string | null;
  declare galleryImageUrls: string[] | null;
  declare items: unknown[] | null;
  declare portfolioCategoryId: string | null;
  declare clientName: string | null;
  declare clientlogourl: string | null;
  declare clientTasks: string | null;
  declare location: string | null;
  declare completedAt: Date | null;
  declare seoTitle: string | null;
  declare seoDescription: string | null;
  declare sortOrder: number;
  declare published: boolean;
  declare publishedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PortfolioProject.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
    excerpt: { type: DataTypes.STRING(800), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    galleryImageUrls: { type: DataTypes.JSONB, allowNull: true },
    items: { type: DataTypes.JSONB, allowNull: true },
    portfolioCategoryId: { type: DataTypes.UUID, allowNull: true },
    clientName: { type: DataTypes.STRING(240), allowNull: true },
    clientlogourl: { type: DataTypes.STRING(1000), allowNull: true },
    clientTasks: { type: DataTypes.TEXT, allowNull: true },
    location: { type: DataTypes.STRING(240), allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    seoTitle: { type: DataTypes.STRING(300), allowNull: true },
    seoDescription: { type: DataTypes.STRING(600), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  },
  { sequelize, tableName: "portfolio_projects" }
);

