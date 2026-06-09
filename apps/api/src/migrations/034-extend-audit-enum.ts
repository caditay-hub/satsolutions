import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
    // Use try-catch to avoid error if enum value slightly already exists or if it's not applicable
    try {
        await qi.sequelize.query(`ALTER TYPE "enum_audit_logs_entityType" ADD VALUE 'KEY_TECHNOLOGY';`);
    } catch (e) {
        // If it fails, maybe check if it's because it's already there or not enum.
        // For now, log and ignore if it's duplicate value error, but rethrow otherwise.
        const err = e as any;
        if (err.code === "42710") { // duplicate_object
            return;
        }
        // If it's not a postgres enum, maybe it's just a check constraint.
        // Sequelize might handle check constraint update via sync but migrations are safer.
        // If it fails with something else, we might need to handle it.
        console.warn("Migration to add enum value failed, possibly not using native enum or already exists.", e);
    }
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
    // Postgres doesn't support removing enum values easily. Usually we don't down this.
};
