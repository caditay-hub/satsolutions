import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { sequelize } from "../db.js";

export class ServiceCategory extends Model<InferAttributes<ServiceCategory>, InferCreationAttributes<ServiceCategory>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare slug: string;
    declare title: string | null;
    declare description1: string | null;
    declare description2: string | null;
    declare imageUrl: string | null;
    declare sortOrder: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

ServiceCategory.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(240), allowNull: false },
        slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
        title: { type: DataTypes.STRING(240), allowNull: true },
        description1: { type: DataTypes.TEXT, allowNull: true },
        description2: { type: DataTypes.TEXT, allowNull: true },
        imageUrl: { type: DataTypes.STRING(1000), allowNull: true },
        sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { sequelize, tableName: "service_categories" }
);
