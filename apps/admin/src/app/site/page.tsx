"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type SitePageKey = "about" | "contact" | "site";

type SitePageDto = {
  id: string;
  key: SitePageKey;
  title: string;
  content: string | null;
  coverImageUrl: string | null;
  data: any | null;
  createdAt: string;
  updatedAt: string;
};

type HeroButton = {
  label: string;
  href: string;
};

type HeroSlide = {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
  buttons: Array<HeroButton | null>;
};

function safeId(v: any, fallback: string) {
  const s = typeof v === "string" ? v.trim() : "";
  return s || fallback;
}

const HERO_BUTTON_PRESETS: HeroButton[] = [
  { label: "Категории", href: "/categories" },
  { label: "Продукты", href: "/products" },
  { label: "Решения", href: "/solutions" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Новости", href: "/news" },
  { label: "Партнеры", href: "/partners" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contact" }
];

function normalizeButtonSlots(input: any): Array<HeroButton | null> {
  const arr = Array.isArray(input) ? input : [];
  const buttons = arr
    .map((b: any) => ({
      label: typeof b?.label === "string" ? b.label.trim() : "",
      href: typeof b?.href === "string" ? b.href.trim() : ""
    }))
    .filter((b: HeroButton) => b.label && b.href)
    .slice(0, 3);
  return [buttons[0] ?? null, buttons[1] ?? null, buttons[2] ?? null];
}

function buttonsForSave(slots: Array<HeroButton | null>) {
  const arr = Array.isArray(slots) ? slots : [];
  return arr
    .map((b) => ({
      label: typeof b?.label === "string" ? b.label.trim() : "",
      href: typeof b?.href === "string" ? b.href.trim() : ""
    }))
    .filter((b: HeroButton) => b.label && b.href)
    .slice(0, 3);
}

function normalizeSlides(data: any): HeroSlide[] {
  const arr = Array.isArray(data?.heroSlides) ? data.heroSlides : [];
  return arr
    .map((it: any, idx: number) => {
      const id = safeId(it?.id, String(idx + 1));
      return {
        id,
        title: typeof it?.title === "string" ? it.title : "",
        text: typeof it?.text === "string" ? it.text : "",
        imageUrl: typeof it?.imageUrl === "string" ? it.imageUrl : "",
        sortOrder: typeof it?.sortOrder === "number" ? it.sortOrder : Number(it?.sortOrder ?? 0) || 0,
        published: typeof it?.published === "boolean" ? it.published : true,
        buttons: normalizeButtonSlots(it?.buttons)
      } satisfies HeroSlide;
    })
    .filter((x: HeroSlide) => x.id);
}

function normalizeSlidesForSave(slides: HeroSlide[]) {
  return slides
    .map((s) => ({
      id: safeId(s.id, crypto?.randomUUID?.() ?? String(Date.now())),
      title: String(s.title ?? "").trim(),
      text: String(s.text ?? "").trim(),
      imageUrl: String(s.imageUrl ?? "").trim(),
      sortOrder: Number(s.sortOrder ?? 0) || 0,
      published: Boolean(s.published),
      buttons: buttonsForSave(s.buttons)
    }))
    .filter((s) => s.title && s.imageUrl);
}

function resolveImageUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
    return `${base}${url}`;
  }
  return url;
}

function parseLatLng(input: string): { lat: number; lng: number } | null {
  const s = String(input ?? "").trim();
  const m = s.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90) return null;
  if (lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function tryExtractLatLngFromText(input: string): { lat: number; lng: number } | null {
  const s = String(input ?? "").trim();
  if (!s) return null;
  const decoded = (() => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })();
  const m = decoded.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  // Heuristic: if first looks like longitude (abs > 90) swap.
  if (Math.abs(a) > 90 && Math.abs(b) <= 90) return { lat: b, lng: a };
  if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return { lat: a, lng: b };
  if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return { lat: b, lng: a };
  return null;
}

function yandexOpenHref(lat: number, lng: number) {
  const ll = `${lng},${lat}`;
  const pt = `${lng},${lat},pm2rdm`;
  return `https://yandex.uz/maps/?ll=${encodeURIComponent(ll)}&z=16&pt=${encodeURIComponent(pt)}&l=map`;
}

function normalizeAboutData(data: any) {
  return {
    logoImageUrl: typeof data?.logoImageUrl === "string" ? data.logoImageUrl : ""
  };
}

function normalizeContactData(data: any) {
  const lat = typeof data?.geoLat === "number" ? data.geoLat : null;
  const lng = typeof data?.geoLng === "number" ? data.geoLng : null;
  const coords = Number.isFinite(lat) && Number.isFinite(lng) ? `${lat}, ${lng}` : "";
  return {
    phone: typeof data?.phone === "string" ? data.phone : "",
    email: typeof data?.email === "string" ? data.email : "",
    address: typeof data?.address === "string" ? data.address : "",
    geoUrl: coords || (typeof data?.geoUrl === "string" ? data.geoUrl : "")
  };
}

function normalizeSiteData(data: any) {
  const social = data?.social && typeof data.social === "object" ? data.social : {};
  return {
    heroSubtitle: typeof data?.heroSubtitle === "string" ? data.heroSubtitle : "",
    instagramUrl: typeof social?.instagram === "string" ? social.instagram : "",
    telegramUrl: typeof social?.telegram === "string" ? social.telegram : "",
    facebookUrl: typeof social?.facebook === "string" ? social.facebook : "",
    heroSlides: normalizeSlides(data),
    // keep any other keys (usdToUzs, etc.) in raw object
    raw: data && typeof data === "object" ? data : {}
  };
}

async function loadPage(key: SitePageKey): Promise<SitePageDto | null> {
  try {
    const r = await apiFetch<{ page: SitePageDto }>(`/admin/site-pages/${key}`);
    return r.page;
  } catch {
    return null;
  }
}

async function savePage(key: SitePageKey, body: { title: string; content?: string | null; coverImageUrl?: string | null; data?: any | null }) {
  const r = await apiFetch<{ page: SitePageDto }>(`/admin/site-pages/${key}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
  return r.page;
}

export default function SiteContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SitePageKey | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [aboutTitle, setAboutTitle] = useState("О компании");
  const [aboutContent, setAboutContent] = useState("");
  const [aboutCoverImageUrl, setAboutCoverImageUrl] = useState("");
  const [aboutLogoImageUrl, setAboutLogoImageUrl] = useState("");
  const [aboutUploading, setAboutUploading] = useState(false);
  const [aboutLogoUploading, setAboutLogoUploading] = useState(false);

  const [contactTitle, setContactTitle] = useState("Контакты");
  const [contactContent, setContactContent] = useState("");
  const [contactCoverImageUrl, setContactCoverImageUrl] = useState("");
  const [contactUploading, setContactUploading] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [geoUrl, setGeoUrl] = useState("");

  const [siteTitle, setSiteTitle] = useState("Настройки сайта");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [siteRawData, setSiteRawData] = useState<any>({});
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [slideUploadingId, setSlideUploadingId] = useState<string | null>(null);
  const [slideConfirmDeleteId, setSlideConfirmDeleteId] = useState<string | null>(null);

  const [heroBgColor, setHeroBgColor] = useState("");

  const sortedSlides = useMemo(() => {
    return heroSlides.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id.localeCompare(b.id));
  }, [heroSlides]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPage("about"), loadPage("contact"), loadPage("site")])
      .then(([about, contact, site]) => {
        if (about) {
          setAboutTitle(about.title);
          setAboutContent(about.content ?? "");
          setAboutCoverImageUrl(about.coverImageUrl ?? "");
          const a = normalizeAboutData(about.data);
          setAboutLogoImageUrl(a.logoImageUrl);
        }
        if (contact) {
          setContactTitle(contact.title);
          setContactContent(contact.content ?? "");
          setContactCoverImageUrl(contact.coverImageUrl ?? "");
          const c = normalizeContactData(contact.data);
          setPhone(c.phone);
          setEmail(c.email);
          setAddress(c.address);
          setGeoUrl(c.geoUrl);
        }
        if (site) {
          setSiteTitle(site.title || "Настройки сайта");
          const s = normalizeSiteData(site.data);
          setHeroSubtitle(s.heroSubtitle);
          setInstagramUrl(s.instagramUrl);
          setTelegramUrl(s.telegramUrl);
          setFacebookUrl(s.facebookUrl);
          setSiteRawData(s.raw);
          setHeroSlides(s.heroSlides);
          setHeroBgColor(site.data?.heroBgColor ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <h1 className="text-2xl font-semibold">Содержимое сайта</h1>
        <p className="mt-1 text-sm text-slate-600">Заполните страницы «О компании» и «Контакты» из админ‑панели.</p>

        {uploadError ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {uploadError}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка…</div>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-lg font-semibold">О компании</div>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Заголовок</div>
                  <input
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Контент</div>
                  <textarea
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    rows={10}
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">URL обложки</div>
                  <input
                    value={aboutCoverImageUrl}
                    onChange={(e) => setAboutCoverImageUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://... или /uploads/images/..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Загрузить обложку</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={aboutUploading}
                    className="mt-1 block w-full text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploadError(null);
                      setAboutUploading(true);
                      uploadImage(f)
                        .then((url) => setAboutCoverImageUrl(url))
                        .catch((err) => setUploadError(err?.message ?? "Upload failed"))
                        .finally(() => setAboutUploading(false));
                    }}
                  />
                  <div className="mt-1 text-xs text-slate-500">{aboutUploading ? "Загрузка..." : "URL заполнится автоматически."}</div>
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">URL логотипа (для шапки сайта)</div>
                  <input
                    value={aboutLogoImageUrl}
                    onChange={(e) => setAboutLogoImageUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://... или /uploads/images/..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Загрузить логотип</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={aboutLogoUploading}
                    className="mt-1 block w-full text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploadError(null);
                      setAboutLogoUploading(true);
                      uploadImage(f, { kind: "logo" })
                        .then((url) => setAboutLogoImageUrl(url))
                        .catch((err) => setUploadError(err?.message ?? "Upload failed"))
                        .finally(() => setAboutLogoUploading(false));
                    }}
                  />
                  <div className="mt-1 text-xs text-slate-500">{aboutLogoUploading ? "Загрузка..." : "URL заполнится автоматически."}</div>
                </label>

                <button
                  disabled={saving === "about"}
                  onClick={() => {
                    setSaving("about");
                    savePage("about", {
                      title: aboutTitle,
                      content: aboutContent || null,
                      coverImageUrl: aboutCoverImageUrl || null,
                      data: { logoImageUrl: aboutLogoImageUrl || null }
                    })
                      .then((p) => {
                        setAboutTitle(p.title);
                        setAboutContent(p.content ?? "");
                        setAboutCoverImageUrl(p.coverImageUrl ?? "");
                        const a = normalizeAboutData(p.data);
                        setAboutLogoImageUrl(a.logoImageUrl);
                      })
                      .finally(() => setSaving(null));
                  }}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving === "about" ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-lg font-semibold">Контакты</div>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Заголовок</div>
                  <input
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <div className="text-sm font-medium text-slate-700">Телефон</div>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      placeholder="+998 ..."
                    />
                  </label>
                  <label className="block">
                    <div className="text-sm font-medium text-slate-700">Email</div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      placeholder="info@..."
                    />
                  </label>
                </div>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Адрес</div>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Ташкент, UZ"
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Геолокация (ссылка на карту)</div>
                  <input
                    value={geoUrl}
                    onChange={(e) => setGeoUrl(e.target.value)}
                    onBlur={(e) => setGeoUrl(String(e.target.value ?? "").trim())}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="41.326678, 69.285503 или https://maps.google.com/..."
                  />
                  <div className="mt-1 text-xs text-slate-500">Показывается в футере и на странице «О компании».</div>
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Контент (опционально)</div>
                  <textarea
                    value={contactContent}
                    onChange={(e) => setContactContent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    rows={6}
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">URL обложки (опционально)</div>
                  <input
                    value={contactCoverImageUrl}
                    onChange={(e) => setContactCoverImageUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://... или /uploads/images/..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Загрузить обложку</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={contactUploading}
                    className="mt-1 block w-full text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploadError(null);
                      setContactUploading(true);
                      uploadImage(f)
                        .then((url) => setContactCoverImageUrl(url))
                        .catch((err) => setUploadError(err?.message ?? "Upload failed"))
                        .finally(() => setContactUploading(false));
                    }}
                  />
                  <div className="mt-1 text-xs text-slate-500">{contactUploading ? "Загрузка..." : "URL заполнится автоматически."}</div>
                </label>

                <button
                  disabled={saving === "contact"}
                  onClick={() => {
                    setSaving("contact");
                    const raw = String(geoUrl ?? "").trim();
                    const ll = parseLatLng(raw) ?? tryExtractLatLngFromText(raw);
                    const href = ll ? yandexOpenHref(ll.lat, ll.lng) : raw;
                    savePage("contact", {
                      title: contactTitle,
                      content: contactContent || null,
                      coverImageUrl: contactCoverImageUrl || null,
                      data: {
                        phone: phone || null,
                        email: email || null,
                        address: address || null,
                        geoUrl: href || null,
                        geoLat: ll?.lat ?? null,
                        geoLng: ll?.lng ?? null
                      }
                    })
                      .then((p) => {
                        setContactTitle(p.title);
                        setContactContent(p.content ?? "");
                        setContactCoverImageUrl(p.coverImageUrl ?? "");
                        const c = normalizeContactData(p.data);
                        setPhone(c.phone);
                        setEmail(c.email);
                        setAddress(c.address);
                        setGeoUrl(c.geoUrl);
                      })
                      .finally(() => setSaving(null));
                  }}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving === "contact" ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold">Главная страница</div>
          <div className="mt-4 w-full space-y-4">
            <label className="block">
              <div className="text-sm font-medium text-slate-700">Текст под заголовком (hero)</div>
              <input
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Например: CCTV, контроль доступа и smart‑решения безопасности."
              />
              <div className="mt-1 text-xs text-slate-500">Сохраняется в базе данных (site_pages: key=site, data.heroSubtitle).</div>
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <ConfirmDialog
                open={Boolean(slideConfirmDeleteId)}
                title="Удалить слайд?"
                description="Это действие нельзя отменить."
                onClose={() => setSlideConfirmDeleteId(null)}
                onConfirm={() => {
                  const id = slideConfirmDeleteId;
                  if (!id) return;
                  setHeroSlides((prev) => prev.filter((s) => s.id !== id));
                  setSlideConfirmDeleteId(null);
                }}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Карусель (слайды)</div>
                  <div className="mt-1 text-xs text-slate-500">Текст и изображение показываются на главной странице поверх баннера.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const id = crypto?.randomUUID?.() ?? String(Date.now());
                    setHeroSlides((prev) => [
                      ...prev,
                      {
                        id,
                        title: "",
                        text: "",
                        imageUrl: "",
                        sortOrder: prev.length ? Math.max(...prev.map((x) => x.sortOrder ?? 0)) + 1 : 0,
                        published: true,
                        buttons: [null, null, null]
                      }
                    ]);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  + Добавить слайд
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {sortedSlides.map((s) => {
                  const img = resolveImageUrl(s.imageUrl);
                  return (
                    <div key={s.id} className="h-full rounded-2xl border border-slate-200 bg-white p-4" data-aos="fade-up">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900">Слайд</div>
                          <div className="mt-0.5 text-xs text-slate-500">{s.id}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={s.published}
                              onChange={(e) => setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, published: e.target.checked } : x)))}
                            />
                            Published
                          </label>
                          <button
                            type="button"
                            onClick={() => setSlideConfirmDeleteId(s.id)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="space-y-3">
                          <label className="block">
                            <div className="text-sm font-medium text-slate-700">Заголовок</div>
                            <input
                              value={s.title}
                              onChange={(e) => setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))}
                              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              placeholder="Например: Системы видеонаблюдения"
                            />
                          </label>
                          <label className="block">
                            <div className="text-sm font-medium text-slate-700">Текст</div>
                            <textarea
                              value={s.text}
                              onChange={(e) => setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, text: e.target.value } : x)))}
                              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              rows={3}
                              placeholder="Короткое описание..."
                            />
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                              <div className="text-sm font-medium text-slate-700">Sort order</div>
                              <input
                                value={String(s.sortOrder ?? 0)}
                                onChange={(e) =>
                                  setHeroSlides((prev) =>
                                    prev.map((x) => (x.id === s.id ? { ...x, sortOrder: Number(e.target.value) || 0 } : x))
                                  )
                                }
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                inputMode="numeric"
                              />
                            </label>
                            <label className="block">
                              <div className="text-sm font-medium text-slate-700">URL изображения</div>
                              <input
                                value={s.imageUrl}
                                onChange={(e) => setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, imageUrl: e.target.value } : x)))}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                placeholder="/uploads/images/..."
                              />
                            </label>
                          </div>

                          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              disabled={slideUploadingId === s.id}
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                setUploadError(null);
                                setSlideUploadingId(s.id);
                                uploadImage(f, { kind: "hero" })
                                  .then((url) => setHeroSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, imageUrl: url } : x))))
                                  .catch((err) => setUploadError(err?.message ?? "Upload failed"))
                                  .finally(() => setSlideUploadingId(null));
                              }}
                            />
                            {slideUploadingId === s.id ? "Загрузка..." : "Загрузить картинку"}
                          </label>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-slate-700">Превью</div>
                          <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={img} alt={s.title || "slide"} className="h-40 w-full bg-slate-100 object-contain" />
                            ) : (
                              <div className="flex h-40 w-full items-center justify-center text-sm text-slate-500">Нет изображения</div>
                            )}
                          </div>
                        </div>

                        <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 lg:col-span-2">
                          <div className="text-sm font-semibold text-slate-900">Кнопки (до 3)</div>
                          <div className="mt-2 space-y-3">
                            {[0, 1, 2].map((i) => {
                              const b = s.buttons?.[i] ?? null;
                              const presetMatch = b?.href ? HERO_BUTTON_PRESETS.find((p) => p.href === b.href) : null;
                              const presetValue = b?.href ? (presetMatch ? presetMatch.href : "__custom__") : "";
                              return (
                                <div key={i} className="w-full rounded-lg border border-slate-200 bg-white p-3">
                                  <div className="text-xs font-semibold text-slate-600">Кнопка {i + 1}</div>
                                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                                    <label className="block">
                                      <div className="text-sm font-medium text-slate-700">Быстрый выбор</div>
                                      <select
                                        value={presetValue}
                                        onChange={(e) => {
                                          const href = String(e.target.value ?? "");
                                          if (href === "__custom__") return;
                                          if (!href) {
                                            setHeroSlides((prev) =>
                                              prev.map((x) => {
                                                if (x.id !== s.id) return x;
                                                const next = (x.buttons ?? [null, null, null]).slice(0, 3);
                                                next[i] = null;
                                                return { ...x, buttons: next };
                                              })
                                            );
                                            return;
                                          }
                                          const p = HERO_BUTTON_PRESETS.find((v) => v.href === href);
                                          setHeroSlides((prev) =>
                                            prev.map((x) => {
                                              if (x.id !== s.id) return x;
                                              const next = (x.buttons ?? [null, null, null]).slice(0, 3);
                                              next[i] = { label: p?.label ?? "Кнопка", href };
                                              return { ...x, buttons: next };
                                            })
                                          );
                                        }}
                                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                      >
                                        <option value="">— Не показывать —</option>
                                        <option value="__custom__">— Пользовательская —</option>
                                        {HERO_BUTTON_PRESETS.map((p) => (
                                          <option key={p.href} value={p.href}>
                                            {p.label}
                                          </option>
                                        ))}
                                      </select>
                                    </label>

                                    <label className="block">
                                      <div className="text-sm font-medium text-slate-700">Текст</div>
                                      <input
                                        value={b?.label ?? ""}
                                        onChange={(e) => {
                                          const label = String(e.target.value ?? "");
                                          setHeroSlides((prev) =>
                                            prev.map((x) => {
                                              if (x.id !== s.id) return x;
                                              const next = (x.buttons ?? [null, null, null]).slice(0, 3);
                                              const cur = next[i];
                                              next[i] = cur ? { ...cur, label } : { label, href: "" };
                                              return { ...x, buttons: next };
                                            })
                                          );
                                        }}
                                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="Например: Решения"
                                      />
                                    </label>
                                  </div>

                                  <label className="mt-3 block">
                                    <div className="text-sm font-medium text-slate-700">Ссылка</div>
                                    <input
                                      value={b?.href ?? ""}
                                      onChange={(e) => {
                                        const href = String(e.target.value ?? "");
                                        setHeroSlides((prev) =>
                                          prev.map((x) => {
                                            if (x.id !== s.id) return x;
                                            const next = (x.buttons ?? [null, null, null]).slice(0, 3);
                                            const cur = next[i];
                                            next[i] = cur ? { ...cur, href } : { label: "", href };
                                            return { ...x, buttons: next };
                                          })
                                        );
                                      }}
                                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                      placeholder="/solutions или https://..."
                                    />
                                    <div className="mt-1 text-xs text-slate-500">Оставьте пустым, чтобы скрыть кнопку.</div>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sortedSlides.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">Слайдов пока нет.</div>
                ) : null}
              </div>

              <div className="mt-3 text-xs text-slate-500">Сохраняется в базе данных (site_pages: key=site, data.heroSlides).</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Соцсети</div>
              <div className="mt-3 grid gap-3">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Instagram URL</div>
                  <input
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://instagram.com/..."
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Telegram URL</div>
                  <input
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://t.me/..."
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Facebook URL</div>
                  <input
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://facebook.com/..."
                  />
                </label>
              </div>
              <div className="mt-2 text-xs text-slate-500">Сохраняется в базе данных (site_pages: key=site, data.social.*).</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Настройки Hero (Kарусель)</div>
              <div className="mt-3 space-y-3">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Цвет фона Hero блока</div>
                  <div className="mt-1 flex gap-2">
                    <input
                      value={heroBgColor}
                      onChange={(e) => setHeroBgColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Например: black, gray, #f8fafc"
                    />
                    <input
                      type="color"
                      value={heroBgColor.startsWith('#') ? heroBgColor : "#ffffff"}
                      onChange={(e) => setHeroBgColor(e.target.value)}
                      className="h-9 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">Этот цвет будет применен к фону вокруг карусели на главной странице.</p>
                </label>

                {heroBgColor && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 flex items-center justify-center p-3 bg-white">
                    <div
                      className="h-8 w-full rounded border border-slate-100 shadow-inner"
                      style={{ backgroundColor: heroBgColor }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={saving === "site"}
              onClick={() => {
                setSaving("site");
                const next: any = { ...(siteRawData ?? {}) };
                const v = heroSubtitle.trim();
                if (v) next.heroSubtitle = v;
                else delete next.heroSubtitle;

                const ig = instagramUrl.trim();
                const tg = telegramUrl.trim();
                const fb = facebookUrl.trim();
                if (ig || tg || fb) next.social = { instagram: ig || null, telegram: tg || null, facebook: fb || null };
                else delete next.social;

                const slides = normalizeSlidesForSave(heroSlides);
                if (slides.length) next.heroSlides = slides;
                else delete next.heroSlides;

                const bg = heroBgColor.trim();
                if (bg) next.heroBgColor = bg;
                else delete next.heroBgColor;

                savePage("site", { title: siteTitle, data: next })
                  .then((p) => {
                    setSiteTitle(p.title || "Настройки сайта");
                    const s = normalizeSiteData(p.data);
                    setHeroSubtitle(s.heroSubtitle);
                    setInstagramUrl(s.instagramUrl);
                    setTelegramUrl(s.telegramUrl);
                    setFacebookUrl(s.facebookUrl);
                    setSiteRawData(s.raw);
                    setHeroSlides(s.heroSlides);
                  })
                  .finally(() => setSaving(null));
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving === "site" ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}

