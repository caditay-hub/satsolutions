// Конфиг-аудит Google Ads: следит, чтобы настройки аккаунта не «съезжали».
// Правила соответствуют фиксам ручного API-аудита 2026-07-02 (см. memory):
// гео «Присутствие», потолок CPC у «Максимума кликов», общий список минус-слов
// на каждой кампании, активные/одобренные объявления, корректный счёт конверсий
// и наличие действий по каналам (Звонок/WhatsApp/Telegram/Онлайн-чат).
// 4 лёгких GAQL-запроса на прогон — квота Basic Access (15k/день) не страдает.
import { gadsSearchRows } from "./googleAds.js";

export type GadsConfigIssue = { severity: "warning" | "info"; text: string };

/** Проверить конфигурацию аккаунта. [] — всё в порядке; null — токен ещё не одобрен. */
export async function fetchGoogleAdsConfigAudit(): Promise<GadsConfigIssue[] | null> {
  try {
    const issues: GadsConfigIssue[] = [];

    // ── 1. Кампании: гео, потолок CPC, сети ──
    const camps = await gadsSearchRows(
      "SELECT campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, " +
        "campaign.geo_target_type_setting.positive_geo_target_type, campaign.network_settings.target_content_network, " +
        "campaign.network_settings.target_partner_search_network FROM campaign WHERE campaign.status = 'ENABLED'",
    );
    for (const r of camps) {
      const c = r.campaign ?? {};
      const name = c.name ?? "?";
      const geo = c.geoTargetTypeSetting?.positiveGeoTargetType;
      if (geo !== "PRESENCE") {
        issues.push({
          severity: "warning",
          text: `«${name}»: гео-таргетинг «${geo ?? "?"}» вместо «Присутствие» — объявления видят «интересующиеся» из-за рубежа.`,
        });
      }
      if (c.biddingStrategyType === "TARGET_SPEND" && !c.targetSpend?.cpcBidCeilingMicros) {
        issues.push({
          severity: "warning",
          text: `«${name}»: у «Максимума кликов» нет потолка CPC — ставка может разгоняться.`,
        });
      }
      if (c.networkSettings?.targetContentNetwork) {
        issues.push({ severity: "warning", text: `«${name}»: включена КМС (Display) — для поисковой кампании держим выключенной.` });
      }
      if (c.networkSettings?.targetPartnerSearchNetwork) {
        issues.push({ severity: "info", text: `«${name}»: включены поисковые партнёры Google.` });
      }
    }

    // ── 2. Общий список минус-слов привязан к каждой кампании ──
    const negLinks = await gadsSearchRows(
      "SELECT campaign.name FROM campaign_shared_set WHERE shared_set.type = 'NEGATIVE_KEYWORDS' AND campaign_shared_set.status = 'ENABLED'",
    );
    const withNegs = new Set(negLinks.map((r: any) => r.campaign?.name));
    for (const r of camps) {
      const name = r.campaign?.name;
      if (name && !withNegs.has(name)) {
        issues.push({ severity: "warning", text: `«${name}»: не привязан общий список минус-слов.` });
      }
    }

    // ── 3. Объявления: отклонённые / кампании без активных / POOR ──
    const ads = await gadsSearchRows(
      "SELECT campaign.name, ad_group_ad.policy_summary.approval_status, ad_group_ad.ad_strength " +
        "FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND campaign.status = 'ENABLED'",
    );
    const adsByCamp = new Map<string, any[]>();
    for (const r of ads) {
      const n = r.campaign?.name ?? "?";
      if (!adsByCamp.has(n)) adsByCamp.set(n, []);
      adsByCamp.get(n)!.push(r.adGroupAd ?? {});
    }
    for (const r of camps) {
      const name = r.campaign?.name ?? "?";
      const list = adsByCamp.get(name) ?? [];
      if (!list.length) {
        issues.push({ severity: "warning", text: `«${name}»: нет активных объявлений — кампания не показывается.` });
        continue;
      }
      const disapproved = list.filter((a) => a.policySummary?.approvalStatus === "DISAPPROVED").length;
      if (disapproved) {
        issues.push({ severity: "warning", text: `«${name}»: отклонённых объявлений — ${disapproved}. Проверить в кабинете.` });
      }
      if (list.some((a) => a.adStrength === "POOR")) {
        issues.push({ severity: "info", text: `«${name}»: Ad Strength «Низкое» — усилить заголовки/описания RSA.` });
      }
    }

    // ── 4. Конверсии: счёт и набор каналов ──
    const convs = await gadsSearchRows(
      "SELECT conversion_action.name, conversion_action.primary_for_goal, conversion_action.counting_type " +
        "FROM conversion_action WHERE conversion_action.status = 'ENABLED'",
    );
    for (const r of convs) {
      const ca = r.conversionAction ?? {};
      if (ca.primaryForGoal && ca.countingType === "MANY_PER_CLICK") {
        issues.push({
          severity: "warning",
          text: `Конверсия «${ca.name}» (основная) считает «каждую» (MANY_PER_CLICK) — для лидов нужна «одна на клик».`,
        });
      }
    }
    const convNames = convs.map((r: any) => String(r.conversionAction?.name ?? ""));
    for (const expect of ["Звонок", "WhatsApp", "Telegram", "Онлайн-чат"]) {
      if (!convNames.some((n) => n.includes(expect))) {
        issues.push({
          severity: "warning",
          text: `Пропало действие-конверсия «${expect}» — сайт шлёт событие в никуда (метки в apps/web/src/lib/gtag.ts).`,
        });
      }
    }

    return issues;
  } catch (e) {
    // Токен ещё не одобрен / отозван — блок просто пропускаем, без шума.
    if ((e as Error).message === "GADS_PENDING_APPROVAL") return null;
    throw e;
  }
}
