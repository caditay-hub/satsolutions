import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.createTable("partners", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    websiteUrl: { type: DataTypes.STRING(1000), allowNull: true },
    logoImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
  await qi.addIndex("partners", ["sortOrder"]);
  await qi.addIndex("partners", ["published"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.dropTable("partners");
};

