import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare parentId: string | null;
  declare coverImageUrl: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    coverImageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "categories"
  }
);
