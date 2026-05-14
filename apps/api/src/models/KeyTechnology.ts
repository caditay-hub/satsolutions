import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type ForeignKey } from "sequelize";
import { sequelize } from "../db.js";
import { Service } from "./Service.js";

export class KeyTechnology extends Model<InferAttributes<KeyTechnology>, InferCreationAttributes<KeyTechnology>> {
    declare id: string;
    declare title: string;
    declare description: string | null;
    declare secondaryDescription: string | null;
    declare imageUrl: string | null;
    declare secondaryImageUrl: string | null;
    declare serviceId: ForeignKey<Service['id']>;
    declare sortOrder: number;
}

KeyTechnology.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        secondaryDescription: { type: DataTypes.TEXT, allowNull: true },
        imageUrl: { type: DataTypes.STRING(1000), allowNull: true },
        secondaryImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
        serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "services", key: "id" },
            onDelete: "CASCADE"
        },
        sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    },
    { sequelize, tableName: "key_technologies" }
);
