import type { MigrationFn } from "umzug";
import { DataTypes } from "sequelize";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
    await qi.addColumn("service_categories", "imageUrl", {
        type: DataTypes.STRING(1000),
        allowNull: true
    });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
    await qi.removeColumn("service_categories", "imageUrl");
};
