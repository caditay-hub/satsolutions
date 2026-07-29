const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Force config reload - v2.2
const nextConfig = {
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
  poweredByHeader: false,
  images: {
    deviceSizes: [320, 375, 420, 480, 550, 600, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
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
      { source: "/news", destination: "/", permanent: true },
      { source: "/news/:slug*", destination: "/", permanent: true },
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
      { source: "/en/news/:path*", destination: "/en", permanent: true },
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

