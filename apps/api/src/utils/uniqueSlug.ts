import type { ModelStatic } from "sequelize";

type HasSlug = { slug: string; id: string };

export async function ensureUniqueSlug(
  model: ModelStatic<any>,
  desiredSlug: string,
  opts?: { excludeId?: string }
) {
  let slug = desiredSlug;
  let i = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = (await model.findOne({ where: { slug }, attributes: ["id"] })) as HasSlug | null;
    if (!existing) return slug;
    if (opts?.excludeId && existing.id === opts.excludeId) return slug;

    slug = `${desiredSlug}-${i++}`;
  }
}

