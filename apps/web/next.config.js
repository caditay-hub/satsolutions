const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Force config reload - v2.2
const nextConfig = {
  // Сжатие делает nginx (gzip + brotli, conf.d/brotli.conf). Пока жал Next, ответы
  // приходили к nginx уже сжатыми gzip и brotli не срабатывал вообще — проверено
  // замером 09.09.2026: выигрыш был ровно 0 %.
  compress: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizeCss: true, // critical CSS inlining
    optimisticClientCache: true,
    // Keep dynamic page segments in the client router cache so back-navigation
    // (browser arrow + <GlobalBackButton/> router.back()) restores from cache
    // instantly and the scroll position is preserved instead of jumping to top.
    staleTimes: { dynamic: 30, static: 180 },
    optimizePackageImports: ['react-icons', 'lucide-react', '@headlessui/react', '@heroicons/react'],
  },
  // ⚠️ Стриминг метаданных: по умолчанию Next отдаёт <title>, description, canonical и
  // hreflang ПОСЛЕ </head> всем, кого считает способным исполнять JS, — в том числе
  // Googlebot и ИИ-краулерам. Аудит 18.09.2026 показал, что так 155 страниц (весь
  // русский блог, /products/group/*, /kits/*, /products) приходили к Google без меты.
  // Список ниже заменяет умолчание целиком, поэтому включает и «обычных» ботов.
  htmlLimitedBots: new RegExp('Googlebot|Google-InspectionTool|Storebot-Google|Mediapartners-Google|AdsBot-Google|GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|ClaudeBot|Claude-Web|anthropic-ai|Bytespider|CCBot|Amazonbot|Applebot|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|redditbot|vkShare|tumblr|ia_archiver|bitlybot|quora link preview', 'i'),
  poweredByHeader: false,
  images: {
    // 14 ширин плодили десятки вариантов одной картинки в кэше оптимизатора
    // (после каждого деплоя кэш обнуляется и всё пересчитывается заново) — оставили 8.
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Только webp: замер на проде — avif w=1200 считается 1,62 с против 0,38 с у webp
    // при экономии ~15% байт; на 2 vCPU параллельные avif упирались в таймаут
    // оптимизатора (7 с) и давали 504 на /_next/image.
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost", port: "4000" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000" }
    ]
  },
  async redirects() {
    return [
      // Страница «Партнёры» удалена (06.07.2026) — 301 на «О компании» на всех локалях
      { source: "/partners", destination: "/about", permanent: true },
      { source: "/partner", destination: "/about", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/partner", destination: "/:locale/about", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/partners", destination: "/:locale/about", permanent: true },
      // Раздела «Новости» нет — его роль выполняет блог. Ведём именно туда, а не на
      // главную: редирект на главную с тематического URL Google засчитывает как
      // «мягкую 404» (страница-приёмник не про то же, что исходная).
      { source: "/news", destination: "/blog", permanent: true },
      { source: "/news/:slug*", destination: "/blog", permanent: true },
      // То же для остальных локалей: без этих правил /uz/news, /tr/news и /zh/news
      // отдавали 404, хотя ru и en редиректили на главную (обход 18.09.2026).
      { source: "/:locale(uz|en|tr|zh)/news", destination: "/:locale/blog", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/news/:slug*", destination: "/:locale/blog", permanent: true },
      // Легаси-URL старой версии сайта (другая CMS) — в индексе Google, отдавали 404.
      // 301 на новые разделы, чтобы вернуть вес и убрать массовые 404.
      // Точечные маппинги URL, которые ДО СИХ ПОР ранжируются (из GSC 14.07) — ВЫШЕ общих правил:
      { source: "/category/sistemy_videonablyudeniya", destination: "/products/group/videonablyudenie", permanent: true },
      { source: "/category/sistemy_hraneniya_dannyh", destination: "/products/type/servernoe-oborudovanie", permanent: true },
      { source: "/en/product/show/:slug(kamera-videonabliudeniia-hikvision-ds-2cd1083g2-liu.*)", destination: "/products/hik-ds-2cd1083g2-liu-2-8mm", permanent: true },
      { source: "/product/show/:slug(kamera-videonabliudeniia-hikvision-ds-2cd1083g2-liu.*)", destination: "/products/hik-ds-2cd1083g2-liu-2-8mm", permanent: true },
      { source: "/public/en/product/show/:slug(videoregistrator-dhi-nvr1108hs-s3h.*)", destination: "/products/dahua-dhi-nvr1108hs-s3-h", permanent: true },
      // /public/* — внутренний путь старого движка, тоже жил в индексе: общий свал на каталог
      { source: "/public/en/product/show/:path*", destination: "/en/products", permanent: true },
      { source: "/public/product/show/:path*", destination: "/products", permanent: true },
      { source: "/public/en/category/:path*", destination: "/en/products", permanent: true },
      { source: "/public/category/:path*", destination: "/products", permanent: true },
      { source: "/category/:path*", destination: "/products", permanent: true },
      { source: "/page/o-nas", destination: "/about", permanent: true },
      { source: "/page/o-kompanii", destination: "/about", permanent: true },
      { source: "/page/kontakty", destination: "/contact", permanent: true },
      { source: "/page/kontakti", destination: "/contact", permanent: true },
      { source: "/page/contacts", destination: "/contact", permanent: true },
      { source: "/page/:slug*", destination: "/", permanent: true },
      // Легаси-URL старой CMS (массово в индексе Google, отдавали 404 — см. выгрузку GSC).
      // Старый сайт использовал префиксы /ru и /en; /ru/* стрипается middleware и ловится
      // беспрефиксными правилами, для /en нужны явные дубли. 301 на актуальные разделы.
      { source: "/product/show/:path*", destination: "/products", permanent: true },
      { source: "/en/product/show/:path*", destination: "/en/products", permanent: true },
      { source: "/products/filter/:path*", destination: "/products", permanent: true },
      { source: "/en/products/filter/:path*", destination: "/en/products", permanent: true },
      { source: "/brand/:path*", destination: "/catalog", permanent: true },
      { source: "/en/brand/:path*", destination: "/en/catalog", permanent: true },
      { source: "/en/category/:path*", destination: "/en/products", permanent: true },
      { source: "/en/news/:path*", destination: "/en/blog", permanent: true },
      // Битые ссылки вида /products/null: всплыли в логах 15–17.09.2026 (4 848 запросов
      // от рендерящего JS краулера, каждый — полноценная 404-страница на 83 КБ).
      // В БД слагов null нет, воспроизвести на живой странице не удалось, поэтому
      // страхуемся редиректом: даже если ссылка где-то соберётся, она не даст 404.
      { source: "/products/:bad(null|undefined)", destination: "/products", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/products/:bad(null|undefined)", destination: "/:locale/products", permanent: true },
      { source: "/solutions/:bad(null|undefined)", destination: "/solutions", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/solutions/:bad(null|undefined)", destination: "/:locale/solutions", permanent: true },
      { source: "/blog/:bad(null|undefined)", destination: "/blog", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/blog/:bad(null|undefined)", destination: "/:locale/blog", permanent: true },
      // Русские слаги страницы видеонаблюдения: Googlebot до сих пор их долбит (из логов),
      // канонический ключ услуги — cctv.
      { source: "/solutions/:old(videonablyudenie|videonablyudenie-ustanovka|ustanovka-videonablyudeniya)", destination: "/solutions/cctv", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/solutions/:old(videonablyudenie|videonablyudenie-ustanovka|ustanovka-videonablyudeniya)", destination: "/:locale/solutions/cctv", permanent: true },
      // Старые слаги статичных решений → канонические ключи
      { source: "/solutions/umniy-avtobus", destination: "/solutions/bus", permanent: true },
      { source: "/solutions/parkovka", destination: "/solutions/parking", permanent: true },
      // Товар MikroTik CRS320-8P-8B-4S+RM: старый slug содержал кириллическую «в» (был в sitemap, отдавал 404).
      // Slug исправлен на латиницу в БД; 301 со старого URL — на случай, если он попал в индекс Google.
      { source: "/products/mkt-crs320-8p-8в-4s-plusrm", destination: "/products/mkt-crs320-8p-8b-4s-plusrm", permanent: true },
      // Частая опечатка/старые внешние ссылки: /contacts (мн. ч.) → /contact
      { source: "/contacts", destination: "/contact", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/contacts", destination: "/:locale/contact", permanent: true },
      // Кейс портфолио переименован (29.07.2026): «Балтика» → Damira Beverages (реальный клиент, dbe.uz)
      { source: "/portfolio/skud-zavod-baltika", destination: "/portfolio/skud-zavod-damira-beverages", permanent: true },
      { source: "/:locale(uz|en|tr|zh)/portfolio/skud-zavod-baltika", destination: "/:locale/portfolio/skud-zavod-damira-beverages", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(gif|jpe?g|tiff?|png|webp|bmp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);

