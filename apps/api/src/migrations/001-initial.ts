import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.createTable("users", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    email: { type: DataTypes.STRING(320), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("ADMIN", "EDITOR"), allowNull: false, defaultValue: "ADMIN" },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.createTable("categories", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.createTable("products", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(240), allowNull: false, unique: true },
    shortDescription: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.createTable("posts", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
    excerpt: { type: DataTypes.STRING(800), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.dropTable("posts");
  await qi.dropTable("products");
  await qi.dropTable("categories");
  await qi.dropTable("users");

  // Drop enum type created for users.role (dialect-specific name)
  // Sequelize typically names it: enum_users_role
  try {
    await qi.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  } catch {
    // ignore
  }
};

