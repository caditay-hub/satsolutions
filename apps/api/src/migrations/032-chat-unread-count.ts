import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: any) => {
    await qi.addColumn("chat_conversations", "unreadCount", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    });
};

export const down: MigrationFn = async ({ context: qi }: any) => {
    await qi.removeColumn("chat_conversations", "unreadCount");
};
