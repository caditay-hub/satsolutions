import type { MigrationFn } from "umzug";

const HIK_DUPLICATES_TO_DELETE = [
  "hik-vnut-mon",
  "hik-vyz-paneli",
  "hik-access-ctrl",
  "hik-alarm-paneli",
  "hik-card-readers",
  "hik-teplokamery",
  "hik-shlagbaumy",
  "hik-videodomofony",
  "hik-nakopiteli-hik",
  "hik-signalizaciya",
  "hik-teplovizory",
  "hik-nvr"
];

export const up: MigrationFn = async ({ context: qi }) => {
  const sequelize = qi.sequelize;
  await sequelize.transaction(async (t) => {
    await sequelize.query(
      `DELETE FROM categories WHERE slug IN (:slugs)`,
      { replacements: { slugs: HIK_DUPLICATES_TO_DELETE }, transaction: t }
    );

    await sequelize.query(
      `UPDATE categories
         SET slug = CASE
           WHEN slug LIKE 'dahua-%' THEN substring(slug FROM 7)
           WHEN slug LIKE 'hik-%' THEN substring(slug FROM 5)
           ELSE slug
         END
       WHERE slug LIKE 'dahua-%' OR slug LIKE 'hik-%'`,
      { transaction: t }
    );

    await sequelize.query(
      `UPDATE categories SET "brandId" = NULL WHERE "brandId" IS NOT NULL`,
      { transaction: t }
    );
  });

  await qi.removeIndex("categories", ["brandId"]);
  await qi.removeColumn("categories", "brandId");
};

export const down: MigrationFn = async ({ context: qi }) => {
  await qi.addColumn("categories", "brandId", {
    type: "UUID" as any,
    allowNull: true,
    references: { model: "brands", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });
  await qi.addIndex("categories", ["brandId"]);
};
