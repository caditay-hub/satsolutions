import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../db.js";

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: string;
  declare title: string;
  declare slug: string;
  declare excerpt: string | null;
  declare content: string | null;
  declare coverImageUrl: string | null;
  declare published: boolean;
  declare publishedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(240),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(260),
      allowNull: false,
      unique: true
    },
    excerpt: {
      type: DataTypes.STRING(800),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    coverImageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "posts"
  }
);

