import type { MigrationFn } from "umzug";
import { DataTypes } from "sequelize";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
    await qi.addColumn("services", "serviceCategoryId", {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "service_categories", key: "id" },
        onDelete: "SET NULL"
    });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
    await qi.removeColumn("services", "serviceCategoryId");
};
