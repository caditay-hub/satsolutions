import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "../paths.js";
import { getEnv } from "../env.js";

// Фото в онлайн-чате сайта (10.09.2026). Сюда грузит посетитель из виджета и бот —
// снимок, который менеджер отправил в Telegram-тему диалога. Любой формат пережимаем
// в JPEG до 1600 px: файл лёгкий, без EXIF (геометка с телефона), и Telegram
// принимает его как фото, когда бот показывает снимок клиента менеджерам.
export const chatUploadsDir = path.join(uploadsDir, "chat");
const MAX_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype))
});

// Адрес публичный, без авторизации — поэтому свой лимит на IP.
// Бот ходит по localhost и под лимит не попадает (как и в общем лимите API).
const limiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = (req.ip || "").replace(/^::ffff:/, "");
    return ip === "127.0.0.1" || ip === "::1";
  }
});

export const chatUploadRouter = Router();

chatUploadRouter.post(
  "/chat/upload",
  limiter,
  (req, res, next) => {
    upload.single("file")(req, res, (err: any) => {
      if (!err) return next();
      const tooLarge = err?.code === "LIMIT_FILE_SIZE";
      return res.status(tooLarge ? 413 : 400).json({ error: tooLarge ? "too_large" : "bad_file" });
    });
  },
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "bad_file" });
    const name = `${crypto.randomUUID()}.jpg`;
    try {
      await fs.mkdir(chatUploadsDir, { recursive: true });
      await sharp(req.file.buffer, { limitInputPixels: 50_000_000 })
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(chatUploadsDir, name));
    } catch {
      return res.status(400).json({ error: "bad_file" });
    }
    return res.status(201).json({ url: `${getEnv().API_PUBLIC_BASE_URL.replace(/\/$/, "")}/uploads/chat/${name}` });
  }
);

// Картинку в сообщении чата принимаем только из своей папки: чужие ссылки не пропускаем.
export function chatImageUrl(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const url = v.trim();
  const base = getEnv().API_PUBLIC_BASE_URL.replace(/\/$/, "");
  const ok = url.startsWith(`${base}/uploads/chat/`) && /\/uploads\/chat\/[0-9a-f-]{36}\.jpg$/.test(url);
  return ok ? url : null;
}
