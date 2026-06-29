// Конфигурация агента-мониторинга satsolutions.uz.
// Все секреты — через env или файлы в /root (как остальные ключи проекта,
// см. memory: fal/perplexity/serper лежат файлами в /root). Ничего не хардкодим.
import "dotenv/config"; // подхватить apps/api/.env (ANTHROPIC_API_KEY и пр.) при запуске из cwd apps/api
import { readFileSync, existsSync } from "node:fs";

/** Прочитать значение: сперва env-переменная, иначе содержимое файла, иначе fallback. */
function fromEnvOrFile(envName: string, filePath?: string, fallback = ""): string {
  const env = process.env[envName];
  if (env && env.trim()) return env.trim();
  if (filePath && existsSync(filePath)) return readFileSync(filePath, "utf8").trim();
  return fallback;
}

export const config = {
  // Сайт.
  siteUrl: process.env.MONITOR_SITE_URL ?? "https://satsolutions.uz",

  // Search Console: домен-ресурс (sc-domain:) либо URL-префикс (https://…/).
  // У satsolutions верифицирован URL-префиксный ресурс — он и стоит по умолчанию.
  gscProperty: process.env.GSC_PROPERTY ?? "https://satsolutions.uz/",

  // GA4: ЧИСЛОВОЙ property id (не G-SHQYK1BS1S — то measurement id).
  // satsolutions.uz → property 543517995 (account 399391006).
  ga4PropertyId: process.env.GA4_PROPERTY_ID ?? "543517995",

  // Сервис-аккаунт Google (JSON ключ). Один аккаунт обслуживает и GSC, и GA4 —
  // его e-mail нужно добавить: в GSC как пользователя ресурса (полные права на чтение),
  // в GA4 как «Аналитик» на уровне ресурса.
  googleSaKeyFile: process.env.GOOGLE_SA_KEY_FILE ?? "/root/.gsc_sa.json",

  // PageSpeed Insights API key (необязателен, но снимает лимит анонимных запросов).
  psiApiKey: fromEnvOrFile("PSI_API_KEY", "/root/.psi_key"),

  // Ключевые URL для замера Core Web Vitals (mobile). Главная + типовые шаблоны.
  psiUrls: (process.env.PSI_URLS?.split(",").map((s) => s.trim()).filter(Boolean)) ?? [
    "https://satsolutions.uz/ru",
    "https://satsolutions.uz/ru/catalog",
    "https://satsolutions.uz/ru/solutions",
  ],

  // Telegram-бот для отчётов и алертов (https://t.me/CRM_SAT_bot).
  telegramBotToken: fromEnvOrFile("TELEGRAM_BOT_TOKEN", "/root/.telegram_monitor_bot"),
  telegramChatId: fromEnvOrFile("TELEGRAM_CHAT_ID", "/root/.telegram_monitor_chat"),

  // Claude для нарративного разбора (ключ уже есть в apps/api/.env).
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.MONITOR_CLAUDE_MODEL ?? "claude-opus-4-8",

  // Где храним снапшоты для сравнения неделя-к-неделе.
  dataDir: process.env.MONITOR_DATA_DIR ?? "/root/monitor-data",

  // Пороги для жёстких алертов (срабатывают сразу, без Claude).
  thresholds: {
    clicksDropPct: 25,      // падение кликов GSC WoW, % → алерт
    sessionsDropPct: 25,    // падение сессий GA4 WoW, %
    positionDrop: 3,        // ухудшение средней позиции (в пунктах) по топ-запросам
    lcpPoorMs: 4000,        // LCP хуже этого (мс, mobile) → «плохо»
    clsPoor: 0.25,          // CLS хуже этого → «плохо»
    inpPoorMs: 500,         // INP хуже этого (мс) → «плохо»
    cpcRisePct: 30,         // рост среднего CPC Google Ads WoW, % (Phase 2)
  },
} as const;

/** Маскированная сводка конфигурации — для логов (секреты не печатаем). */
export function configSummary(): string {
  const have = (s: string) => (s ? "✓" : "✗");
  return [
    `site=${config.siteUrl}`,
    `gsc=${config.gscProperty}`,
    `ga4=${config.ga4PropertyId || "(не задан)"}`,
    `sa=${have(existsSync(config.googleSaKeyFile) ? "x" : "")}`,
    `psiKey=${have(config.psiApiKey)}`,
    `tg=${have(config.telegramBotToken)}/${have(config.telegramChatId)}`,
    `claude=${have(config.anthropicApiKey)}`,
  ].join(" ");
}
