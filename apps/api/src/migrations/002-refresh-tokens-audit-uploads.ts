import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.createTable("refresh_tokens", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    tokenHash: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
    replacedByTokenId: { type: DataTypes.UUID, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.addIndex("refresh_tokens", ["userId"]);
  await qi.addIndex("refresh_tokens", ["expiresAt"]);

  await qi.createTable("audit_logs", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    actorUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    },
    action: { type: DataTypes.STRING(120), allowNull: false },
    entityType: { type: DataTypes.ENUM("CATEGORY", "PRODUCT", "POST", "USER", "AUTH", "UPLOAD"), allowNull: false },
    entityId: { type: DataTypes.UUID, allowNull: true },
    ip: { type: DataTypes.STRING(80), allowNull: true },
    userAgent: { type: DataTypes.STRING(400), allowNull: true },
    meta: { type: DataTypes.JSONB, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.addIndex("audit_logs", ["createdAt"]);
  await qi.addIndex("audit_logs", ["actorUserId"]);
  await qi.addIndex("audit_logs", ["entityType"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.dropTable("audit_logs");
  await qi.dropTable("refresh_tokens");
  try {
    await qi.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_entityType";');
  } catch {
    // ignore
  }
};

