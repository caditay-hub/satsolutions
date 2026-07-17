// Импорт шрифт-файлов как URL (для <link rel="preload">). Next.js webpack
// отдаёт хэшированный путь /_next/static/media/... — хэш-стабильно на сборке.
declare module "*.woff2" {
  const src: string;
  export default src;
}
