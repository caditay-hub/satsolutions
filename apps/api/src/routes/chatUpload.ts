import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import type { ChatAttachment } from "../models/ChatMessage.js";
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


// ── Голосовые, видео и файлы (06.10.2026) ──
// Посетитель записывает голосовое в виджете (Chrome — webm/opus, Safari — mp4/aac) или
// прикладывает файл; бот присылает сюда голосовое/видео/файл, которое менеджер отправил
// в Telegram-тему. Голос сводим к двум файлам: .m4a (AAC — играет в любом браузере, в том
// числе на iPhone) и .ogg (Opus — Telegram показывает его как голосовое). Видео — mp4
// H.264 (не H.264 перекодируем). Файлы — только из белого списка расширений: html, svg,
// js и исполняемые не принимаем, их нельзя отдавать с нашего домена.
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const DOC_EXT = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "rtf", "txt", "csv", "zip", "rar", "7z", "dwg", "dxf", "jpg", "jpeg", "png", "webp", "heic"]);
const AUDIO_EXT = new Set(["webm", "ogg", "oga", "opus", "m4a", "mp4", "mp3", "wav", "aac", "amr"]);
const VIDEO_EXT = new Set(["mp4", "mov", "m4v", "webm", "3gp", "mkv"]);
const KINDS = new Set(["voice", "audio", "video", "file"]);

const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 }
});

function extOf(name: string) {
  const m = /\.([a-z0-9]{1,5})$/i.exec(name || "");
  return m ? m[1].toLowerCase() : "";
}
function cleanName(name: string) {
  // имя файла показываем посетителю и менеджеру: без путей и управляющих символов
  const base = String(name || "").split(/[\\/]/).pop() || "";
  return base.replace(/[\u0000-\u001f<>"]/g, "").trim().slice(0, 150) || "file";
}
function run(cmd: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout: timeoutMs, maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => (err ? reject(err) : resolve(String(stdout))));
  });
}
async function probe(file: string): Promise<{ duration: number | null; vcodec: string | null; acodec: string | null }> {
  try {
    const out = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name", "-of", "json", file], 30_000);
    const j = JSON.parse(out);
    const d = Number(j?.format?.duration);
    const streams: any[] = Array.isArray(j?.streams) ? j.streams : [];
    return {
      duration: Number.isFinite(d) ? Math.round(d * 10) / 10 : null,
      vcodec: streams.find((x) => x.codec_type === "video")?.codec_name ?? null,
      acodec: streams.find((x) => x.codec_type === "audio")?.codec_name ?? null
    };
  } catch {
    return { duration: null, vcodec: null, acodec: null };
  }
}

chatUploadRouter.post(
  "/chat/upload-file",
  limiter,
  (req, res, next) => {
    fileUpload.single("file")(req, res, (err: any) => {
      if (!err) return next();
      const tooLarge = err?.code === "LIMIT_FILE_SIZE";
      return res.status(tooLarge ? 413 : 400).json({ error: tooLarge ? "too_large" : "bad_file" });
    });
  },
  async (req, res) => {
    const f = req.file;
    if (!f) return res.status(400).json({ error: "bad_file" });
    // multer отдаёт имя в latin1 — кириллица в имени договора иначе превращается в «кракозябры»
    const origName = cleanName(Buffer.from(f.originalname || "", "latin1").toString("utf8"));
    const ext = extOf(origName) || extOf(f.mimetype.replace("/", "."));
    let kind = String(req.body?.kind || "file");
    if (!KINDS.has(kind)) kind = "file";
    if (kind === "file" && /^video\//.test(f.mimetype) && VIDEO_EXT.has(ext)) kind = "video";
    if (kind === "file" && /^audio\//.test(f.mimetype) && AUDIO_EXT.has(ext)) kind = "audio";

    const id = crypto.randomUUID();
    const base = getEnv().API_PUBLIC_BASE_URL.replace(/\/$/, "");
    await fs.mkdir(chatUploadsDir, { recursive: true });
    const tmp = path.join(os.tmpdir(), `chat-${id}.${ext || "bin"}`);
    try {
      if (kind === "file") {
        if (!DOC_EXT.has(ext)) return res.status(400).json({ error: "bad_type" });
        const out = `${id}.${ext}`;
        await fs.writeFile(path.join(chatUploadsDir, out), f.buffer);
        const att: ChatAttachment = { url: `${base}/uploads/chat/${out}`, kind: "file", name: origName, size: f.size, mime: f.mimetype || "application/octet-stream" };
        return res.status(201).json({ attachment: att });
      }

      await fs.writeFile(tmp, f.buffer);
      const info = await probe(tmp);

      if (kind === "voice" || kind === "audio") {
        if (!info.acodec) return res.status(400).json({ error: "bad_type" });
        const m4a = path.join(chatUploadsDir, `${id}.m4a`);
        await run("ffmpeg", ["-y", "-v", "error", "-i", tmp, "-vn", "-ac", "1", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", m4a], 120_000);
        if (kind === "voice") {
          // копия для Telegram: голосовым он показывает только OGG/Opus
          const ogg = path.join(chatUploadsDir, `${id}.ogg`);
          await run("ffmpeg", ["-y", "-v", "error", "-i", tmp, "-vn", "-ac", "1", "-c:a", "libopus", "-b:a", "32k", "-application", "voip", ogg], 120_000);
        }
        const st = await fs.stat(m4a);
        const att: ChatAttachment = {
          url: `${base}/uploads/chat/${id}.m4a`,
          kind: kind as "voice" | "audio",
          name: kind === "voice" ? "voice.m4a" : origName,
          size: st.size,
          mime: "audio/mp4",
          duration: info.duration
        };
        return res.status(201).json({ attachment: att });
      }

      // видео
      if (!info.vcodec) return res.status(400).json({ error: "bad_type" });
      const mp4 = path.join(chatUploadsDir, `${id}.mp4`);
      const copyOk = info.vcodec === "h264" && (!info.acodec || info.acodec === "aac");
      const args = copyOk
        ? ["-y", "-v", "error", "-i", tmp, "-c", "copy", "-movflags", "+faststart", mp4]
        : ["-y", "-v", "error", "-i", tmp, "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-vf", "scale=min(1280\\,iw):-2", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", mp4];
      await run("ffmpeg", args, 240_000);
      const st = await fs.stat(mp4);
      const att: ChatAttachment = { url: `${base}/uploads/chat/${id}.mp4`, kind: "video", name: origName, size: st.size, mime: "video/mp4", duration: info.duration };
      return res.status(201).json({ attachment: att });
    } catch (e: any) {
      console.error("[chat/upload-file]", kind, e?.message || e);
      return res.status(400).json({ error: "bad_file" });
    } finally {
      fs.unlink(tmp).catch(() => {});
    }
  }
);

// Вложение в сообщении чата принимаем только своё: файл из uploads/chat/ с допустимым
// расширением и реально лежащий на диске. Поля пересобираем — лишнее не пропускаем.
export function chatAttachment(v: unknown): ChatAttachment | null {
  if (!v || typeof v !== "object") return null;
  const a = v as Record<string, unknown>;
  const kind = String(a.kind || "");
  if (!KINDS.has(kind)) return null;
  const url = typeof a.url === "string" ? a.url.trim() : "";
  const base = getEnv().API_PUBLIC_BASE_URL.replace(/\/$/, "");
  const m = /\/uploads\/chat\/([0-9a-f-]{36})\.([a-z0-9]{1,5})$/.exec(url);
  if (!url.startsWith(`${base}/uploads/chat/`) || !m) return null;
  const ext = m[2];
  const okExt = kind === "file" ? DOC_EXT.has(ext) : kind === "video" ? ext === "mp4" : ext === "m4a";
  if (!okExt || !existsSync(path.join(chatUploadsDir, `${m[1]}.${ext}`))) return null;
  const size = Number(a.size);
  const duration = Number(a.duration);
  return {
    url,
    kind: kind as ChatAttachment["kind"],
    name: cleanName(String(a.name || "")),
    size: Number.isFinite(size) && size >= 0 ? Math.round(size) : 0,
    mime: String(a.mime || "").slice(0, 100),
    duration: Number.isFinite(duration) && duration > 0 && duration < 36000 ? duration : null
  };
}
