import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
    // Add parentId and overviewImageUrl to services
    await qi.addColumn("services", "parentId", {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "services", key: "id" },
        onDelete: "SET NULL"
    });
    await qi.addColumn("services", "overviewImageUrl", {
        type: DataTypes.STRING(1000),
        allowNull: true
    });

    // Create key_technologies table
    await qi.createTable("key_technologies", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        imageUrl: { type: DataTypes.STRING(1000), allowNull: true },
        serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "services", key: "id" },
            onDelete: "CASCADE"
        },
        sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await qi.addIndex("key_technologies", ["serviceId"]);
    await qi.addIndex("key_technologies", ["sortOrder"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
    await qi.dropTable("key_technologies");
    await qi.removeColumn("services", "overviewImageUrl");
    await qi.removeColumn("services", "parentId");
};
