import { Router } from "express";
import { Op } from "sequelize";
import { Category } from "../models/Category.js";
import { Brand } from "../models/Brand.js";
import { Post } from "../models/Post.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Service } from "../models/Service.js";
import { PortfolioCategory } from "../models/PortfolioCategory.js";
import { PortfolioProject } from "../models/PortfolioProject.js";
import { Partner } from "../models/Partner.js";
import { Certificate } from "../models/Certificate.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { SitePage } from "../models/SitePage.js";
import { FeedbackMessage } from "../models/FeedbackMessage.js";
import { ServiceCategory } from "../models/ServiceCategory.js";
import { sequelize } from "../db.js";
import { parseLimit, parsePositiveInt } from "../utils/pagination.js";

function pickRate(data: any): number | null {
  const v = data?.usdToUzs;
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const publicRouter = Router();

publicRouter.get("/categories", async (_req, res) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json({ categories });
});

publicRouter.get("/portfolio-categories", async (_req, res) => {
  const categories = await PortfolioCategory.findAll({ order: [["name", "ASC"]] });
  res.json({ categories });
});

publicRouter.get("/service-categories", async (_req, res) => {
  const items = await ServiceCategory.findAll({ order: [["sortOrder", "ASC"]] });
  res.json({ items });
});

publicRouter.get("/brands", async (_req, res) => {
  const brands = await Brand.findAll({ where: { published: true }, order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json({ brands });
});

publicRouter.get("/partners", async (_req, res) => {
  const partners = await Partner.findAll({ where: { published: true }, order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json({ partners });
});

publicRouter.get("/certificates", async (_req, res) => {
  const certificates = await Certificate.findAll({ where: { published: true }, order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json({ certificates });
});

publicRouter.get("/products", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 12, 50);
  const offset = (page - 1) * limit;

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : "";
  const sort = typeof req.query.sort === "string" ? req.query.sort : "new";
  const recommendedRaw = typeof req.query.recommended === "string" ? req.query.recommended.trim().toLowerCase() : "";
  const mp = typeof req.query.mp === "string" ? req.query.mp.trim() : "";
  const audio = typeof req.query.audio === "string" ? req.query.audio.trim() : "";
  const technology = typeof req.query.technology === "string" ? req.query.technology.trim() : "";
  const installationType = typeof req.query.installationType === "string" ? req.query.installationType.trim() : "";

  const where: any = { published: true };
  if (recommendedRaw === "1" || recommendedRaw === "true" || recommendedRaw === "yes") {
    where.recommended = true;
  }
  if (q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { shortDescription: { [Op.iLike]: `%${q}%` } }
    ];
  }

  // MP filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (mp) {
    // Escape mp value to prevent SQL injection
    const escapedMp = mp.replace(/'/g, "''");

    // Use sequelize.literal with JSONB cast to text for proper ILIKE search
    const mpCondition = sequelize.literal(
      `("Product"."characteristics"::text ILIKE '%${escapedMp} MP%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}Мп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}мп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Мегапиксель%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} мегапиксель%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Мегапикселя%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} мегапикселя%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Megapixel%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} megapixel%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Mп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}M%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} мп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}М%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} м%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}MP%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}M%')`
    );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      mpCondition
    ];
  }

  // Audio filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (audio) {
    const audioCondition = audio === "microphone"
      ? sequelize.literal(
        `("Product"."characteristics"::text ILIKE '%микрофон%' OR ` +
        `"Product"."characteristics"::text ILIKE '%микрофона%' OR ` +
        `"Product"."characteristics"::text ILIKE '%microphone%' OR ` +
        `"Product"."characteristics"::text ILIKE '%Встроенный микрофон%' OR ` +
        `"Product"."characteristics"::text ILIKE '%встроенный микрофон%' OR ` +
        `"Product"."characteristics"::text ILIKE '%микрофон встроенный%' OR ` +
        `"Product"."characteristics"::text ILIKE '%аудио вход%' OR ` +
        `"Product"."characteristics"::text ILIKE '%аудио выход%' OR ` +
        `"Product"."characteristics"::text ILIKE '%звук%' OR ` +
        `"Product"."characteristics"::text ILIKE '%audio%')`
      )
      : sequelize.literal(
        `("Product"."characteristics"::text ILIKE '%без микрофона%' OR ` +
        `"Product"."characteristics"::text ILIKE '%no microphone%' OR ` +
        `"Product"."characteristics"::text ILIKE '%без аудио%' OR ` +
        `"Product"."characteristics"::text ILIKE '%no audio%' OR ` +
        `"Product"."characteristics"::text ILIKE '%без звука%' OR ` +
        `"Product"."characteristics"::text ILIKE '%no sound%')`
      );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      audioCondition
    ];
  }

  // Technology filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (technology) {
    // Escape technology value to prevent SQL injection
    const escapedTech = technology.replace(/'/g, "''");

    // Simple pattern matching - search for the exact value user selected
    const techCondition = sequelize.literal(
      `("Product"."characteristics"::text ILIKE '%${escapedTech}%')`
    );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      techCondition
    ];
  }

  // Installation Type filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (installationType) {
    // Escape installationType value to prevent SQL injection
    const escapedType = installationType.replace(/'/g, "''");

    // Use sequelize.literal with JSONB cast to text for proper ILIKE search
    const installationCondition = sequelize.literal(
      `("Product"."characteristics"::text ILIKE '%${escapedType}%')`
    );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      installationCondition
    ];
  }

  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  let categoryId: string | null = null;
  if (category) {
    // allow passing either categoryId UUID or category slug
    if (isUuid(category)) {
      const byId = await Category.findByPk(category, { attributes: ["id"] });
      if (byId) categoryId = byId.id;
    } else {
      const bySlug = await Category.findOne({ where: { slug: category }, attributes: ["id"] });
      if (bySlug) categoryId = bySlug.id;
    }
  }
  if (categoryId) {
    // if user clicks parent category, show products for it + its first-level children
    const children = await Category.findAll({ where: { parentId: categoryId }, attributes: ["id"] });
    const ids = [categoryId, ...children.map((c) => c.id)];
    where.categoryId = { [Op.in]: ids };
  }

  let brandId: string | null = null;
  if (brand) {
    if (isUuid(brand)) {
      const byId = await Brand.findByPk(brand, { attributes: ["id"] });
      if (byId) brandId = byId.id;
    } else {
      const bySlug = await Brand.findOne({ where: { slug: brand, published: true }, attributes: ["id"] });
      if (bySlug) brandId = bySlug.id;
    }
  }
  if (brandId) where.brandId = brandId;

  // Use site exchange rate so USD prices are converted to UZS for correct ordering
  let usdToUzs = 1;
  try {
    const site = await SitePage.findOne({ where: { key: "site" } });
    usdToUzs = pickRate(site?.data) ?? 1;
  } catch {
    // ignore, fallback to 1
  }

  // Use the same alias ("Product") that Sequelize applies in FROM clause
  const convertedPriceExpr = sequelize.literal(
    `CASE WHEN "Product"."isUsd" = true THEN "Product"."price" * ${usdToUzs} ELSE "Product"."price" END`
  );

  const order: any[] =
    sort === "price_asc"
      ? [[convertedPriceExpr, "ASC"]]
      : sort === "price_desc"
        ? [[convertedPriceExpr, "DESC"]]
        : sort === "name_asc"
          ? [["name", "ASC"]]
          : sort === "name_desc"
            ? [["name", "DESC"]]
            : sort === "old"
              ? [["updatedAt", "ASC"]]
              : [["updatedAt", "DESC"]];

  const { rows, count } = await Product.findAndCountAll({
    where,
    order,
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/products/:slug", async (req, res) => {
  const product = await Product.findOne({
    where: { slug: req.params.slug, published: true }
  });
  if (!product) return res.status(404).json({ error: "Not found" });
  return res.json({ product });
});

publicRouter.get("/news", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 10, 50);
  const offset = (page - 1) * limit;

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const where: any = { published: true };
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { excerpt: { [Op.iLike]: `%${q}%` } }
    ];
  }

  const { rows, count } = await Post.findAndCountAll({
    where,
    order: [["publishedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/news/:slug", async (req, res) => {
  const post = await Post.findOne({ where: { slug: req.params.slug, published: true } });
  if (!post) return res.status(404).json({ error: "Not found" });
  return res.json({ post });
});

import { KeyTechnology } from "../models/KeyTechnology.js"; // Added import

// ...

publicRouter.get("/services", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 50, 200); // Increased limit to fetch all for tree
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const topOnly = req.query.topOnly === "true";
  const offset = (page - 1) * limit;

  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  const where: any = { published: true };
  if (topOnly) {
    where.parentId = null;
  }
  if (category) {
    if (isUuid(category)) {
      where.serviceCategoryId = category;
    } else {
      const cat = await ServiceCategory.findOne({ where: { slug: category }, attributes: ["id"] });
      if (cat) where.serviceCategoryId = cat.id;
    }
  }

  const { rows, count } = await Service.findAndCountAll({
    where,
    order: [["sortOrder", "ASC"], ["updatedAt", "DESC"]],
    limit,
    offset,
    include: [{ model: ServiceCategory, as: "category", attributes: ["id", "name", "slug"] }]
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/services/:slug", async (req, res) => {
  const item = await Service.findOne({
    where: { slug: req.params.slug, published: true },
    include: [
      {
        model: ServiceCategory,
        as: "category",
        attributes: ["id", "name", "slug", "imageUrl"]
      },
      {
        model: Service,
        as: "children",
        where: { published: true },
        required: false,
        attributes: ["id", "title", "slug", "coverImageUrl", "excerpt", "sortOrder"]
      },
      {
        model: KeyTechnology,
        as: "keyTechnologies",
        required: false,
        attributes: ["id", "title", "description", "secondaryDescription", "imageUrl", "secondaryImageUrl", "sortOrder"]
      }
    ],
    order: [
      [{ model: Service, as: "children" }, "sortOrder", "ASC"],
      [{ model: KeyTechnology, as: "keyTechnologies" }, "sortOrder", "ASC"]
    ]
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

publicRouter.get("/portfolio", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 12, 50);
  const offset = (page - 1) * limit;

  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const where: any = { published: true };

  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  let categoryId: string | null = null;
  if (category) {
    if (isUuid(category)) {
      const byId = await PortfolioCategory.findByPk(category, { attributes: ["id"] });
      if (byId) categoryId = byId.id;
    } else {
      const bySlug = await PortfolioCategory.findOne({ where: { slug: category }, attributes: ["id"] });
      if (bySlug) categoryId = bySlug.id;
    }
  }
  if (categoryId) {
    // include selected category + ALL descendants (any depth)
    const all = await PortfolioCategory.findAll({ attributes: ["id", "parentId"] });
    const childrenByParent = new Map<string, string[]>();
    for (const c of all as any[]) {
      const pid = c.parentId ? String(c.parentId) : "";
      const arr = childrenByParent.get(pid) ?? [];
      arr.push(String(c.id));
      childrenByParent.set(pid, arr);
    }

    const ids: string[] = [];
    const seen = new Set<string>();
    const q: string[] = [categoryId];
    while (q.length) {
      const cur = q.shift()!;
      if (seen.has(cur)) continue;
      seen.add(cur);
      ids.push(cur);
      const kids = childrenByParent.get(cur) ?? [];
      for (const k of kids) q.push(k);
    }
    where.portfolioCategoryId = { [Op.in]: ids };
  }

  const { rows, count } = await PortfolioProject.findAndCountAll({
    where,
    order: [["sortOrder", "ASC"], ["updatedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/portfolio/:slug", async (req, res) => {
  const item = await PortfolioProject.findOne({ where: { slug: req.params.slug, published: true } });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

publicRouter.get("/site-pages/:key", async (req, res) => {
  const key = req.params.key;
  if (key !== "about" && key !== "contact" && key !== "site") return res.status(400).json({ error: "Invalid key" });
  const page = await SitePage.findOne({ where: { key } });
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json({ page });
});

// Feedback (public)
publicRouter.post("/feedback", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message || message.length < 5 || message.length > 3000) return res.status(400).json({ error: "Invalid message" });
  if (name && name.length > 200) return res.status(400).json({ error: "Invalid name" });
  if (phone && (phone.length < 7 || phone.length > 32 || !/^[0-9+()\s-]+$/.test(phone))) return res.status(400).json({ error: "Invalid phone" });
  if (email && (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ error: "Invalid email" });

  const created = await FeedbackMessage.create(
    {
      name: name || null,
      phone: phone || null,
      email: email || null,
      message,
      status: "NEW"
    } as any
  );

  console.log("Feedback created (raw):", created);
  console.log("Feedback created (JSON):", JSON.stringify(created, null, 2));
  console.log("Feedback fields:", {
    id: created.id,
    idType: typeof created.id,
    name: created.name,
    phone: created.phone,
    message: created.message,
    status: created.status,
    createdAt: created.createdAt
  });

  // Emit socket event for real-time notification
  const io = req.app.get('io') || (global as any).io;
  console.log("=== FEEDBACK SOCKET START ===");
  console.log("IO instance check for feedback:", {
    fromApp: !!req.app.get('io'),
    fromGlobal: !!(global as any).io,
    ioExists: !!io
  });

  if (io) {
    const adminNs = io.of('/admin-chat');
    console.log("Admin namespace for feedback:", !!adminNs);

    if (adminNs) {
      // Create a simple object to avoid serialization issues
      const eventData = {
        id: String(created.id), // UUID string, not number
        name: created.name,
        phone: created.phone,
        message: created.message,
        createdAt: String(created.createdAt || new Date().toISOString())
      };

      console.log("Feedback socket data (cleaned):", eventData);
      console.log("Emitting feedback to admin namespace...");

      adminNs.emit('admin:new_feedback', eventData);
      console.log("Socket event emitted for new feedback to admin namespace");

      // Check if admin namespace has clients
      const sockets = await adminNs.fetchSockets();
      console.log("Connected admin sockets for feedback:", sockets.length);

      // Try broadcasting to all sockets in namespace
      sockets.forEach((socket: any) => {
        console.log("Sending feedback to socket:", socket.id);
        socket.emit('admin:new_feedback', eventData);
      });

      console.log("=== FEEDBACK SOCKET END ===");
    } else {
      console.error("Admin namespace not found for feedback");
    }
  } else {
    console.error("IO instance not found for feedback notification");
  }

  res.status(201).json({ item: { id: created.id, status: created.status, createdAt: created.createdAt } });
});

// Orders (public)
publicRouter.post("/orders", async (req, res) => {
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (!phone || phone.length < 7 || phone.length > 32) return res.status(400).json({ error: "Invalid phone" });
  if (!/^[0-9+()\s-]+$/.test(phone)) return res.status(400).json({ error: "Invalid phone" });
  if (!items.length) return res.status(400).json({ error: "Cart is empty" });

  const normalized = items
    .map((it: any) => ({
      productId: typeof it?.productId === "string" ? it.productId : "",
      quantity: Number(it?.quantity ?? 0)
    }))
    .filter((it: any) => it.productId && Number.isFinite(it.quantity) && it.quantity > 0)
    .slice(0, 100);

  if (!normalized.length) return res.status(400).json({ error: "Invalid items" });

  // Merge same productIds
  const qtyById = new Map<string, number>();
  for (const it of normalized) qtyById.set(it.productId, (qtyById.get(it.productId) ?? 0) + Math.floor(it.quantity));

  const productIds = Array.from(qtyById.keys());
  const products = await Product.findAll({ where: { id: productIds, published: true } });
  if (products.length !== productIds.length) return res.status(400).json({ error: "Some products not found" });

  const site = await SitePage.findOne({ where: { key: "site" } });
  const usdToUzs = pickRate(site?.data) ?? 1;

  // Build items snapshot + totals
  const rows: Array<{
    productId: string;
    productName: string;
    productSlug: string;
    productCoverImageUrl: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }> = [];

  let total = 0;
  for (const p of products) {
    const quantity = qtyById.get(p.id) ?? 0;
    const base = Number(p.price ?? 0);
    const unitPrice = (p as any).isUsd ? base * usdToUzs : base;
    const lineTotal = unitPrice * quantity;
    total += lineTotal;
    rows.push({
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      productCoverImageUrl: p.coverImageUrl ?? null,
      unitPrice,
      quantity,
      lineTotal
    });
  }

  const created = await sequelize.transaction(async (t) => {
    const order = await Order.create(
      {
        phone,
        status: "NEW",
        totalAmount: total,
        currency: "UZS",
        meta: null
      } as any,
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      rows.map((r) => ({
        orderId: order.id,
        productId: r.productId,
        productName: r.productName,
        productSlug: r.productSlug,
        productCoverImageUrl: r.productCoverImageUrl,
        unitPrice: r.unitPrice,
        quantity: r.quantity,
        lineTotal: r.lineTotal
      })) as any,
      { transaction: t }
    );

    return order;
  });

  // Emit socket event for real-time notification
  const io = req.app.get('io') || (global as any).io;
  console.log("=== ORDER SOCKET START ===");
  console.log("IO instance check for order:", {
    fromApp: !!req.app.get('io'),
    fromGlobal: !!(global as any).io,
    ioExists: !!io
  });

  if (io) {
    // Send to admin namespace (like ChatWidget)
    const adminNs = io.of('/admin-chat');
    const eventData = {
      id: Number(created.id),
      phone: String(created.phone || ''),
      status: String(created.status || ''),
      totalAmount: Number(created.totalAmount || 0),
      currency: String(created.currency || ''),
      items: rows.map(r => ({
        productName: String(r.productName || ''),
        quantity: Number(r.quantity || 0),
        lineTotal: Number(r.lineTotal || 0)
      })),
      createdAt: String(created.createdAt || new Date().toISOString())
    };

    console.log("Order socket data (cleaned):", eventData);
    console.log("Emitting order to admin namespace...");

    adminNs.emit('admin:new_order', eventData);
    console.log("Socket event emitted for new order to admin namespace");

    // Check if admin namespace has clients
    const sockets = await adminNs.fetchSockets();
    console.log("Connected admin sockets for order:", sockets.length);

    // Try broadcasting to all sockets in namespace
    sockets.forEach((socket: any) => {
      console.log("Sending order to socket:", socket.id);
      socket.emit('admin:new_order', eventData);
    });

    console.log("=== ORDER SOCKET END ===");
  } else {
    console.error("IO instance not found for order notification");
  }

  res.status(201).json({
    order: {
      id: created.id,
      status: created.status,
      totalAmount: created.totalAmount,
      currency: created.currency,
      createdAt: created.createdAt
    }
  });
});

// Service request endpoint
publicRouter.post("/service-requests", async (req, res) => {
  try {
    console.log("=== SERVICE REQUEST START ===");
    console.log("Received service request:", req.body);
    const { serviceName, phone, description } = req.body;

    if (!serviceName || !phone) {
      console.log("Missing required fields:", { serviceName, phone });
      return res.status(400).json({ error: "Service name and phone are required" });
    }

    console.log("Creating service request...");
    console.log("Input data:", { serviceName, phone, description });

    const serviceRequest = await ServiceRequest.create({
      serviceName,
      phone,
      description: description || null,
      status: 'pending'
    });

    console.log("Service request created (raw):", serviceRequest);
    console.log("Service request created (JSON):", JSON.stringify(serviceRequest, null, 2));
    console.log("Service request fields:", {
      id: serviceRequest.id,
      idType: typeof serviceRequest.id,
      serviceName: serviceRequest.serviceName,
      serviceNameType: typeof serviceRequest.serviceName,
      phone: serviceRequest.phone,
      phoneType: typeof serviceRequest.phone,
      status: serviceRequest.status,
      statusType: typeof serviceRequest.status,
      createdAt: serviceRequest.createdAt,
      createdAtType: typeof serviceRequest.createdAt
    });

    // Wait a bit for the data to be properly set
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log("Service request after wait:", {
      id: serviceRequest.id,
      serviceName: serviceRequest.serviceName,
      phone: serviceRequest.phone,
      status: serviceRequest.status
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io') || (global as any).io;
    console.log("IO instance check for service request:", {
      fromApp: !!req.app.get('io'),
      fromGlobal: !!(global as any).io,
      ioExists: !!io
    });

    if (io) {
      const adminNs = io.of('/admin-chat');
      console.log("Admin namespace for service request:", !!adminNs);

      if (adminNs) {
        // Create a simple object to avoid serialization issues
        const eventData = {
          id: Number(serviceRequest.get('id')),
          serviceName: String(serviceRequest.get('serviceName') || ''),
          phone: String(serviceRequest.get('phone') || ''),
          status: String(serviceRequest.get('status') || ''),
          createdAt: String(serviceRequest.get('createdAt') || new Date().toISOString())
        };

        console.log("Service request socket data (cleaned):", eventData);
        console.log("Service request data validation:", {
          hasId: !!eventData.id,
          hasServiceName: !!eventData.serviceName,
          hasPhone: !!eventData.phone,
          hasStatus: !!eventData.status,
          hasCreatedAt: !!eventData.createdAt
        });
        console.log("Emitting service request to admin namespace...");

        adminNs.emit('admin:new_service_request', eventData);
        console.log("Socket event emitted for new service request to admin namespace");

        // Check if admin namespace has clients
        const sockets = await adminNs.fetchSockets();
        console.log("Connected admin sockets for service request:", sockets.length);

        // Try broadcasting to all sockets in namespace
        sockets.forEach((socket: any) => {
          console.log("Sending service request to socket:", socket.id);
          socket.emit('admin:new_service_request', eventData);
        });

      } else {
        console.error("Admin namespace not found for service request");
      }
    } else {
      console.error("IO instance not found for service request notification");
    }

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      request: {
        id: serviceRequest.id,
        serviceName: serviceRequest.serviceName,
        phone: serviceRequest.phone,
        description: serviceRequest.description,
        status: serviceRequest.status,
        createdAt: serviceRequest.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ error: "Failed to create service request" });
  }
});
