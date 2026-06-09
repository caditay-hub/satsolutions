import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.createTable("orders", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    phone: { type: DataTypes.STRING(32), allowNull: false },
    status: { type: DataTypes.STRING(24), allowNull: false, defaultValue: "NEW" },
    totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "UZS" },
    meta: { type: DataTypes.JSONB, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });

  await qi.createTable("order_items", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    orderId: { type: DataTypes.UUID, allowNull: false, references: { model: "orders", key: "id" }, onDelete: "CASCADE" },
    productId: { type: DataTypes.UUID, allowNull: false, references: { model: "products", key: "id" }, onDelete: "RESTRICT" },
    productName: { type: DataTypes.STRING(200), allowNull: false },
    productSlug: { type: DataTypes.STRING(240), allowNull: false },
    productCoverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });

  await qi.addIndex("orders", ["createdAt"]);
  await qi.addIndex("orders", ["status", "createdAt"]);
  await qi.addIndex("order_items", ["orderId"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.dropTable("order_items");
  await qi.dropTable("orders");
};

