import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import { Op } from "sequelize";
import { authRequired, requireRole } from "../middleware/authMiddleware.js";
import { TelegramClick } from "../models/TelegramClick.js";

// Метка рекламного клика для обращений через Telegram (решение владельца 16.11.2026, вариант Т3
// из docs/GCLID-CHAT-TELEGRAM-PLAN.md). Посетителю с меткой клика сайт подменяет ссылку Telegram
// на бота: t.me/<бот>?start=g_<код>. Сайт присылает сюда пару «код → метка», бот забирает метку
// по коду. Адрес без слова click — такие адреса режут блокировщики рекламы в браузерах.

export const TG_REF_TTL_DAYS = 90; // срок, в течение которого Google принимает конверсию по клику
const TOKEN_RE = /^[A-Za-z0-9]{8,16}$/;
const GCLID_RE = /^[\w.-]{10,200}$/; // та же проверка, что у форм (/feedback, /orders) и в чате

export const telegramClickRouter = Router();

// Тот же лимит, что у форм сайта (public.ts, formLimiter): 20 отправок за 10 минут с одного IP.
// Отдельный счётчик — нажатия на Telegram не съедают лимит заявок и наоборот.
const tgRefLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
  skip: (req) => {
    const ip = (req.ip || "").replace(/^::ffff:/, "");
    return ip === "127.0.0.1" || ip === "::1";
  }
});

// navigator.sendBeacon со строкой шлёт text/plain — «простой» запрос без предварительного OPTIONS
// (с application/json браузер сначала спросил бы разрешение, а CORS у API без credentials — отказ).
// Общий express.json() такой запрос не разбирает, поэтому тело читаем здесь и разбираем сами.
const textBody = express.text({ type: "text/plain", limit: "2kb" });

function cutoff(): Date {
  return new Date(Date.now() - TG_REF_TTL_DAYS * 24 * 60 * 60 * 1000);
}

// Приём кода с сайта (публично). Ответ всегда без тела: странице он не нужен.
telegramClickRouter.post("/tg-ref", tgRefLimiter, textBody, async (req, res) => {
  let body: any = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid body" });
    }
  }
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const gclid = typeof body?.gclid === "string" ? body.gclid.trim() : "";
  const pageRaw = typeof body?.page === "string" ? body.page.trim() : "";
  if (!TOKEN_RE.test(token)) return res.status(400).json({ error: "Invalid token" });
  if (!GCLID_RE.test(gclid)) return res.status(400).json({ error: "Invalid gclid" });
  // страница — только путь сайта без параметров: в журнал не должны попасть ни UTM, ни чужие строки
  const page = pageRaw.startsWith("/") && !/[\s?#]/.test(pageRaw) ? pageRaw.slice(0, 300) : null;

  // Повторная отправка того же кода (второе нажатие на той же вкладке) запись не меняет
  await TelegramClick.findOrCreate({ where: { token }, defaults: { token, gclid, page } });
  return res.status(204).end();
});

// Выдача метки по коду для бота сайта. Подпись — как у админ-запросов: бот сам выпускает токен
// тем же JWT_SECRET (роль ADMIN), этим же токеном он подключается к /admin-chat.
telegramClickRouter.get("/internal/tg-ref/:token", authRequired, requireRole(["ADMIN"]), async (req, res) => {
  const token = String(req.params.token || "");
  if (!TOKEN_RE.test(token)) return res.status(400).json({ error: "Invalid token" });
  const row = await TelegramClick.findOne({ where: { token, createdAt: { [Op.gte]: cutoff() } } });
  if (!row) return res.status(404).json({ error: "Not found" });
  // usedAt — время первого обращения бота; повторный /start с тем же кодом метку получает так же
  if (!row.usedAt) {
    row.usedAt = new Date();
    await row.save();
  }
  return res.json({ gclid: row.gclid, page: row.page, createdAt: row.createdAt, usedAt: row.usedAt });
});

/** Удалить записи старше 90 дней. Возвращает число удалённых строк. */
export async function purgeOldTelegramClicks(): Promise<number> {
  return TelegramClick.destroy({ where: { createdAt: { [Op.lt]: cutoff() } } });
}

/** Чистка журнала: при старте API и далее раз в сутки. Отдельный cron на сервере не нужен. */
export function startTelegramClickPurge() {
  const run = () =>
    purgeOldTelegramClicks()
      .then((n) => {
        if (n) console.log(`[tg-ref] удалено записей старше ${TG_REF_TTL_DAYS} дней: ${n}`);
      })
      .catch((e) => console.error("[tg-ref] чистка журнала не прошла:", e?.message || e));
  run();
  setInterval(run, 24 * 60 * 60 * 1000).unref();
}
