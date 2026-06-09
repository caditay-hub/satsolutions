import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("categories", "coverImageUrl", {
    type: DataTypes.STRING(1000),
    allowNull: true
  });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeColumn("categories", "coverImageUrl");
};

