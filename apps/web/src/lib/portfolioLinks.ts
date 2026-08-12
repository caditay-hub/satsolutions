// Перелинковка кейсов портфолио → каталог и услуги.
//
// Зачем: страницы проектов — самые «доверенные» на сайте (реальные объекты, фото,
// заказчики), но раньше они были тупиком: вес не передавался ни товарам, ни услугам.
// Теперь каждый кейс отдаёт ссылки на оборудование, которое там применялось, и на
// профильные услуги/отрасли — это и польза читателю (можно сразу посмотреть цену),
// и внутренняя перелинковка на коммерческие страницы.
//
// products — slug'и карточек (проверены в каталоге); services — ключи /solutions/<key>.
// Если кейса нет в карте, блоки просто не рендерятся.
export type PortfolioLinks = { products: string[]; services: string[] };

export const PORTFOLIO_LINKS: Record<string, PortfolioLinks> = {
  // ЖК Tower Up: домофония, камеры в лифтах и по периметру, шлагбаумы, парковка
  "zhk-tower-up-intellektualnaya-sistema-bezopasnosti-i-videomonitoringa": {
    products: [
      "hik-ds-kis610-p",
      "hik-ds-kd9403-e6",
      "hik-ds-2cd2347g2-l-2-8mm-c",
      "dahua-dhi-ipmecd-1052-lm30-t15",
      "hik-ds-tcg205-e-s-12v-poe",
      "hik-ds-d5027f2-2p2",
    ],
    services: ["residential", "intercom", "cctv", "barrier", "anpr", "parking"],
  },

  // Серверная под ключ: шкафы, СКС, электропитание
  "montazh-servernoy-komnaty": {
    products: [
      "knd-shkaf-42-yunit-800-800-kanihad",
      "pxt-pxt-20-276010-54-k",
      "pxt-gxt5-10kirt5uxln",
      "pro-patch-panel-24ch-6-cat",
      "pxt-lres1021pf-2sfp28",
      "wtk-wi-tek-wk-ps310-poe-8-2-gb",
    ],
    services: ["server", "network", "fiber", "servers"],
  },

  // Uzum: склады + сеть пунктов выдачи, оборудование Dahua
  "uzum-videonablyudenie-skladov-i-punktov-vydachi": {
    products: [
      "dahua-ipc-hfw1439tl1-a-il",
      "dahua-ipc-hfw3449t1-as-pv",
      "dahua-dhi-nvr4216-4ks3",
      "pro-ds-wd40purx-78-original-hdd-4tb",
      "dahua-pfs3008-8et-l",
    ],
    services: ["warehouse", "cctv", "analytics", "retail", "network"],
  },

  // StreetParking: 150+ бодикамер Dahua с ПО DSS Pro
  "sistema-videonablyudeniya-na-bodikamerah-dahua": {
    products: [
      "dahua-dhi-itc413-pw4d-iz1",
      "dahua-dhi-nvr4216-4ks3",
      "pro-ds20hkvs-vx1-original-hdd-2tb",
    ],
    services: ["parking", "cctv", "anpr", "analytics", "city"],
  },

  // Завод Damira Beverages: 112 точек СКУД, турникеты, распознавание лиц, ANPR
  "skud-zavod-damira-beverages": {
    products: [
      "hik-ds-k3b501sx-m-m",
      "hik-ds-k1t673dwx",
      "hik-ds-k1t344mbwx-qre1",
      "hik-ids-tcm403-b-g-poe-0832",
      "hik-ds-2cd2783g2-izs-2-8-12mm-o-std",
    ],
    services: ["industry", "access", "turnstile", "attendance", "anpr", "cctv"],
  },

  // Финансовая организация: кластер виртуализации на H3C CAS
  "virtualizaciya-h3c-cas-finansovaya-organizaciya": {
    products: [
      "pxt-ls-5570s-36f-ei-gl",
      "pxt-lres1021pf-2sfp28",
      "pxt-gxt5-10kirt5uxln",
      "knd-shkaf-42-yunit-800-800-kanihad",
    ],
    services: ["virtualization", "servers", "server", "bank", "network"],
  },

  // Ucell: видеостена 3×4 Dahua в ситуационном центре
  "ucell-ustanovka-videosteny-dahua-v-situacionnom-centre": {
    products: [
      "hik-ds-d5043f3-1v0s",
      "hik-ds-d5c75rb-b2l",
      "hik-ds-d5abky2-s",
      "pxt-ls-5570s-36f-ei-gl",
    ],
    services: ["videowall", "city", "server", "analytics"],
  },
};

export function portfolioLinks(slug: string): PortfolioLinks | null {
  return PORTFOLIO_LINKS[slug] ?? null;
}
