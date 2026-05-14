import type { MigrationFn } from "umzug";
import { DataTypes } from "sequelize";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
    await qi.createTable("service_categories", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(240), allowNull: false },
        slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
        title: { type: DataTypes.STRING(240), allowNull: true },
        description1: { type: DataTypes.TEXT, allowNull: true },
        description2: { type: DataTypes.TEXT, allowNull: true },
        sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
    await qi.dropTable("service_categories");
};
