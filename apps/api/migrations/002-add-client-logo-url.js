import { DataTypes } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn("portfolio_projects", "clientLogoUrl", {
    type: DataTypes.STRING(1000),
    allowNull: true,
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("portfolio_projects", "clientLogoUrl");
}
