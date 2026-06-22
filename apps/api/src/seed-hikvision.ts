/**
 * seed-hikvision.ts  — Hikvision categories + products
 * Run: cd apps/api && npx tsx src/seed-hikvision.ts
 */

import { Sequelize } from "sequelize";
import { v4 as uuid } from "uuid";

const DB = "postgres://satsolutions:satsolutions@localhost:5432/satsolutions";
const seq = new Sequelize(DB, { dialect: "postgres", logging: false });
const HIK = "https://api.satsolutions.uz/uploads/hik";

async function q(sql: string, p: any[] = []) { return seq.query(sql, { replacements: p }); }

async function getBrandId() {
  const [r]: any = await q(`SELECT id FROM brands WHERE slug='hikvision' LIMIT 1`);
  if (!r.length) throw new Error("Brand hikvision not found");
  return r[0].id as string;
}

async function cat(name: string, slug: string, img: string, parentId: string | null, bId: string) {
  const [r]: any = await q(`SELECT id FROM categories WHERE slug=?`, [slug]);
  if (r.length) {
    await q(`UPDATE categories SET name=?,"coverImageUrl"=?,"brandId"=?,"parentId"=?,"updatedAt"=NOW() WHERE slug=?`,
      [name, img, bId, parentId, slug]);
    return r[0].id as string;
  }
  const id = uuid();
  await q(`INSERT INTO categories(id,name,slug,"coverImageUrl","parentId","brandId","createdAt","updatedAt")VALUES(?,?,?,?,?,?,NOW(),NOW())`,
    [id, name, slug, img, parentId, bId]);
  return id;
}

async function prod(catId: string, name: string, slug: string, desc: string, img: string) {
  const [r]: any = await q(`SELECT id FROM products WHERE slug=?`, [slug]);
  if (r.length) {
    await q(`UPDATE products SET name=?,"categoryId"=?,"shortDescription"=?,"coverImageUrl"=?,published=true,"updatedAt"=NOW() WHERE slug=?`,
      [name, catId, desc, img, slug]);
    return;
  }
  await q(`INSERT INTO products(id,name,slug,"shortDescription","coverImageUrl","categoryId",price,"isUsd",published,"createdAt","updatedAt")VALUES(?,?,?,?,?,?,?,?,true,NOW(),NOW())`,
    [uuid(), name, slug, desc, img, catId, "0", true]);
}

async function main() {
  await seq.authenticate();
  const bId = await getBrandId();
  console.log("Brand id:", bId);

  /* ── КАМЕРЫ ── */
  const CAMS = await cat("Камеры", "hik-kamery", `${HIK}/cam-network.jpg`, null, bId);
  const NET  = await cat("Сетевые IP-камеры",   "hik-setevye-kamery", `${HIK}/cam-network.jpg`, CAMS, bId);
  const THD  = await cat("TurboHD камеры",       "hik-turbo-hd",       `${HIK}/cam-turbo.jpg`,  CAMS, bId);
  const PTZ  = await cat("PTZ Speed Dome",        "hik-ptz",            `${HIK}/cam-ptz.jpg`,    CAMS, bId);
  const FEY  = await cat("Fisheye камеры",        "hik-fisheye",        `${HIK}/cam-fisheye.jpg`,CAMS, bId);
  const MINI = await cat("Mini камеры",           "hik-mini-cam",       `${HIK}/cam-mini.jpg`,   CAMS, bId);

  await prod(NET,"DS-2CD2143G2-I — Купольная 4 Мп AcuSense","hik-ds2cd2143g2-i","4 Мп AcuSense купольная, WDR 120 дБ, IR 40 м, IK10, IP67",`${HIK}/cam-network.jpg`);
  await prod(NET,"DS-2CD2T47G2-L — 4 Мп ColorVu цилиндрическая","hik-ds2cd2t47g2-l","4 Мп ColorVu, цветная съёмка ночью без ИК подсветки, IR 60 м",`${HIK}/cam-network.jpg`);
  await prod(NET,"DS-2CD2385G1-I — 8 Мп купольная","hik-ds2cd2385g1-i","8 Мп WDR фиксированная купольная, Deep Learning, IR 30 м, IP67",`${HIK}/cam-network.jpg`);
  await prod(NET,"DS-2CD2T85G1-I8 — 8 Мп цилиндрическая","hik-ds2cd2t85g1-i8","8 Мп цилиндрическая, IR 80 м, WDR 120 дБ, IP67",`${HIK}/cam-network.jpg`);

  await prod(THD,"DS-2CE76D0T-ITMFS — 2 Мп AoC TurboHD купольная","hik-ds2ce76d0t","2 Мп AoC TurboHD купольная, IR 20 м, IP67, металл",`${HIK}/cam-turbo.jpg`);
  await prod(THD,"DS-2CE16H0T-ITF — 5 Мп TurboHD цилиндрическая","hik-ds2ce16h0t-itf","5 Мп TurboHD цилиндрическая, IR 20 м, IP66, металлический корпус",`${HIK}/cam-turbo.jpg`);
  await prod(THD,"DS-2CE72HFT-F28 — 5 Мп ColorVu TurboHD","hik-ds2ce72hft-f28","5 Мп ColorVu TurboHD купольная, цвет 24/7, встроенный микрофон",`${HIK}/cam-turbo.jpg`);

  await prod(PTZ,"DS-2DE4425IW-DE — 4 Мп PTZ 25×","hik-ds2de4425iw-de","4 Мп PTZ, 25× оптический зум, IR 100 м, AcuSense, IP66",`${HIK}/cam-ptz.jpg`);
  await prod(PTZ,"DS-2DE2A404IW-DE3 — 4 Мп Mini PTZ 4×","hik-ds2de2a404iw","4 Мп mini PTZ, 4× зум, IR 50 м, WDR 120 дБ, IP66",`${HIK}/cam-ptz.jpg`);
  await prod(PTZ,"DS-2DE4A425IW-DE — 4 Мп PTZ AcuSense 25×","hik-ds2de4a425iw","4 Мп PTZ AcuSense, 25× зум, IR 100 м, Smart Tracking",`${HIK}/cam-ptz.jpg`);

  await prod(FEY,"DS-2CD2955G1-ISU — 5 Мп Fisheye 360°","hik-ds2cd2955g1-isu","5 Мп Fisheye, 360°, встроенный микрофон, Deep Learning, IP66",`${HIK}/cam-fisheye.jpg`);
  await prod(FEY,"DS-2CD2955G1-ISU/S — 5 Мп Fisheye с кронштейном","hik-ds2cd2955g1-isus","5 Мп Fisheye с монтажным кронштейном, панорамный обзор",`${HIK}/cam-fisheye.jpg`);

  await prod(MINI,"DS-2CD2525G0-IMS — 2 Мп Mini купольная","hik-ds2cd2525g0-ims","2 Мп WDR mini купольная, мотор-зум 2.8-12 мм, IR 40 м, IP67",`${HIK}/cam-mini.jpg`);
  await prod(MINI,"DS-2CD2545FWD-IS — 4 Мп Mini купольная","hik-ds2cd2545fwd-is","4 Мп mini купольная, WDR 120 дБ, встроенный микрофон, PoE",`${HIK}/cam-mini.jpg`);

  /* ── ВИДЕОРЕГИСТРАТОРЫ ── */
  const REC = await cat("Видеорегистраторы", "hik-registratory", `${HIK}/nvr.jpg`, null, bId);
  const NVR = await cat("Сетевые видеорегистраторы (NVR)", "hik-nvr", `${HIK}/nvr.jpg`, REC, bId);
  const DVR = await cat("Цифровые видеорегистраторы (DVR)", "hik-dvr", `${HIK}/dvr.jpg`, REC, bId);

  await prod(NVR,"DS-7616NXI-K2/16P — 16-кан. 4K PoE NVR","hik-ds7616nxi-k2-16p","16-канальный AcuSense NVR, 16× PoE, 4K, до 12 Мп, 2× SATA до 10 ТБ",`${HIK}/nvr.jpg`);
  await prod(NVR,"DS-7732NXI-K4/16P — 32-кан. PoE NVR","hik-ds7732nxi-k4-16p","32-канальный AcuSense NVR, 16× PoE, 4K вывод, 4× SATA до 10 ТБ",`${HIK}/nvr.jpg`);
  await prod(NVR,"DS-7608NI-K2/8P — 8-кан. PoE NVR","hik-ds7608ni-k2-8p","8-кан. NVR, 8× PoE, поддержка 4K и 8 Мп, H.265+, 2× SATA",`${HIK}/nvr.jpg`);
  await prod(NVR,"DS-7604NI-K1/4P — 4-кан. PoE NVR","hik-ds7604ni-k1-4p","4-кан. NVR, 4× PoE, 4K, 1-диск, компактный корпус",`${HIK}/nvr.jpg`);

  await prod(DVR,"DS-7216HQHI-K2 — 16-кан. TurboHD DVR 5 Мп","hik-ds7216hqhi-k2","16-кан. Turbo HD DVR, 5 Мп Lite, H.265Pro+, 2× SATA до 10 ТБ",`${HIK}/dvr.jpg`);
  await prod(DVR,"DS-7108HQHI-K1 — 8-кан. TurboHD DVR 3 Мп","hik-ds7108hqhi-k1","8-кан. Turbo HD DVR, 3 Мп Lite, H.265+, 1× SATA до 10 ТБ",`${HIK}/dvr.jpg`);
  await prod(DVR,"DS-7204HQHI-K1 — 4-кан. TurboHD DVR","hik-ds7204hqhi-k1","4-кан. Turbo HD DVR, 3 Мп Lite, H.265+, компактный настольный корпус",`${HIK}/dvr.jpg`);

  /* ── КОНТРОЛЬ ДОСТУПА ── */
  const ACC  = await cat("Контроль доступа", "hik-kontrol-dostupa", `${HIK}/access-face.jpg`, null, bId);
  const FACE = await cat("Терминалы распознавания лиц", "hik-face-terminals",   `${HIK}/access-face.jpg`,   ACC, bId);
  const READ = await cat("Считыватели карт",             "hik-card-readers",     `${HIK}/access-reader.jpg`, ACC, bId);
  const CTRL = await cat("Контроллеры доступа",          "hik-access-ctrl",      `${HIK}/access-ctrl.jpg`,  ACC, bId);
  const TURN = await cat("Шлагбаумы и турникеты",        "hik-shlagbaumy",       `${HIK}/access-turn.jpg`,  ACC, bId);

  await prod(FACE,"DS-K1T671TM-3XF — Терминал лица + карта + отпечаток","hik-ds-k1t671tm","Терминал с распознаванием лиц, карт Mifare и отпечатков, Android, 7'' экран",`${HIK}/access-face.jpg`);
  await prod(FACE,"DS-K1T342MWXF — Face + QR + маска + температура","hik-ds-k1t342mwxf","Многофункциональный терминал: лицо, QR-код, карта, маска, измерение температуры",`${HIK}/access-face.jpg`);
  await prod(FACE,"DS-K1T605MF — Мини терминал с лицом и картой","hik-ds-k1t605mf","Компактный терминал, распознавание лиц + карты Mifare, IP65, PoE",`${HIK}/access-face.jpg`);

  await prod(READ,"DS-K1108M — Считыватель Mifare","hik-ds-k1108m","Бесконтактный Mifare считыватель, IP65, RS-485/Wiegand, LED индикатор",`${HIK}/access-reader.jpg`);
  await prod(READ,"DS-K1108EK — Считыватель EM+Mifare с клавиатурой","hik-ds-k1108ek","Мультиформатный считыватель EM/Mifare, клавиатура PIN, IP65, Wiegand",`${HIK}/access-reader.jpg`);

  await prod(CTRL,"DS-K2602G — 2-дверный сетевой контроллер","hik-ds-k2602g","2-дверный контроллер доступа, 100 000 карт, Ethernet, RS-485",`${HIK}/access-ctrl.jpg`);
  await prod(CTRL,"DS-K2604 — 4-дверный сетевой контроллер","hik-ds-k2604","4-дверный контроллер, 200 000 карт, Ethernet, Hik-ProConnect",`${HIK}/access-ctrl.jpg`);

  await prod(TURN,"DS-K3G501D — Трёхстворчатый турникет","hik-ds-k3g501d","Трёхстворчатый турникет, двустороннее управление, нержавеющая сталь",`${HIK}/access-turn.jpg`);

  /* ── ВИДЕОДОМОФОНЫ ── */
  const INT  = await cat("Видеодомофоны", "hik-videodomofony", `${HIK}/intercom.jpg`, null, bId);
  const DOOR = await cat("Вызывные панели",  "hik-vyz-paneli",    `${HIK}/intercom-door.jpg`,   INT, bId);
  const INST = await cat("Внутренние мониторы","hik-vnut-mon",   `${HIK}/intercom-indoor.jpg`,  INT, bId);

  await prod(DOOR,"DS-KV8113-WME1 — IP вызывная панель Full HD","hik-ds-kv8113-wme1","1-кнопочная IP вызывная панель, Full HD 2 Мп, PoE, считыватель карт",`${HIK}/intercom-door.jpg`);
  await prod(DOOR,"DS-KD8003-IME2 — Модульная IP панель","hik-ds-kd8003-ime2","IP модульная вызывная панель, 2 Мп, PoE, Mifare считыватель",`${HIK}/intercom-door.jpg`);
  await prod(DOOR,"DS-KV6113-WPE1 — IP вызывная панель с клавиатурой","hik-ds-kv6113-wpe1","IP вызывная панель, 2 Мп, клавиатура, считыватель Mifare, PoE",`${HIK}/intercom-door.jpg`);

  await prod(INST,"DS-KH6320-WTE1 — 7'' Android видеомонитор Wi-Fi","hik-ds-kh6320-wte1","7'' Android видеомонитор, Wi-Fi, Hik-Connect, Alarm input/output",`${HIK}/intercom-indoor.jpg`);
  await prod(INST,"DS-KH8350-WTE1 — 7'' Touch Android монитор","hik-ds-kh8350-wte1","7'' сенсорный Android видеомонитор, Wi-Fi, Hik-Central, встроенный микрофон",`${HIK}/intercom-indoor.jpg`);
  await prod(INST,"DS-KH6320-TE1 — 7'' видеомонитор Ethernet","hik-ds-kh6320-te1","7'' видеомонитор, Ethernet, до 8 вызывных панелей, Hik-Central",`${HIK}/intercom-indoor.jpg`);

  /* ── ОХРАННАЯ СИГНАЛИЗАЦИЯ ── */
  const ALR  = await cat("Охранная сигнализация", "hik-signalizaciya", `${HIK}/alarm.jpg`, null, bId);
  const APNL = await cat("Контрольные панели",   "hik-alarm-paneli",   `${HIK}/alarm-panel.jpg`, ALR, bId);
  const ADET = await cat("Датчики и детекторы",   "hik-datchiki",       `${HIK}/alarm-det.jpg`,   ALR, bId);

  await prod(APNL,"DS-PWA64-Kit-WE — Беспроводная AX PRO 64 зоны","hik-ds-pwa64-kit","Беспроводная панель 64 зоны, AX PRO, Wi-Fi+4G, приложение Hik-ProConnect",`${HIK}/alarm-panel.jpg`);
  await prod(APNL,"DS-PHA64-BP2 — AX Hybrid 64 зоны 868 МГц","hik-ds-pha64-bp2","Гибридная охранная панель AX PRO, 64 зоны, 868 МГц, Ethernet+Wi-Fi",`${HIK}/alarm-panel.jpg`);
  await prod(APNL,"DS-19A08-P — Проводная 8-зонная панель","hik-ds-19a08-p","Проводная охранная панель, 8 зон, USB, приложение на смартфоне",`${HIK}/alarm-panel.jpg`);

  await prod(ADET,"DS-PD1-MT-WE — Беспроводной PIR датчик движения","hik-ds-pd1-mt-we","Беспроводной PIR датчик, 10 м × 120°, 868 МГц, AX PRO",`${HIK}/alarm-det.jpg`);
  await prod(ADET,"DS-PD2-D10P-WE — Беспроводной датчик двери","hik-ds-pd2-d10p-we","Беспроводной магнитный датчик двери/окна, 868 МГц, LED",`${HIK}/alarm-det.jpg`);
  await prod(ADET,"DS-PD1-45R — Проводной PIR детектор","hik-ds-pd1-45r","Проводной PIR детектор движения, 45°×45°, микроволновая защита",`${HIK}/alarm-det.jpg`);

  /* ── ТЕПЛОВИЗОРЫ ── */
  const THR  = await cat("Тепловизионные продукты", "hik-teplovizory", `${HIK}/thermal.jpg`, null, bId);
  const TTHC = await cat("Тепловизионные камеры",   "hik-teplokamery",   `${HIK}/thermal.jpg`,      THR, bId);
  const TTHH = await cat("Ручные тепловизоры",      "hik-ruchnye-th",    `${HIK}/thermal-hand.jpg`, THR, bId);
  const TTHF = await cat("Обнаружение пожаров",     "hik-obnar-pozhar",  `${HIK}/thermal-fire.jpg`, THR, bId);

  await prod(TTHC,"DS-2TD2617B-3/PA — Тепловизор + видео","hik-ds2td2617b-3pa","Двухспектральная камера 160×120 + 4 Мп видео, пожарная сигнализация, IP66",`${HIK}/thermal.jpg`);
  await prod(TTHC,"DS-2TD2628-7/QA — Тепловизор 256×192 7 мм","hik-ds2td2628-7qa","Тепловизионная камера 256×192, 7 мм объектив, пожарная тревога, IP66",`${HIK}/thermal.jpg`);
  await prod(TTHH,"DS-2TP21B-6AVF/W — Ручной тепловизор Wi-Fi","hik-ds2tp21b-6avf","Портативный тепловизор с Wi-Fi, 160×120, точность ±0.5°C",`${HIK}/thermal-hand.jpg`);
  await prod(TTHF,"DS-2TD2628-10/QA — Пожарный тепловизор","hik-ds2td2628-10qa","Тепловизор обнаружения пожаров и горячих точек, 256×192, IP66",`${HIK}/thermal-fire.jpg`);

  /* ── НАКОПИТЕЛИ ── */
  const STR  = await cat("Накопители", "hik-nakopiteli-hik", `${HIK}/storage.jpg`, null, bId);
  const HDD  = await cat("Жёсткие диски",   "hik-hdd-hik",  `${HIK}/storage.jpg`,      STR, bId);
  const SSD  = await cat("SSD накопители",  "hik-ssd-hik",  `${HIK}/storage-ssd.jpg`,  STR, bId);
  const CARD = await cat("Карты памяти",    "hik-sd-hik",   `${HIK}/storage-card.jpg`, STR, bId);

  await prod(HDD,"HikStorage HE2 2 ТБ — HDD для видеонаблюдения","hik-hdd-2tb","2 ТБ жёсткий диск для видеонаблюдения, 3.5'', SATA 6 Гбит/с, 24/7",`${HIK}/storage.jpg`);
  await prod(HDD,"HikStorage HE2 4 ТБ — HDD для видеонаблюдения","hik-hdd-4tb","4 ТБ жёсткий диск для видеонаблюдения, оптимизирован для DVR/NVR, 7200 RPM",`${HIK}/storage.jpg`);
  await prod(SSD,"HS-SSD-E100 256 ГБ — SSD 2.5''","hik-ssd-256gb","256 ГБ SSD SATA для NVR/DVR, скорость чтения 560 МБ/с, 3D NAND TLC",`${HIK}/storage-ssd.jpg`);
  await prod(SSD,"HS-SSD-E100 512 ГБ — SSD 2.5''","hik-ssd-512gb","512 ГБ SSD SATA, высокая надёжность для непрерывной записи",`${HIK}/storage-ssd.jpg`);
  await prod(CARD,"HS-TF-C1 64 ГБ — MicroSD для камер","hik-sd-64gb","64 ГБ microSD Class 10 для IP-камер, непрерывная запись, -40…85°C",`${HIK}/storage-card.jpg`);
  await prod(CARD,"HS-TF-C1 128 ГБ — MicroSD для камер","hik-sd-128gb","128 ГБ microSD для IP-камер видеонаблюдения, высокая надёжность",`${HIK}/storage-card.jpg`);

  /* ── ДИСПЛЕИ ── */
  const DSP  = await cat("Дисплеи и мониторы", "hik-displei-hik", `${HIK}/display-mon.jpg`, null, bId);
  const MON  = await cat("Мониторы видеонаблюдения", "hik-mon-hik",  `${HIK}/display-mon.jpg`, DSP, bId);
  const NVD  = await cat("Сетевые видеодекодеры",    "hik-nvd-hik",  `${HIK}/display-nvd.jpg`, DSP, bId);

  await prod(MON,"DS-D5032FC-A — 32'' Full HD монитор","hik-ds-d5032fc-a","32'' Full HD монитор для видеонаблюдения, IPS панель, HDMI+VGA, 178°",`${HIK}/display-mon.jpg`);
  await prod(MON,"DS-D5055FG-A — 55'' 4K монитор","hik-ds-d5055fg-a","55'' 4K UHD монитор для видеостен, HDMI 2.0, DVI, 178°, 3840×2160",`${HIK}/display-mon.jpg`);
  await prod(NVD,"DS-6900UDI — Декодер 4K","hik-ds-6900udi","4K сетевой декодер видеостен, до 9 Мп на выход, H.265+, HDMI/BNC",`${HIK}/display-nvd.jpg`);

  console.log("✅ Hikvision seed done!");
  await seq.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
