import { DataTypes } from "sequelize";

export async function up({ context: queryInterface }: any) {
  await queryInterface.createTable("service_requests", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "done"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}

export async function down({ context: queryInterface }: any) {
  await queryInterface.dropTable("service_requests");
}
