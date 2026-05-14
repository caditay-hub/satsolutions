import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Partner extends Model<InferAttributes<Partner>, InferCreationAttributes<Partner>> {
  declare id: string;
  declare name: string;
  declare websiteUrl: string | null;
  declare logoImageUrl: string | null;
  declare sortOrder: number;
  declare published: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Partner.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    websiteUrl: { type: DataTypes.STRING(1000), allowNull: true },
    logoImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "partners" }
);

