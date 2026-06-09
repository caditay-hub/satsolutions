import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

export class Partner extends Model<InferAttributes<Partner>, InferCreationAttributes<Partner>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare websiteUrl: string | null;
  declare logoImageUrl: string | null;
  declare sortOrder: number;
  declare published: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Partner.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    websiteUrl: { type: DataTypes.STRING(1000), allowNull: true },
    logoImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "partners" }
);

