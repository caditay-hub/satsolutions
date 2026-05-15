import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }) => {
  await qi.createTable("certificates", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(300), allowNull: false },
    category: { type: DataTypes.ENUM("certificate", "dealer", "award"), allowNull: false, defaultValue: "certificate" },
    imageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    issuedBy: { type: DataTypes.STRING(300), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
  await qi.addIndex("certificates", ["sortOrder"]);
  await qi.addIndex("certificates", ["published"]);
  await qi.addIndex("certificates", ["category"]);
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.dropTable("certificates");
};
