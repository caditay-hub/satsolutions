import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: any) => {
    await qi.addColumn("chat_conversations", "page", {
        type: DataTypes.STRING(300),
        allowNull: true
    });
};

export const down: MigrationFn = async ({ context: qi }: any) => {
    await qi.removeColumn("chat_conversations", "page");
};
