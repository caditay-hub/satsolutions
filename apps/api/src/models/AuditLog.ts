import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type AuditEntity =
  | "CATEGORY"
  | "PRODUCT"
  | "POST"
  | "BRAND"
  | "PARTNER"
  | "SERVICE"
  | "PORTFOLIO_CATEGORY"
  | "PORTFOLIO_PROJECT"
  | "SITE_PAGE"
  | "USER"
  | "ORDER"
  | "FEEDBACK_MESSAGE"
  | "CHAT_CONVERSATION"
  | "CHAT_MESSAGE"
  | "SERVICE_REQUEST"
  | "UPLOAD"
  | "PORTFOLIO"
  | "SOLUTION"
  | "AUTH"
  | "KEY_TECHNOLOGY";

export class AuditLog extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {
  declare id: string;
  declare actorUserId: string | null;
  declare action: string;
  declare entityType: AuditEntity;
  declare entityId: string | null;
  declare ip: string | null;
  declare userAgent: string | null;
  declare meta: unknown | null;
  declare createdAt: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    actorUserId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    entityType: {
      type: DataTypes.ENUM(
        "CATEGORY",
        "PRODUCT",
        "POST",
        "BRAND",
        "PARTNER",
        "SERVICE",
        "PORTFOLIO_CATEGORY",
        "PORTFOLIO_PROJECT",
        "SITE_PAGE",
        "USER",
        "ORDER",
        "FEEDBACK_MESSAGE",
        "CHAT_CONVERSATION",
        "CHAT_MESSAGE",
        "SERVICE_REQUEST",
        "UPLOAD",
        "PORTFOLIO",
        "SOLUTION",
        "AUTH",
        "KEY_TECHNOLOGY"
      ),
      allowNull: false
    },
    entityId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    meta: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  { sequelize, tableName: "audit_logs", updatedAt: false }
);

