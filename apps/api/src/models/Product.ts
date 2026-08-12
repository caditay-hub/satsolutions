import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare price: string; // Sequelize DECIMAL comes as string
  declare isUsd: boolean;
  declare recommended: boolean;
  declare modelCode: string | null;
  declare shortDescription: string | null;
  declare description: string | null;
  declare characteristics: Record<string, string> | null;
  declare coverImageUrl: string | null;
  declare galleryImageUrls: string[] | null;
  declare published: boolean;
  declare inStock: CreationOptional<boolean>;
  declare categoryId: string | null;
  declare brandId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(240),
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    isUsd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    modelCode: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    characteristics: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    coverImageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    galleryImageUrls: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // false = «под заказ»: карточка остаётся в каталоге, поиске и sitemap
    // (позиции в Google не теряются), но меняется бейдж, JSON-LD (BackOrder)
    // и availability в Merchant-фиде. Полное снятие — published=false + removedProducts.ts
    inStock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true
  }
);

