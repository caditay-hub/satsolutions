"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import type { ProductDto } from "@/lib/api";
import { CatalogCard } from "@/components/CatalogCard";
import { CatalogRow } from "@/components/CatalogRow";

// Товары раздела подгружаются при прокрутке (решение владельца 07.10.2026, без кнопки
// «Показать ещё»). Первая порция приходит с сервера в HTML (её видят поисковики), следующие —
// из /api/catalog-chunk, когда до конца списка остаётся ~1,5 экрана. Под списком сервер
// оставляет обычные ссылки на страницы 2, 3… — по ним робот доходит до всех товаров.
// «Назад» с карточки товара: помним, сколько порций было загружено и где стоял экран,
// и восстанавливаем (иначе человек оказывался в начале списка).

export type InfiniteItem = { p: ProductDto; name: string };

const STATE_TTL = 30 * 60 * 1000;

export function InfiniteProducts({
  initial, total, page, perPage, view, params,
}: {
  initial: InfiniteItem[];
  total: number;
  page: number;
  perPage: number;
  view: "grid" | "list";
  /** фильтры раздела в том виде, в каком их берёт API (type, brand, chars…) */
  params: Record<string, string | undefined>;
}) {
  const locale = useLocale();
  const [items, setItems] = useState<InfiniteItem[]>(initial);
  const [lastPage, setLastPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const restored = useRef(false);

  const loadedAll = lastPage * perPage >= total;
  const retries = useRef(0);
  const stateKey = () => `cat-scroll:${window.location.pathname}${window.location.search}`;

  const fetchPage = useCallback(async (n: number): Promise<InfiniteItem[] | null> => {
    const qs = new URLSearchParams({ page: String(n), limit: String(perPage), locale, view });
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    try {
      const r = await fetch(`/api/catalog-chunk?${qs}`);
      if (!r.ok) return null;
      const j = await r.json();
      return Array.isArray(j?.items) ? (j.items as InfiniteItem[]) : null;
    } catch {
      return null;
    }
  }, [locale, view, perPage, params]);

  const loadNext = useCallback(async () => {
    if (busy.current || loadedAll) return;
    busy.current = true;
    setLoading(true);
    const next = lastPage + 1;
    const got = await fetchPage(next);
    if (got) {
      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.p.id));
        return [...prev, ...got.filter((x) => !seen.has(x.p.id))];
      });
      setLastPage(next);
      setFailed(false);
    } else {
      setFailed(true);
    }
    setLoading(false);
    busy.current = false;
  }, [fetchPage, lastPage, loadedAll]);

  // сбой сети — тихо повторяем через несколько секунд (до 3 раз), кнопок не показываем
  useEffect(() => {
    if (!failed || retries.current >= 3) return;
    const t = window.setTimeout(() => { retries.current += 1; void loadNext(); }, 4000);
    return () => window.clearTimeout(t);
  }, [failed, loadNext]);

  // Возврат «Назад»: догружаем те же порции и ставим экран туда, где он был
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    let saved: { pages: number; y: number; ts: number } | null = null;
    try { saved = JSON.parse(sessionStorage.getItem(stateKey()) || "null"); } catch { saved = null; }
    if (!saved || Date.now() - saved.ts > STATE_TTL || saved.pages <= page) return;
    try { sessionStorage.removeItem(stateKey()); } catch { /* приватный режим */ }
    (async () => {
      busy.current = true;
      setLoading(true);
      const acc: InfiniteItem[] = [];
      let reached = page;
      for (let n = page + 1; n <= saved.pages; n++) {
        const got = await fetchPage(n);
        if (!got) break;
        acc.push(...got);
        reached = n;
      }
      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.p.id));
        return [...prev, ...acc.filter((x) => !seen.has(x.p.id))];
      });
      setLastPage(reached);
      setLoading(false);
      busy.current = false;
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, saved!.y)));
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Подгрузка, когда конец списка рядом с экраном (под товарами длинный текст раздела и
  // подвал: при быстрой прокрутке маркер проскакивали, и наблюдатель пересечений его не
  // видел). Проверяем по прокрутке и после каждой порции.
  useEffect(() => {
    if (loadedAll) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const el = sentinel.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      // рядом с экраном: не дальше ~1200 px ниже и полутора экранов выше. Ушёл рывком к подвалу —
      // браузер держит экран на подвале, маркер остаётся выше, и без нижней границы
      // подгружались бы все товары раздела подряд
      if (top < window.innerHeight + 1200 && top > -1.5 * window.innerHeight) void loadNext();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [loadNext, loadedAll]);

  // Ушёл на карточку товара — запоминаем, сколько загружено и где экран
  const onClickCapture = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a || lastPage <= page) return;
    try { sessionStorage.setItem(stateKey(), JSON.stringify({ pages: lastPage, y: window.scrollY, ts: Date.now() })); } catch { /* приватный режим */ }
  };

  return (
    <div onClickCapture={onClickCapture}>
      {view === "list" ? (
        <div className="flex flex-col gap-2.5">
          {items.map(({ p, name }) => <CatalogRow key={p.id} p={p} name={name} />)}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(({ p, name }) => <CatalogCard key={p.id} p={p} name={name} />)}
        </div>
      )}
      {!loadedAll ? (
        <div ref={sentinel} className="flex h-16 items-center justify-center" aria-live="polite">
          {loading ? <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600 motion-reduce:animate-none" aria-hidden /> : null}
        </div>
      ) : null}
    </div>
  );
}
