import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.createTable("site_pages", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    key: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    data: { type: DataTypes.JSONB, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.dropTable("site_pages");
};

