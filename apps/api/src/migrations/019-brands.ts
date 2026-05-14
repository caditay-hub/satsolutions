import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("brands", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(240), allowNull: false, unique: true },
    logoImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
  await qi.addIndex("brands", ["sortOrder"]);
  await qi.addIndex("brands", ["published"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("brands");
};

