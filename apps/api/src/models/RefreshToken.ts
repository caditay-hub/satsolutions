import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare replacedByTokenId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    replacedByTokenId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  { sequelize, tableName: "refresh_tokens" }
);

