import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
    const values = [
        "BRAND",
        "PARTNER",
        "PORTFOLIO_CATEGORY",
        "PORTFOLIO_PROJECT",
        "ORDER",
        "FEEDBACK_MESSAGE",
        "CHAT_CONVERSATION",
        "CHAT_MESSAGE",
        "SERVICE_REQUEST"
    ];

    for (const val of values) {
        // @ts-expect-error postgres only
        await qi.sequelize.query(`ALTER TYPE "enum_audit_logs_entityType" ADD VALUE IF NOT EXISTS '${val}';`);
    }
};

export const down: MigrationFn = async () => {
    // ENUM values cannot be easily removed in Postgres
};
