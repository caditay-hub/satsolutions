import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Brand extends Model<InferAttributes<Brand>, InferCreationAttributes<Brand>> {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare logoImageUrl: string | null;
  declare sortOrder: number;
  declare published: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Brand.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(240), allowNull: false, unique: true },
    logoImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "brands" }
);

