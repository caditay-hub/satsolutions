import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.addColumn("solutions", "solutionCategoryId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "solution_categories", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
  await qi.addIndex("solutions", ["solutionCategoryId"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.removeColumn("solutions", "solutionCategoryId");
};

