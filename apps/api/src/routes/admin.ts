import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { z } from "zod";
import { Op } from "sequelize";
import { hashPassword } from "../auth.js";
import { writeAudit } from "../audit.js";
import { getEnv } from "../env.js";
import { authRequired, requireRole } from "../middleware/authMiddleware.js";
import { AuditLog } from "../models/AuditLog.js";
import { Category } from "../models/Category.js";
import { Brand } from "../models/Brand.js";
import { Partner } from "../models/Partner.js";
import { Service } from "../models/Service.js";
import { KeyTechnology } from "../models/KeyTechnology.js";
import { PortfolioProject } from "../models/PortfolioProject.js";
import { PortfolioCategory } from "../models/PortfolioCategory.js";
import { Post } from "../models/Post.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { Product } from "../models/Product.js";
import { SitePage } from "../models/SitePage.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { FeedbackMessage } from "../models/FeedbackMessage.js";
import { ChatConversation } from "../models/ChatConversation.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { ServiceCategory } from "../models/ServiceCategory.js";
import { uploadsImagesDir } from "../paths.js";
import { parseLimit, parsePositiveInt } from "../utils/pagination.js";
import { makeSlug } from "../utils/slug.js";
import { ensureUniqueSlug } from "../utils/uniqueSlug.js";

export const adminRouter = Router();
adminRouter.use(authRequired, requireRole(["ADMIN", "EDITOR"]));

const env = getEnv();

const upload = multer({
  storage: multer.diskStorage({
    destination: async (_req, _file, cb) => {
      try {
        await fs.mkdir(uploadsImagesDir, { recursive: true });
        cb(null, uploadsImagesDir);
      } catch (e) {
        cb(e as Error, uploadsImagesDir);
      }
    },
    filename: (_req, file, cb) => {
      const safeExt =
        file.mimetype === "image/jpeg"
          ? ".jpg"
          : file.mimetype === "image/png"
            ? ".png"
            : file.mimetype === "image/webp"
              ? ".webp"
              : ".bin";
      cb(null, `${crypto.randomUUID()}${safeExt}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (ok) return cb(null, true);
    return cb(new Error("Invalid file type"));
  }
});

// Uploads (auth required)
adminRouter.post("/uploads/images", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    return next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const kindRaw = typeof req.query.kind === "string" ? req.query.kind.trim() : "";
  const kind = kindRaw.toLowerCase();

  const presets: Record<
    string,
    { w: number; h: number; fit: "cover" | "contain"; quality?: number; background?: { r: number; g: number; b: number; alpha: number } }
  > = {
    category: { w: 350, h: 218, fit: "cover", quality: 82 },
    product: { w: 390, h: 390, fit: "cover", quality: 82 },
    service: { w: 590, h: 330, fit: "cover", quality: 82 },
    news: { w: 590, h: 390, fit: "cover", quality: 82 },
    portfolio: { w: 640, h: 423, fit: "cover", quality: 82 },
    portfoliogallery: { w: 640, h: 423, fit: "cover", quality: 82 },
    logo: { w: 110, h: 50, fit: "contain", quality: 90, background: { r: 255, g: 255, b: 255, alpha: 0 } }
  };

  const preset = presets[kind];

  const outName = `${crypto.randomUUID()}.webp`;
  const outPath = path.join(uploadsImagesDir, outName);

  try {
    let pipeline = sharp(req.file.path).rotate();
    if (kind === "hero") {
      // Hero carousel: keep full image (no crop, no padding).
      // Resize by width to make it lighter, keep original aspect ratio.
      pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
    } else if (preset) {
      pipeline = pipeline.resize(preset.w, preset.h, {
        fit: preset.fit,
        position: "centre",
        background: preset.background
      });
    }
    await pipeline.webp({ quality: preset?.quality ?? 82 }).toFile(outPath);
    await fs.unlink(req.file.path).catch(() => null);
  } catch (e: any) {
    await fs.unlink(req.file.path).catch(() => null);
    await fs.unlink(outPath).catch(() => null);
    return res.status(400).json({ error: e?.message ?? "Image processing failed" });
  }

  const url = `${env.API_PUBLIC_BASE_URL}/uploads/images/${outName}`;
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPLOAD_IMAGE",
    entityType: "UPLOAD",
    entityId: null,
    meta: { filename: outName, originalFilename: req.file.filename, size: req.file.size, mime: req.file.mimetype, kind: kind || null, preset: preset ?? null }
  });
  res.status(201).json({ url, path: `/uploads/images/${outName}` });
});

adminRouter.get("/audit-logs", requireRole(["ADMIN"]), async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 50, 200);
  const offset = (page - 1) * limit;
  const { rows, count } = await AuditLog.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.get("/stats", async (_req, res) => {
  const [categories, products, news, users, orders, newOrders, newFeedback, openChats, lastChatUserMessageAt, pendingServiceRequests] = await Promise.all([
    Category.count(),
    Product.count(),
    Post.count(),
    User.count(),
    Order.count(),
    Order.count({ where: { status: "NEW" } }),
    FeedbackMessage.count({ where: { status: "NEW" } }),
    ChatConversation.count({ where: { status: "OPEN" } } as any),
    ChatMessage.max("createdAt", { where: { sender: "USER" } } as any),
    ServiceRequest.count({ where: { status: "pending" } })
  ]);
  res.json({
    categories,
    products,
    news,
    users,
    orders,
    newOrders,
    newFeedback,
    openChats,
    pendingServiceRequests,
    lastChatUserMessageAt: lastChatUserMessageAt ? new Date(lastChatUserMessageAt as any).toISOString() : null
  });
});

// Feedback messages
adminRouter.get("/feedback", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 50, 200);
  const offset = (page - 1) * limit;
  const status = typeof req.query.status === "string" ? req.query.status.trim().toUpperCase() : "";
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  const where: any = {};
  if (status === "NEW" || status === "DONE") where.status = status;
  if (q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { phone: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { message: { [Op.iLike]: `%${q}%` } }
    ];
  }

  const { rows, count } = await FeedbackMessage.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.get("/feedback/:id", async (req, res) => {
  const item = await FeedbackMessage.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

adminRouter.patch("/feedback/:id", async (req, res) => {
  const schema = z.object({
    status: z.enum(["NEW", "DONE"]).optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const item = await FeedbackMessage.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  if (parsed.data.status !== undefined) (item as any).status = parsed.data.status;
  await item.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "SITE_PAGE",
    entityId: item.id,
    meta: { kind: "FEEDBACK_MESSAGE", status: (item as any).status }
  });

  res.json({ item });
});

adminRouter.delete("/feedback/:id", requireRole(["ADMIN"]), async (req, res) => {
  const item = await FeedbackMessage.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  await item.destroy();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "SITE_PAGE",
    entityId: item.id,
    meta: { kind: "FEEDBACK_MESSAGE" }
  });

  res.status(204).send();
});

// Orders
adminRouter.get("/orders", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const offset = (page - 1) * limit;
  const status = typeof req.query.status === "string" ? req.query.status.trim().toUpperCase() : "";

  const where: any = {};
  if (status) where.status = status;

  const { rows, count } = await Order.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.get("/orders/:id", async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: OrderItem, as: "items", required: false }]
  });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json({ order });
});

adminRouter.patch("/orders/:id", async (req, res) => {
  const schema = z.object({
    status: z.enum(["NEW", "PROCESSING", "DONE", "CANCELLED"]).optional(),
    reason: z.string().min(2).max(500).optional().nullable()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });

  if (parsed.data.status !== undefined) {
    (order as any).status = parsed.data.status;

    if (parsed.data.status === "DONE" || parsed.data.status === "CANCELLED") {
      const reason = (parsed.data.reason ?? "").trim();
      if (!reason) return res.status(400).json({ error: "Reason is required" });
      (order as any).statusReason = reason;
    } else {
      // For NEW/PROCESSING we clear reason unless explicitly provided
      (order as any).statusReason = parsed.data.reason ? String(parsed.data.reason).trim() : null;
    }
  } else if (parsed.data.reason !== undefined) {
    (order as any).statusReason = parsed.data.reason ? String(parsed.data.reason).trim() : null;
  }

  await order.save();
  const full = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "items", required: false }] });
  res.json({ order: full ?? order });
});

// Categories
adminRouter.get("/categories", async (_req, res) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json({ categories });
});

adminRouter.post("/categories", async (req, res) => {
  const coverSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid coverImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    parentId: z.string().uuid().optional().nullable(),
    coverImageUrl: coverSchema,
    brandId: z.string().uuid().optional().nullable()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.name);
  const slug = await ensureUniqueSlug(Category, baseSlug);
  const category = await Category.create({
    name: parsed.data.name,
    slug,
    parentId: parsed.data.parentId ?? null,
    coverImageUrl: parsed.data.coverImageUrl ?? null,
    brandId: parsed.data.brandId ?? null
  } as any);
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "CATEGORY",
    entityId: category.id,
    meta: { name: category.name, slug: category.slug, parentId: category.parentId, coverImageUrl: category.coverImageUrl, brandId: (category as any).brandId ?? null }
  });
  res.status(201).json({ category });
});

adminRouter.patch("/categories/:id", async (req, res) => {
  const coverSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid coverImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    parentId: z.string().uuid().optional().nullable(),
    coverImageUrl: coverSchema,
    brandId: z.string().uuid().optional().nullable()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: "Not found" });
  if (parsed.data.name !== undefined) category.name = parsed.data.name;
  if (parsed.data.slug !== undefined) {
    const baseSlug = makeSlug(parsed.data.slug);
    category.slug = await ensureUniqueSlug(Category, baseSlug, { excludeId: category.id });
  }
  if (parsed.data.parentId !== undefined) category.parentId = parsed.data.parentId ?? null;
  if (parsed.data.coverImageUrl !== undefined) category.coverImageUrl = parsed.data.coverImageUrl ?? null;
  if (parsed.data.brandId !== undefined) (category as any).brandId = parsed.data.brandId ?? null;
  await category.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "CATEGORY",
    entityId: category.id
  });
  res.json({ category });
});

adminRouter.delete("/categories/:id", async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: "Not found" });
  await category.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "CATEGORY",
    entityId: category.id
  });
  res.status(204).send();
});

// Portfolio Categories
adminRouter.get("/portfolio-categories", async (_req, res) => {
  const categories = await PortfolioCategory.findAll({ order: [["name", "ASC"]] });
  res.json({ categories });
});

adminRouter.post("/portfolio-categories", async (req, res) => {
  const coverSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid coverImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    parentId: z.string().uuid().optional().nullable(),
    coverImageUrl: coverSchema
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.name);
  const slug = await ensureUniqueSlug(PortfolioCategory, baseSlug);
  const category = await PortfolioCategory.create({
    name: parsed.data.name,
    slug,
    parentId: parsed.data.parentId ?? null,
    coverImageUrl: parsed.data.coverImageUrl ?? null
  } as any);
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "CATEGORY",
    entityId: category.id,
    meta: { kind: "PORTFOLIO_CATEGORY", name: category.name, slug: category.slug, parentId: category.parentId, coverImageUrl: category.coverImageUrl }
  });
  res.status(201).json({ category });
});

adminRouter.patch("/portfolio-categories/:id", async (req, res) => {
  const coverSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid coverImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    parentId: z.string().uuid().optional().nullable(),
    coverImageUrl: coverSchema
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const category = await PortfolioCategory.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: "Not found" });
  if (parsed.data.name !== undefined) category.name = parsed.data.name;
  if (parsed.data.slug !== undefined) {
    const baseSlug = makeSlug(parsed.data.slug);
    category.slug = await ensureUniqueSlug(PortfolioCategory, baseSlug, { excludeId: category.id });
  }
  if (parsed.data.parentId !== undefined) category.parentId = parsed.data.parentId ?? null;
  if (parsed.data.coverImageUrl !== undefined) category.coverImageUrl = parsed.data.coverImageUrl ?? null;
  await category.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "CATEGORY",
    entityId: category.id,
    meta: { kind: "PORTFOLIO_CATEGORY" }
  });
  res.json({ category });
});

adminRouter.delete("/portfolio-categories/:id", async (req, res) => {
  const category = await PortfolioCategory.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: "Not found" });
  await category.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "CATEGORY",
    entityId: category.id,
    meta: { kind: "PORTFOLIO_CATEGORY" }
  });
  res.status(204).send();
});

// Brands
adminRouter.get("/brands", async (_req, res) => {
  const brands = await Brand.findAll({ order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json({ brands });
});

adminRouter.post("/brands", async (req, res) => {
  const logoSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid logoImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    logoImageUrl: logoSchema,
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.name);
  const slug = await ensureUniqueSlug(Brand, baseSlug);
  const brand = await Brand.create({
    name: parsed.data.name,
    slug,
    logoImageUrl: parsed.data.logoImageUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.published ?? true
  } as any);

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "CATEGORY",
    entityId: brand.id,
    meta: { kind: "BRAND", name: brand.name, slug: brand.slug }
  });
  res.status(201).json({ brand });
});

adminRouter.patch("/brands/:id", async (req, res) => {
  const logoSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid logoImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    logoImageUrl: logoSchema,
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const brand = await Brand.findByPk(req.params.id);
  if (!brand) return res.status(404).json({ error: "Not found" });
  if (parsed.data.name !== undefined) brand.name = parsed.data.name;
  if (parsed.data.slug !== undefined) brand.slug = await ensureUniqueSlug(Brand, makeSlug(parsed.data.slug), { excludeId: brand.id });
  if (parsed.data.logoImageUrl !== undefined) (brand as any).logoImageUrl = parsed.data.logoImageUrl ?? null;
  if (parsed.data.sortOrder !== undefined) (brand as any).sortOrder = parsed.data.sortOrder;
  if (parsed.data.published !== undefined) (brand as any).published = parsed.data.published;
  await brand.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "CATEGORY",
    entityId: brand.id,
    meta: { kind: "BRAND" }
  });
  res.json({ brand });
});

adminRouter.delete("/brands/:id", async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if (!brand) return res.status(404).json({ error: "Not found" });
  await brand.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "CATEGORY",
    entityId: brand.id,
    meta: { kind: "BRAND" }
  });
  res.status(204).send();
});

// Partners
adminRouter.get("/partners", async (_req, res) => {
  const partners = await Partner.findAll({ order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json({ partners });
});

adminRouter.post("/partners", async (req, res) => {
  const urlSchema = z
    .string()
    .max(1000)
    .refine((v) => /^https?:\/\//i.test(v), "Invalid websiteUrl")
    .optional()
    .nullable();
  const logoSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid logoImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2),
    websiteUrl: urlSchema,
    logoImageUrl: logoSchema,
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const partner = await Partner.create({
    name: parsed.data.name,
    websiteUrl: parsed.data.websiteUrl ?? null,
    logoImageUrl: parsed.data.logoImageUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.published ?? true
  } as any);

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "CATEGORY",
    entityId: partner.id,
    meta: { kind: "PARTNER", name: partner.name }
  });
  res.status(201).json({ partner });
});

adminRouter.patch("/partners/:id", async (req, res) => {
  const urlSchema = z
    .string()
    .max(1000)
    .refine((v) => /^https?:\/\//i.test(v), "Invalid websiteUrl")
    .optional()
    .nullable();
  const logoSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid logoImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2).optional(),
    websiteUrl: urlSchema,
    logoImageUrl: logoSchema,
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const partner = await Partner.findByPk(req.params.id);
  if (!partner) return res.status(404).json({ error: "Not found" });
  if (parsed.data.name !== undefined) partner.name = parsed.data.name;
  if (parsed.data.websiteUrl !== undefined) (partner as any).websiteUrl = parsed.data.websiteUrl ?? null;
  if (parsed.data.logoImageUrl !== undefined) (partner as any).logoImageUrl = parsed.data.logoImageUrl ?? null;
  if (parsed.data.sortOrder !== undefined) (partner as any).sortOrder = parsed.data.sortOrder;
  if (parsed.data.published !== undefined) (partner as any).published = parsed.data.published;
  await partner.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "CATEGORY",
    entityId: partner.id,
    meta: { kind: "PARTNER" }
  });
  res.json({ partner });
});

adminRouter.delete("/partners/:id", async (req, res) => {
  const partner = await Partner.findByPk(req.params.id);
  if (!partner) return res.status(404).json({ error: "Not found" });
  await partner.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "CATEGORY",
    entityId: partner.id,
    meta: { kind: "PARTNER" }
  });
  res.status(204).send();
});

// Products
adminRouter.get("/products", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const offset = (page - 1) * limit;
  const { rows, count } = await Product.findAndCountAll({
    order: [["updatedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.post("/products", async (req, res) => {
  const priceSchema = z.preprocess((val) => {
    if (val === null || val === undefined) return undefined;
    if (typeof val === "number") return val;
    if (typeof val !== "string") return val;
    const normalized = val.replace(/\s+/g, "").replace(",", ".").replace(/[^\d.]/g, "");
    if (normalized === "") return undefined;
    return Number(normalized);
  }, z.number().min(0));

  const coverSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid coverImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    price: priceSchema.optional(),
    isUsd: z.boolean().optional(),
    recommended: z.boolean().optional(),
    shortDescription: z.string().max(500).optional().nullable(),
    description: z.string().optional().nullable(),
    characteristics: z.record(z.string(), z.string()).optional().nullable(),
    coverImageUrl: coverSchema,
    published: z.boolean().optional(),
    categoryId: z.string().uuid(),
    brandId: z.string().uuid().optional().nullable()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.name);
  const slug = await ensureUniqueSlug(Product, baseSlug);
  const product = await Product.create({
    ...parsed.data,
    price: String(parsed.data.price ?? 0),
    isUsd: parsed.data.isUsd ?? false,
    recommended: parsed.data.recommended ?? false,
    brandId: parsed.data.brandId ?? null,
    characteristics: parsed.data.characteristics ?? null,
    slug
  } as any);

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "PRODUCT",
    entityId: product.id,
    meta: { name: product.name, slug: product.slug }
  });
  res.status(201).json({ product });
});

adminRouter.get("/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ product });
});

adminRouter.patch("/products/:id", async (req, res) => {
  const priceSchema = z.preprocess((val) => {
    if (val === null || val === undefined) return undefined;
    if (typeof val === "number") return val;
    if (typeof val !== "string") return val;
    const normalized = val.replace(/\s+/g, "").replace(",", ".").replace(/[^\d.]/g, "");
    if (normalized === "") return undefined;
    return Number(normalized);
  }, z.number().min(0));

  const coverSchema = z
    .string()
    .max(1000)
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), "Invalid coverImageUrl")
    .optional()
    .nullable();

  const schema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    price: priceSchema.optional(),
    isUsd: z.boolean().optional(),
    recommended: z.boolean().optional(),
    shortDescription: z.string().max(500).optional().nullable(),
    description: z.string().optional().nullable(),
    characteristics: z.record(z.string(), z.string()).optional().nullable(),
    coverImageUrl: coverSchema,
    published: z.boolean().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional().nullable()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });

  if (parsed.data.name !== undefined) product.name = parsed.data.name;
  if (parsed.data.slug !== undefined) {
    const baseSlug = makeSlug(parsed.data.slug);
    product.slug = await ensureUniqueSlug(Product, baseSlug, { excludeId: product.id });
  }
  if (parsed.data.shortDescription !== undefined) product.shortDescription = parsed.data.shortDescription ?? null;
  if (parsed.data.description !== undefined) product.description = parsed.data.description ?? null;
  if (parsed.data.price !== undefined) product.price = String(parsed.data.price);
  if (parsed.data.isUsd !== undefined) (product as any).isUsd = parsed.data.isUsd;
  if (parsed.data.recommended !== undefined) (product as any).recommended = parsed.data.recommended;
  if (parsed.data.characteristics !== undefined) product.characteristics = parsed.data.characteristics ?? null;
  if (parsed.data.coverImageUrl !== undefined) product.coverImageUrl = parsed.data.coverImageUrl ?? null;
  if (parsed.data.published !== undefined) product.published = parsed.data.published;
  if (parsed.data.categoryId !== undefined) product.categoryId = parsed.data.categoryId;
  if (parsed.data.brandId !== undefined) (product as any).brandId = parsed.data.brandId ?? null;

  await product.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "PRODUCT",
    entityId: product.id
  });
  res.json({ product });
});

adminRouter.delete("/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });

  // Delete cover image from uploads if it exists
  if (product.coverImageUrl) {
    try {
      // Extract filename from URL
      const urlParts = product.coverImageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadsDir, filename);

      // Check if file exists and delete it
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (err) {
        // File doesn't exist, continue with deletion
        console.log('File not found, continuing with product deletion:', filename);
      }
    } catch (err) {
      console.error('Error deleting product image:', err);
    }
  }

  await product.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "PRODUCT",
    entityId: product.id
  });
  res.status(204).send();
});

// News/Posts
adminRouter.get("/news", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const offset = (page - 1) * limit;
  const { rows, count } = await Post.findAndCountAll({
    order: [["updatedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.post("/news", async (req, res) => {
  const schema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2).optional(),
    excerpt: z.string().max(800).optional().nullable(),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.title);
  const slug = await ensureUniqueSlug(Post, baseSlug);
  const publishedAt = parsed.data.published ? new Date() : null;
  const post = await Post.create({ ...parsed.data, slug, publishedAt } as any);
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "POST",
    entityId: post.id,
    meta: { title: post.title, slug: post.slug }
  });
  res.status(201).json({ post });
});

adminRouter.get("/news/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json({ post });
});

adminRouter.patch("/news/:id", async (req, res) => {
  const schema = z.object({
    title: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    excerpt: z.string().max(800).optional().nullable(),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (parsed.data.title !== undefined) post.title = parsed.data.title;
  if (parsed.data.slug !== undefined) {
    const baseSlug = makeSlug(parsed.data.slug);
    post.slug = await ensureUniqueSlug(Post, baseSlug, { excludeId: post.id });
  }
  if (parsed.data.excerpt !== undefined) post.excerpt = parsed.data.excerpt ?? null;
  if (parsed.data.content !== undefined) post.content = parsed.data.content ?? null;
  if (parsed.data.coverImageUrl !== undefined) post.coverImageUrl = parsed.data.coverImageUrl ?? null;
  if (parsed.data.published !== undefined) {
    post.published = parsed.data.published;
    post.publishedAt = parsed.data.published ? (post.publishedAt ?? new Date()) : null;
  }

  await post.save();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "POST",
    entityId: post.id
  });
  res.json({ post });
});

adminRouter.delete("/news/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  await post.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "POST",
    entityId: post.id
  });
  res.status(204).send();
});

// Site pages (About/Contact)
adminRouter.get("/site-pages/:key", async (req, res) => {
  const key = req.params.key;
  if (key !== "about" && key !== "contact" && key !== "site") return res.status(400).json({ error: "Invalid key" });
  const page = await SitePage.findOne({ where: { key } });
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json({ page });
});

adminRouter.put("/site-pages/:key", async (req, res) => {
  const key = req.params.key;
  if (key !== "about" && key !== "contact" && key !== "site") return res.status(400).json({ error: "Invalid key" });

  const schema = z.object({
    title: z.string().min(2),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    data: z.record(z.any()).optional().nullable()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const existing = await SitePage.findOne({ where: { key } });
  const page = existing
    ? await existing.update({
      title: parsed.data.title,
      content: parsed.data.content ?? null,
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      data: parsed.data.data ?? null
    })
    : await SitePage.create({
      key: key as any,
      title: parsed.data.title,
      content: parsed.data.content ?? null,
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      data: parsed.data.data ?? null
    } as any);

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: existing ? "UPDATE" : "CREATE",
    entityType: "SITE_PAGE",
    entityId: page.id,
    meta: { key }
  });

  res.json({ page });
});

// Service Categories
adminRouter.get("/service-categories", async (req, res) => {
  const items = await ServiceCategory.findAll({ order: [["sortOrder", "ASC"]] });
  res.json({ items });
});

adminRouter.post("/service-categories", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1).optional(),
    title: z.string().optional().nullable(),
    description1: z.string().optional().nullable(),
    description2: z.string().optional().nullable(),
    imageUrl: z.string().max(1000).optional().nullable(),
    sortOrder: z.coerce.number().int().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.name);
  const slug = await ensureUniqueSlug(ServiceCategory, baseSlug);
  const item = await ServiceCategory.create({
    ...parsed.data,
    slug,
    sortOrder: parsed.data.sortOrder ?? 0
  } as any);
  res.status(201).json({ item });
});

adminRouter.get("/service-categories/:id", async (req, res) => {
  const item = await ServiceCategory.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

adminRouter.patch("/service-categories/:id", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    title: z.string().optional().nullable(),
    description1: z.string().optional().nullable(),
    description2: z.string().optional().nullable(),
    imageUrl: z.string().max(1000).optional().nullable(),
    sortOrder: z.coerce.number().int().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const item = await ServiceCategory.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });

  if (parsed.data.name !== undefined) item.name = parsed.data.name;
  if (parsed.data.slug !== undefined) item.slug = await ensureUniqueSlug(ServiceCategory, makeSlug(parsed.data.slug), { excludeId: item.id });
  if (parsed.data.title !== undefined) item.title = parsed.data.title ?? null;
  if (parsed.data.description1 !== undefined) item.description1 = parsed.data.description1 ?? null;
  if (parsed.data.description2 !== undefined) item.description2 = parsed.data.description2 ?? null;
  if (parsed.data.imageUrl !== undefined) item.imageUrl = parsed.data.imageUrl ?? null;
  if (parsed.data.sortOrder !== undefined) item.sortOrder = parsed.data.sortOrder;

  await item.save();
  res.json({ item });
});

adminRouter.delete("/service-categories/:id", async (req, res) => {
  const item = await ServiceCategory.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  await item.destroy();
  res.status(204).send();
});

// Services
adminRouter.get("/services", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const offset = (page - 1) * limit;

  // Optional filter by parentId or serviceCategoryId
  const parentIdRaw = req.query.parentId;
  const serviceCategoryIdRaw = req.query.serviceCategoryId;
  const where: any = {};
  if (parentIdRaw === "null") where.parentId = null;
  else if (typeof parentIdRaw === "string" && parentIdRaw.length > 0) where.parentId = parentIdRaw;

  if (serviceCategoryIdRaw === "null") where.serviceCategoryId = null;
  else if (typeof serviceCategoryIdRaw === "string" && serviceCategoryIdRaw.length > 0) where.serviceCategoryId = serviceCategoryIdRaw;

  const { rows, count } = await Service.findAndCountAll({
    where,
    order: [["sortOrder", "ASC"], ["updatedAt", "DESC"]],
    limit,
    offset,
    include: [
      { model: Service, as: "parent", attributes: ["id", "title"] },
      { model: Service, as: "children", attributes: ["id", "title"] }, // useful to see sub-services
      { model: ServiceCategory, as: "category", attributes: ["id", "name"] }
    ]
  });
  res.json({ items: rows, total: count, page, limit });
});

const serviceItemDescriptionBlockSchema = z.object({
  description: z.string().max(2000).optional().nullable(),
  subDescription: z.string().max(2000).optional().nullable()
});
const serviceItemCardSchema = z.object({
  description: z.string().max(2000).optional().nullable(),
  subDescription: z.string().max(2000).optional().nullable(),
  descriptions: z.array(serviceItemDescriptionBlockSchema).optional().nullable()
});
const serviceItemSchema = z.object({
  title: z.string().min(1).max(200),
  imageUrl: z.string().max(1000).optional().nullable(),
  cards: z.array(serviceItemCardSchema).optional().nullable()
});

// Portfolio specific schemas
const portfolioItemDescriptionBlockSchema = z.object({
  description: z.string().max(2000).optional().nullable(),
  subDescriptions: z.array(z.string().max(2000)).optional().nullable()
});
const portfolioItemCardSchema = z.object({
  description: z.string().max(2000).optional().nullable(),
  subDescription: z.string().max(2000).optional().nullable(),
  descriptions: z.array(portfolioItemDescriptionBlockSchema).optional().nullable()
});
const portfolioItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  cards: z.array(portfolioItemCardSchema).optional().nullable()
});

adminRouter.post("/services", async (req, res) => {
  const itemsSchema = z.array(serviceItemSchema).optional().nullable();

  const schema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2).optional(),
    excerpt: z.string().max(800).optional().nullable(),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    overviewImageUrl: z.string().max(1000).optional().nullable(),
    items: itemsSchema,
    parentId: z.string().uuid().optional().nullable(),
    serviceCategoryId: z.string().uuid().optional().nullable(),
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.title);
  const slug = await ensureUniqueSlug(Service, baseSlug);
  const publishedAt = parsed.data.published ? new Date() : null;
  const item = await Service.create({
    ...parsed.data,
    parentId: parsed.data.parentId ?? null,
    serviceCategoryId: parsed.data.serviceCategoryId ?? null,
    overviewImageUrl: parsed.data.overviewImageUrl ?? null,
    items: parsed.data.items ?? null,
    slug,
    publishedAt,
    sortOrder: parsed.data.sortOrder ?? 0
  } as any);
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "CREATE", entityType: "SERVICE", entityId: item.id });
  res.status(201).json({ item });
});

adminRouter.get("/services/:id", async (req, res) => {
  const item = await Service.findByPk(req.params.id, {
    include: [
      { model: Service, as: "parent", attributes: ["id", "title", "slug"] },
      { model: Service, as: "children", attributes: ["id", "title", "slug"] },
      { model: ServiceCategory, as: "category", attributes: ["id", "name", "slug"] },
      { model: KeyTechnology, as: "keyTechnologies" }
    ]
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

adminRouter.patch("/services/:id", async (req, res) => {
  const itemsSchema = z.array(serviceItemSchema).optional().nullable();

  const schema = z.object({
    title: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    excerpt: z.string().max(800).optional().nullable(),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    overviewImageUrl: z.string().max(1000).optional().nullable(),
    items: itemsSchema,
    parentId: z.string().uuid().optional().nullable(),
    serviceCategoryId: z.string().uuid().optional().nullable(),
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const item = await Service.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  if (parsed.data.title !== undefined) item.title = parsed.data.title;
  if (parsed.data.slug !== undefined) item.slug = await ensureUniqueSlug(Service, makeSlug(parsed.data.slug), { excludeId: item.id });
  if (parsed.data.excerpt !== undefined) item.excerpt = parsed.data.excerpt ?? null;
  if (parsed.data.content !== undefined) item.content = parsed.data.content ?? null;
  if (parsed.data.coverImageUrl !== undefined) item.coverImageUrl = parsed.data.coverImageUrl ?? null;
  if (parsed.data.overviewImageUrl !== undefined) item.overviewImageUrl = parsed.data.overviewImageUrl ?? null;
  if (parsed.data.items !== undefined) (item as any).items = parsed.data.items ?? null;
  if (parsed.data.parentId !== undefined) (item as any).parentId = parsed.data.parentId ?? null;
  if (parsed.data.serviceCategoryId !== undefined) (item as any).serviceCategoryId = parsed.data.serviceCategoryId ?? null;
  if (parsed.data.sortOrder !== undefined) item.sortOrder = parsed.data.sortOrder;
  if (parsed.data.published !== undefined) {
    item.published = parsed.data.published;
    item.publishedAt = parsed.data.published ? (item.publishedAt ?? new Date()) : null;
  }
  await item.save();
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "UPDATE", entityType: "SERVICE", entityId: item.id });
  res.json({ item });
});

adminRouter.delete("/services/:id", async (req, res) => {
  const item = await Service.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  await item.destroy();
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "DELETE", entityType: "SERVICE", entityId: item.id });
  res.status(204).send();
});

// Key Technologies
adminRouter.get("/services/:id/key-technologies", async (req, res) => {
  const items = await KeyTechnology.findAll({ where: { serviceId: req.params.id }, order: [["sortOrder", "ASC"]] });
  res.json({ items });
});

adminRouter.post("/services/:id/key-technologies", async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  const schema = z.object({
    title: z.string().min(2),
    description: z.string().optional().nullable(),
    secondaryDescription: z.string().optional().nullable(),
    imageUrl: z.string().max(1000).optional().nullable(),
    secondaryImageUrl: z.string().max(1000).optional().nullable(),
    sortOrder: z.coerce.number().int().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const item = await KeyTechnology.create({
    serviceId: service.id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    secondaryDescription: parsed.data.secondaryDescription ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    secondaryImageUrl: parsed.data.secondaryImageUrl ?? null,
    sortOrder: parsed.data.sortOrder ?? 0
  } as any);

  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "CREATE", entityType: "KEY_TECHNOLOGY", entityId: item.id, meta: { serviceId: service.id } });
  res.status(201).json({ item });
});

adminRouter.patch("/key-technologies/:id", async (req, res) => {
  const schema = z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional().nullable(),
    secondaryDescription: z.string().optional().nullable(),
    imageUrl: z.string().max(1000).optional().nullable(),
    secondaryImageUrl: z.string().max(1000).optional().nullable(),
    sortOrder: z.coerce.number().int().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const item = await KeyTechnology.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });

  if (parsed.data.title !== undefined) item.title = parsed.data.title;
  if (parsed.data.description !== undefined) item.description = parsed.data.description ?? null;
  if (parsed.data.secondaryDescription !== undefined) item.secondaryDescription = parsed.data.secondaryDescription ?? null;
  if (parsed.data.imageUrl !== undefined) item.imageUrl = parsed.data.imageUrl ?? null;
  if (parsed.data.secondaryImageUrl !== undefined) item.secondaryImageUrl = parsed.data.secondaryImageUrl ?? null;
  if (parsed.data.sortOrder !== undefined) item.sortOrder = parsed.data.sortOrder;

  await item.save();
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "UPDATE", entityType: "KEY_TECHNOLOGY", entityId: item.id });
  res.json({ item });
});

adminRouter.delete("/key-technologies/:id", async (req, res) => {
  const item = await KeyTechnology.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  await item.destroy();
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "DELETE", entityType: "KEY_TECHNOLOGY", entityId: item.id });
  res.status(204).send();
});

// Portfolio projects
adminRouter.get("/portfolio", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const offset = (page - 1) * limit;
  const { rows, count } = await PortfolioProject.findAndCountAll({
    order: [["updatedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.post("/portfolio", async (req, res) => {
  const completedAtSchema = z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return null;
    if (val instanceof Date) return val;
    if (typeof val === "string") {
      const s = val.trim();
      // YYYY-MM-DD or ISO
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s);
      // DD.MM.YYYY
      const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (m) {
        const dd = m[1]!.padStart(2, "0");
        const mm = m[2]!.padStart(2, "0");
        const yyyy = m[3]!;
        return new Date(`${yyyy}-${mm}-${dd}`);
      }
    }
    return val;
  }, z.date().nullable());

  const itemsSchema = z
    .array(portfolioItemSchema)
    .optional()
    .nullable();

  const schema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2).optional(),
    excerpt: z.string().max(800).optional().nullable(),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    galleryImageUrls: z.array(z.string().max(1000)).optional().nullable(),
    portfolioCategoryId: z.string().uuid().optional().nullable(),
    items: itemsSchema,
    clientName: z.string().max(240).optional().nullable(),
    clientlogourl: z.string().max(1000).optional().nullable(),
    clientTasks: z.string().max(5000).optional().nullable(),
    location: z.string().max(240).optional().nullable(),
    completedAt: completedAtSchema.optional(),
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const baseSlug = parsed.data.slug ? makeSlug(parsed.data.slug) : makeSlug(parsed.data.title);
  const slug = await ensureUniqueSlug(PortfolioProject, baseSlug);
  const publishedAt = parsed.data.published ? new Date() : null;
  const item = await PortfolioProject.create({
    ...parsed.data,
    slug,
    publishedAt,
    sortOrder: parsed.data.sortOrder ?? 0,
    portfolioCategoryId: parsed.data.portfolioCategoryId ?? null,
    clientTasks: parsed.data.clientTasks ?? null,
    clientlogourl: parsed.data.clientlogourl ?? null
  } as any);
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "CREATE", entityType: "PORTFOLIO", entityId: item.id });
  res.status(201).json({ item });
});

adminRouter.get("/portfolio/:id", async (req, res) => {
  const item = await PortfolioProject.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

adminRouter.patch("/portfolio/:id", async (req, res) => {
  const completedAtSchema = z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return null;
    if (val instanceof Date) return val;
    if (typeof val === "string") {
      const s = val.trim();
      // YYYY-MM-DD or ISO
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s);
      // DD.MM.YYYY
      const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (m) {
        const dd = m[1]!.padStart(2, "0");
        const mm = m[2]!.padStart(2, "0");
        const yyyy = m[3]!;
        return new Date(`${yyyy}-${mm}-${dd}`);
      }
    }
    return val;
  }, z.date().nullable());

  const itemsSchema = z
    .array(portfolioItemSchema)
    .optional()
    .nullable();

  const schema = z.object({
    title: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    excerpt: z.string().max(800).optional().nullable(),
    content: z.string().optional().nullable(),
    coverImageUrl: z.string().max(1000).optional().nullable(),
    galleryImageUrls: z.array(z.string().max(1000)).optional().nullable(),
    portfolioCategoryId: z.string().uuid().optional().nullable(),
    items: itemsSchema,
    clientName: z.string().max(240).optional().nullable(),
    clientlogourl: z.string().max(1000).optional().nullable(),
    clientTasks: z.string().max(5000).optional().nullable(),
    location: z.string().max(240).optional().nullable(),
    completedAt: completedAtSchema.optional(),
    sortOrder: z.coerce.number().int().optional(),
    published: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid body" });

  const item = await PortfolioProject.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  if (parsed.data.title !== undefined) item.title = parsed.data.title;
  if (parsed.data.slug !== undefined) item.slug = await ensureUniqueSlug(PortfolioProject, makeSlug(parsed.data.slug), { excludeId: item.id });
  if (parsed.data.excerpt !== undefined) item.excerpt = parsed.data.excerpt ?? null;
  if (parsed.data.content !== undefined) item.content = parsed.data.content ?? null;
  if (parsed.data.coverImageUrl !== undefined) item.coverImageUrl = parsed.data.coverImageUrl ?? null;
  if (parsed.data.galleryImageUrls !== undefined) item.galleryImageUrls = parsed.data.galleryImageUrls ?? null;
  if (parsed.data.items !== undefined) (item as any).items = parsed.data.items ?? null;
  if (parsed.data.portfolioCategoryId !== undefined) (item as any).portfolioCategoryId = parsed.data.portfolioCategoryId ?? null;
  if (parsed.data.clientName !== undefined) item.clientName = parsed.data.clientName ?? null;
  if (parsed.data.clientlogourl !== undefined) item.clientlogourl = parsed.data.clientlogourl ?? null;
  if (parsed.data.clientTasks !== undefined) (item as any).clientTasks = parsed.data.clientTasks ?? null;
  if (parsed.data.location !== undefined) item.location = parsed.data.location ?? null;
  if (parsed.data.completedAt !== undefined) item.completedAt = parsed.data.completedAt ?? null;
  if (parsed.data.sortOrder !== undefined) item.sortOrder = parsed.data.sortOrder;
  if (parsed.data.published !== undefined) {
    item.published = parsed.data.published;
    item.publishedAt = parsed.data.published ? (item.publishedAt ?? new Date()) : null;
  }
  await item.save();
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "UPDATE", entityType: "PORTFOLIO", entityId: item.id });
  res.json({ item });
});

adminRouter.delete("/portfolio/:id", async (req, res) => {
  const item = await PortfolioProject.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  await item.destroy();
  await writeAudit({ req, actorUserId: (req as any).auth?.sub ?? null, action: "DELETE", entityType: "PORTFOLIO", entityId: item.id });
  res.status(204).send();
});

// Users (ADMIN only)
adminRouter.get("/users", requireRole(["ADMIN"]), async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const offset = (page - 1) * limit;
  const { rows, count } = await User.findAndCountAll({
    attributes: ["id", "email", "role", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

adminRouter.post("/users", requireRole(["ADMIN"]), async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR")
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await User.create({ email: parsed.data.email, passwordHash, role: parsed.data.role } as any);
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "CREATE",
    entityType: "USER",
    entityId: user.id,
    meta: { email: user.email, role: user.role }
  });
  res.status(201).json({ user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt } });
});

adminRouter.patch("/users/:id", requireRole(["ADMIN"]), async (req, res) => {
  const schema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(["ADMIN", "EDITOR"]).optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });

  if (parsed.data.email !== undefined) user.email = parsed.data.email;
  if (parsed.data.role !== undefined) user.role = parsed.data.role;
  if (parsed.data.password !== undefined) user.passwordHash = await hashPassword(parsed.data.password);
  await user.save();

  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "UPDATE",
    entityType: "USER",
    entityId: user.id
  });
  res.json({ user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt } });
});

adminRouter.delete("/users/:id", requireRole(["ADMIN"]), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  await user.destroy();
  await writeAudit({
    req,
    actorUserId: (req as any).auth?.sub ?? null,
    action: "DELETE",
    entityType: "USER",
    entityId: user.id
  });
  res.status(204).send();
});

// Service requests endpoints
adminRouter.get("/service-requests", requireRole(["ADMIN"]), async (req, res) => {
  try {
    const page = Math.max(1, Number(typeof req.query.page === "string" ? req.query.page : 1) || 1);
    const limit = Math.min(100, Math.max(1, Number(typeof req.query.limit === "string" ? req.query.limit : 20) || 20));
    const status = req.query.status as string;

    const where: any = {};
    if (status && ['pending', 'done'].includes(status)) {
      where.status = status;
    }

    const { count, rows } = await ServiceRequest.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });

    const [totalAll, totalPending, totalDone] = await Promise.all([
      ServiceRequest.count(),
      ServiceRequest.count({ where: { status: 'pending' } }),
      ServiceRequest.count({ where: { status: 'done' } })
    ]);

    res.json({
      items: rows,
      total: count, // this is count based on filter
      totalAll,
      totalPending,
      totalDone,
      pendingCount: totalPending, // for compatibility
      page,
      limit
    });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

adminRouter.patch("/service-requests/:id/status", requireRole(["ADMIN"]), async (req, res) => {
  try {
    const requestId = req.params.id;

    const schema = z.object({
      status: z.enum(["pending", "done"]),
      statusReason: z.string().optional().nullable()
    });

    // Normalize body if possible (e.g. handle trim if it was a string before parsing)
    if (req.body && typeof req.body.status === 'string') {
      req.body.status = req.body.status.trim().toLowerCase();
    }

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues[0]?.message ?? "Invalid status";
      console.log(`Validation failed for request ${requestId}: ${details}`, req.body);
      return res.status(400).json({ error: `Invalid status: ${req.body?.status}. ${details}` });
    }

    const { status, statusReason } = parsed.data;
    const serviceRequest = await ServiceRequest.findByPk(requestId);

    if (!serviceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    }

    // Business Logic: Cannot return to pending if already done
    if (serviceRequest.status === 'done' && status === 'pending') {
      return res.status(400).json({ error: "Cannot return completed request to pending status" });
    }

    // Business Logic: Reason is mandatory when marking as done
    if (status === 'done' && (!statusReason || statusReason.trim().length < 2)) {
      return res.status(400).json({ error: "Reason is required to mark request as done" });
    }

    await serviceRequest.update({
      status: status as 'pending' | 'done',
      statusReason: statusReason || null
    });

    await writeAudit({
      req,
      actorUserId: (req as any).auth?.sub ?? null,
      action: "UPDATE",
      entityType: "SERVICE_REQUEST",
      entityId: String(serviceRequest.get('id')),
      meta: { status, statusReason }
    });

    res.json({
      id: serviceRequest.get('id'),
      status: serviceRequest.get('status'),
      statusReason: serviceRequest.get('statusReason'),
      updatedAt: serviceRequest.get('updatedAt')
    });
  } catch (error) {
    console.error("Error updating service request status:", error);
    res.status(500).json({ error: "Failed to update service request status" });
  }
});

