import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Certificate extends Model<InferAttributes<Certificate>, InferCreationAttributes<Certificate>> {
  declare id: string;
  declare name: string;
  declare category: "certificate" | "dealer" | "award";
  declare imageUrl: string | null;
  declare description: string | null;
  declare issuedBy: string | null;
  declare sortOrder: number;
  declare published: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Certificate.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(300), allowNull: false },
    category: { type: DataTypes.ENUM("certificate", "dealer", "award"), allowNull: false, defaultValue: "certificate" },
    imageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    issuedBy: { type: DataTypes.STRING(300), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "certificates" }
);
