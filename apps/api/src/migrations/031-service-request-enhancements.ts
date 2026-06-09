import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
    // 1. AuditLog: entityId UUID -> VARCHAR(255)
    // This allows storing both UUIDs and INTEGER IDs (like ServiceRequest ID)
    await qi.sequelize.query('ALTER TABLE audit_logs ALTER COLUMN "entityId" TYPE VARCHAR(255);');

    // 2. ServiceRequest: add statusReason column
    const tableInfo = await qi.describeTable("service_requests");
    if (!tableInfo.statusReason) {
        await qi.addColumn("service_requests", "statusReason", {
            type: DataTypes.TEXT,
            allowNull: true
        });
    }
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
    // We don't usually downgrade column types or remove columns in this project's pattern
};
