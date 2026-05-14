import type { MigrationFn } from "umzug";
import { DataTypes } from "sequelize";

export const up: MigrationFn = async ({ context: qi }) => {
    await qi.addColumn("key_technologies", "secondaryDescription", {
        type: DataTypes.TEXT,
        allowNull: true
    });
    await qi.addColumn("key_technologies", "secondaryImageUrl", {
        type: DataTypes.STRING(1000),
        allowNull: true
    });
};

export const down: MigrationFn = async ({ context: qi }) => {
    await qi.removeColumn("key_technologies", "secondaryDescription");
    await qi.removeColumn("key_technologies", "secondaryImageUrl");
};
