import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export type UserRole = "ADMIN" | "EDITOR";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "EDITOR"),
      allowNull: false,
      defaultValue: "ADMIN"
    }
  },
  {
    sequelize,
    tableName: "users"
  }
);

