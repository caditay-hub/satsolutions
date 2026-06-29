// Источник: PageSpeed Insights API (Core Web Vitals по ключевым URL, mobile).
// Берём field data (CrUX, реальные пользователи) если есть, иначе lab (Lighthouse).
import { config } from "../config.js";

const API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export type CwvMetric = { value: number; rating: "good" | "ni" | "poor" | "na" };
export type PsiResult = {
  url: string;
  source: "field" | "lab";
  lcp: CwvMetric; // мс
  cls: CwvMetric; // unitless
  inp: CwvMetric; // мс
  performanceScore: number | null; // 0..100 (lab)
};

function rate(value: number, good: number, poor: number): CwvMetric["rating"] {
  if (value <= good) return "good";
  if (value <= poor) return "ni";
  return "poor";
}

async function fetchOne(url: string): Promise<PsiResult> {
  const params = new URLSearchParams({ url, strategy: "mobile", category: "performance" });
  if (config.psiApiKey) params.set("key", config.psiApiKey);
  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`PSI ${res.status} для ${url}: ${await res.text()}`);
  const data: any = await res.json();

  const field = data.loadingExperience?.metrics;
  if (field?.LARGEST_CONTENTFUL_PAINT_MS) {
    const lcp = field.LARGEST_CONTENTFUL_PAINT_MS.percentile as number;
    const cls = (field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? 0) / 100;
    const inp = field.INTERACTION_TO_NEXT_PAINT?.percentile as number | undefined;
    return {
      url,
      source: "field",
      lcp: { value: lcp, rating: rate(lcp, 2500, 4000) },
      cls: { value: cls, rating: rate(cls, 0.1, 0.25) },
      inp: inp != null ? { value: inp, rating: rate(inp, 200, 500) } : { value: 0, rating: "na" },
      performanceScore: null,
    };
  }

  // Нет field data (мало трафика на URL) → lab-метрики Lighthouse.
  const audits = data.lighthouseResult?.audits ?? {};
  const labLcp = audits["largest-contentful-paint"]?.numericValue ?? 0;
  const labCls = audits["cumulative-layout-shift"]?.numericValue ?? 0;
  const score = data.lighthouseResult?.categories?.performance?.score;
  return {
    url,
    source: "lab",
    lcp: { value: labLcp, rating: rate(labLcp, 2500, 4000) },
    cls: { value: labCls, rating: rate(labCls, 0.1, 0.25) },
    inp: { value: 0, rating: "na" },
    performanceScore: score != null ? Math.round(score * 100) : null,
  };
}

/** Замерить все ключевые URL последовательно (PSI чувствителен к параллели/лимитам). */
export async function fetchPsi(urls = config.psiUrls): Promise<PsiResult[]> {
  const out: PsiResult[] = [];
  for (const url of urls) {
    try {
      out.push(await fetchOne(url));
    } catch (e) {
      console.error(`[psi] ${url}: ${(e as Error).message}`);
    }
  }
  return out;
}
