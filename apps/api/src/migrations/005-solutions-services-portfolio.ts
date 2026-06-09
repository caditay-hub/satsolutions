import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.createTable("solutions", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
    excerpt: { type: DataTypes.STRING(800), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.createTable("services", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
    excerpt: { type: DataTypes.STRING(800), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.createTable("portfolio_projects", {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    title: { type: DataTypes.STRING(240), allowNull: false },
    slug: { type: DataTypes.STRING(260), allowNull: false, unique: true },
    excerpt: { type: DataTypes.STRING(800), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(1000), allowNull: true },
    galleryImageUrls: { type: DataTypes.JSONB, allowNull: true },
    clientName: { type: DataTypes.STRING(240), allowNull: true },
    location: { type: DataTypes.STRING(240), allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  await qi.addIndex("solutions", ["publishedAt"]);
  await qi.addIndex("services", ["publishedAt"]);
  await qi.addIndex("portfolio_projects", ["publishedAt"]);
};

export const down: MigrationFn = async ({ context: qi }: { context: any }) => {
  await qi.dropTable("portfolio_projects");
  await qi.dropTable("services");
  await qi.dropTable("solutions");
};

