/**
 * Тексты подбора камер в калькуляторе и блока «Угол обзора и дальности DORI» на карточке
 * камеры (этап B), пять языков. Отдельно от content.ts: карточке товара не нужен весь словарь
 * калькулятора. Шаблоны {s} {w} {p} {r} {f} {n} {c} {d} {v} подставляет компонент.
 * Без ссылок и названий чужих сайтов: источник — «документация производителя».
 */

export type CdCatalogUi = {
  title: string; lead: string;
  kindAll: string; kindFixed: string; kindZoom: string;
  verified: string; review: string; reviewNote: string;
  empty: string; loading: string; error: string;
  scene: string; density: string; focal: string; focalEst: string; variant: string; variantHint: string;
  distortion: string; more: string; rejected: string;
  add: string; added: string; open: string; onOrder: string; inStock: string; priceFrom: string; priceOnRequest: string;
  selected: string; leadSelected: string;
  lens: { fixed: string; varifocal: string; ptz: string };
  analog: string;
};

export type CdProductBlock = {
  title: string; lead: string;
  colLens: string; colFov: string; colRange: string;
  wide: string; tele: string;
  verifiedNote: string; reviewNote: string; distortion: string;
  openCalc: string;
  units: { mm: string; m: string };
};

type Pack = { catalog: CdCatalogUi; product: CdProductBlock };

const ru: Pack = {
  catalog: {
    title: "Камеры из каталога под эту задачу",
    lead: "Подобраны по углу обзора и разрешению из документации производителя: зона помещается в кадр, и плотность по всей её ширине не ниже нужной.",
    kindAll: "Все", kindFixed: "Фиксированный объектив", kindZoom: "Вариофокал и PTZ",
    verified: "Подходят по документации производителя",
    review: "Возможно подходят — нужна проверка",
    reviewNote: "Углы подтверждены одним документом производителя или документы расходятся — инженер уточнит перед заказом.",
    empty: "Под такие параметры камеры каталога не проходят обе проверки. Уменьшите ширину зоны или дистанцию, выберите уровень ниже — или отправьте заявку: инженер предложит схему из нескольких камер.",
    loading: "Подбираем камеры…",
    error: "Каталог сейчас недоступен — расчёт выше остаётся в силе. Попробуйте через минуту.",
    scene: "Зона в кадре {s} при нужных {w}",
    density: "Плотность {p} — запас {r}",
    focal: "Фокус ≈ {f}", focalEst: "оценка",
    variant: "Исполнение с объективом {f}", variantHint: "у модели несколько исполнений — уточните при заказе",
    distortion: "Широкоугольный объектив: к краям кадра детализация ниже расчётной",
    more: "Подходят ещё {n} — инженер подберёт оптимальную по цене и монтажу",
    rejected: "Не прошли проверки: по охвату — {c}, по плотности — {d}, без данных о кадре — {n}",
    add: "В заявку", added: "✓ В заявке", open: "Подробнее", onOrder: "Под заказ", inStock: "В наличии",
    priceFrom: "от {v} сум", priceOnRequest: "Цена по запросу",
    selected: "Выбрано для заявки: {n}",
    leadSelected: "Выбранные камеры",
    lens: { fixed: "фиксированный", varifocal: "вариофокал", ptz: "PTZ" },
    analog: "аналоговая HD — для видеорегистратора DVR",
  },
  product: {
    title: "Угол обзора и дальности DORI",
    lead: "Углы — из документации производителя для этой модели. Дальность уровня — до какой глубины по оси камеры держится нужная плотность пикселей; на практике результат зависит ещё от света, ракурса и сжатия видео. Значения могут отличаться от DORI в паспорте: производители считают его по своей методике, здесь — строго по порогам плотности IEC 62676-4.",
    colLens: "Объектив", colFov: "Угол H × V", colRange: "Дальности DORI",
    wide: "широкий край", tele: "узкий край",
    verifiedNote: "Углы сверены по странице модели и datasheet производителя.",
    reviewNote: "Углы подтверждены одним документом производителя — уточняются.",
    distortion: "Широкоугольный объектив с заметной дисторсией: к краям кадра детализация ниже расчётной.",
    openCalc: "Рассчитать для своего объекта",
    units: { mm: "мм", m: "м" },
  },
};

const uz: Pack = {
  catalog: {
    title: "Ushbu vazifa uchun katalogdagi kameralar",
    lead: "Ishlab chiqaruvchi hujjatlaridagi koʻrish burchagi va ruxsat boʻyicha tanlangan: hudud kadrga sigʻadi va uning butun kengligida zichlik keraklidan past emas.",
    kindAll: "Hammasi", kindFixed: "Fiksirlangan obyektiv", kindZoom: "Varifokal va PTZ",
    verified: "Ishlab chiqaruvchi hujjatlari boʻyicha mos keladi",
    review: "Mos kelishi mumkin — tekshirish kerak",
    reviewNote: "Burchaklar ishlab chiqaruvchining bitta hujjati bilan tasdiqlangan yoki hujjatlar farq qiladi — buyurtmadan oldin muhandis aniqlashtiradi.",
    empty: "Bunday parametrlarda katalogdagi kameralar ikkala tekshiruvdan oʻtmaydi. Hudud kengligi yoki masofani kamaytiring, pastroq darajani tanlang — yoki ariza yuboring: muhandis bir nechta kameradan iborat sxema taklif qiladi.",
    loading: "Kameralar tanlanmoqda…",
    error: "Katalog hozir mavjud emas — yuqoridagi hisob kuchda qoladi. Bir daqiqadan soʻng urinib koʻring.",
    scene: "Kadrdagi hudud {s}, kerakli {w}",
    density: "Zichlik {p} — zaxira {r}",
    focal: "Fokus ≈ {f}", focalEst: "taxminiy",
    variant: "{f} obyektivli variant", variantHint: "modelning bir nechta varianti bor — buyurtmada aniqlashtiring",
    distortion: "Keng burchakli obyektiv: kadr chetlarida detallar hisobdagidan past",
    more: "Yana {n} ta mos keladi — muhandis narx va oʻrnatish boʻyicha eng maqbulini tanlaydi",
    rejected: "Tekshiruvdan oʻtmadi: qamrov boʻyicha — {c}, zichlik boʻyicha — {d}, kadr maʼlumotisiz — {n}",
    add: "Arizaga", added: "✓ Arizada", open: "Batafsil", onOrder: "Buyurtma asosida", inStock: "Mavjud",
    priceFrom: "{v} soʻmdan", priceOnRequest: "Narxi soʻrov boʻyicha",
    selected: "Ariza uchun tanlandi: {n}",
    leadSelected: "Tanlangan kameralar",
    lens: { fixed: "fiksirlangan", varifocal: "varifokal", ptz: "PTZ" },
    analog: "analog HD — DVR videoregistratori uchun",
  },
  product: {
    title: "Koʻrish burchagi va DORI masofalari",
    lead: "Burchaklar ushbu model uchun ishlab chiqaruvchi hujjatlaridan olingan. Daraja masofasi — kerakli piksel zichligi kamera oʻqi boʻyicha qaysi chuqurlikkacha saqlanishi; amalda natija yorugʻlik, rakurs va video siqilishiga ham bogʻliq. Qiymatlar pasportdagi DORI dan farq qilishi mumkin: ishlab chiqaruvchilar uni oʻz uslubida hisoblaydi, bu yerda — qatʼiy IEC 62676-4 zichlik chegaralari boʻyicha.",
    colLens: "Obyektiv", colFov: "Burchak H × V", colRange: "DORI masofalari",
    wide: "keng chet", tele: "tor chet",
    verifiedNote: "Burchaklar model sahifasi va ishlab chiqaruvchi datasheet hujjati boʻyicha solishtirilgan.",
    reviewNote: "Burchaklar ishlab chiqaruvchining bitta hujjati bilan tasdiqlangan — aniqlashtirilmoqda.",
    distortion: "Sezilarli distorsiyali keng burchakli obyektiv: kadr chetlarida detallar hisobdagidan past.",
    openCalc: "Oʻz obyektingiz uchun hisoblang",
    units: { mm: "mm", m: "m" },
  },
};

const en: Pack = {
  catalog: {
    title: "Cameras from our catalogue for this task",
    lead: "Selected by the field of view and resolution from the manufacturer’s documentation: the area fits in the frame and the density across its whole width is not below the requirement.",
    kindAll: "All", kindFixed: "Fixed lens", kindZoom: "Varifocal and PTZ",
    verified: "Fit according to the manufacturer’s documentation",
    review: "May fit — needs checking",
    reviewNote: "The angles are confirmed by a single manufacturer document or the documents differ — an engineer will confirm before ordering.",
    empty: "With these parameters no catalogue camera passes both checks. Reduce the area width or distance, choose a lower level — or send a request: an engineer will propose a layout with several cameras.",
    loading: "Selecting cameras…",
    error: "The catalogue is unavailable right now — the calculation above still stands. Please try again in a minute.",
    scene: "Area in frame {s} against the required {w}",
    density: "Density {p} — margin {r}",
    focal: "Focal length ≈ {f}", focalEst: "estimate",
    variant: "Version with a {f} lens", variantHint: "the model comes in several versions — specify when ordering",
    distortion: "Wide-angle lens: detail towards the frame edges is lower than calculated",
    more: "{n} more fit — an engineer will pick the best one for price and installation",
    rejected: "Did not pass: coverage — {c}, density — {d}, no frame data — {n}",
    add: "Add to request", added: "✓ In request", open: "Details", onOrder: "On order", inStock: "In stock",
    priceFrom: "from {v} UZS", priceOnRequest: "Price on request",
    selected: "Selected for the request: {n}",
    leadSelected: "Selected cameras",
    lens: { fixed: "fixed", varifocal: "varifocal", ptz: "PTZ" },
    analog: "analog HD — for a DVR recorder",
  },
  product: {
    title: "Field of view and DORI distances",
    lead: "The angles come from the manufacturer’s documentation for this model. A level’s distance is how deep along the camera axis the required pixel density holds; in practice the result also depends on light, viewing angle and video compression. The values may differ from the DORI in the datasheet: manufacturers calculate it by their own method, here it strictly follows the IEC 62676-4 density thresholds.",
    colLens: "Lens", colFov: "Angle H × V", colRange: "DORI distances",
    wide: "wide end", tele: "tele end",
    verifiedNote: "The angles were cross-checked against the manufacturer’s model page and datasheet.",
    reviewNote: "The angles are confirmed by a single manufacturer document and are being verified.",
    distortion: "Wide-angle lens with noticeable distortion: detail towards the frame edges is lower than calculated.",
    openCalc: "Calculate for your site",
    units: { mm: "mm", m: "m" },
  },
};

const tr: Pack = {
  catalog: {
    title: "Bu görev için katalogdaki kameralar",
    lead: "Üretici belgelerindeki görüş açısı ve çözünürlüğe göre seçildi: alan kareye sığar ve tüm genişliği boyunca yoğunluk gerekenin altına düşmez.",
    kindAll: "Tümü", kindFixed: "Sabit lens", kindZoom: "Varifokal ve PTZ",
    verified: "Üretici belgelerine göre uygun",
    review: "Uygun olabilir — kontrol gerekir",
    reviewNote: "Açılar üreticinin tek bir belgesiyle doğrulandı veya belgeler farklı — sipariş öncesinde mühendis netleştirir.",
    empty: "Bu parametrelerle katalogdaki kameralar iki kontrolü birden geçemiyor. Alan genişliğini veya mesafeyi azaltın, daha düşük bir seviye seçin — ya da talep gönderin: mühendis birkaç kameralı bir yerleşim önerir.",
    loading: "Kameralar seçiliyor…",
    error: "Katalog şu anda kullanılamıyor — yukarıdaki hesap geçerliliğini korur. Bir dakika sonra tekrar deneyin.",
    scene: "Karedeki alan {s}, gereken {w}",
    density: "Yoğunluk {p} — pay {r}",
    focal: "Odak ≈ {f}", focalEst: "tahmin",
    variant: "{f} lensli sürüm", variantHint: "modelin birkaç sürümü var — siparişte belirtin",
    distortion: "Geniş açılı lens: karenin kenarlarına doğru ayrıntı hesaplanandan düşük",
    more: "{n} kamera daha uygun — mühendis fiyat ve montaja göre en iyisini seçer",
    rejected: "Kontrolü geçemedi: kapsama — {c}, yoğunluk — {d}, kare verisi yok — {n}",
    add: "Talebe ekle", added: "✓ Talepte", open: "Ayrıntılar", onOrder: "Siparişe", inStock: "Stokta",
    priceFrom: "{v} UZS’den", priceOnRequest: "Fiyat talep üzerine",
    selected: "Talep için seçildi: {n}",
    leadSelected: "Seçilen kameralar",
    lens: { fixed: "sabit", varifocal: "varifokal", ptz: "PTZ" },
    analog: "analog HD — DVR kaydedici için",
  },
  product: {
    title: "Görüş açısı ve DORI mesafeleri",
    lead: "Açılar bu model için üretici belgelerinden alınmıştır. Seviye mesafesi, gereken piksel yoğunluğunun kamera ekseni boyunca hangi derinliğe kadar korunduğudur; uygulamada sonuç ışığa, çekim açısına ve video sıkıştırmasına da bağlıdır. Değerler teknik föydeki DORI’den farklı olabilir: üreticiler onu kendi yöntemleriyle hesaplar, burada ise doğrudan IEC 62676-4 yoğunluk eşikleri kullanılır.",
    colLens: "Lens", colFov: "Açı Y × D", colRange: "DORI mesafeleri",
    wide: "geniş uç", tele: "dar uç",
    verifiedNote: "Açılar üreticinin model sayfası ve teknik föyüyle karşılaştırıldı.",
    reviewNote: "Açılar üreticinin tek bir belgesiyle doğrulandı — netleştiriliyor.",
    distortion: "Belirgin distorsiyonlu geniş açılı lens: karenin kenarlarına doğru ayrıntı hesaplanandan düşük.",
    openCalc: "Kendi tesisiniz için hesaplayın",
    units: { mm: "mm", m: "m" },
  },
};

const zh: Pack = {
  catalog: {
    title: "适合此任务的目录摄像机",
    lead: "根据厂家资料中的视场角和分辨率筛选：区域可完整入画，且整个宽度上的像素密度不低于要求。",
    kindAll: "全部", kindFixed: "定焦镜头", kindZoom: "变焦与 PTZ",
    verified: "按厂家资料符合要求",
    review: "可能符合——需核实",
    reviewNote: "视场角仅由一份厂家文件确认，或文件之间存在差异——下单前由工程师确认。",
    empty: "在这些参数下，目录中的摄像机无法同时通过两项检查。请减小区域宽度或距离、选择更低的等级，或提交申请：工程师会提出多台摄像机的布置方案。",
    loading: "正在筛选摄像机…",
    error: "目录暂时无法访问——上方的计算结果仍然有效。请一分钟后再试。",
    scene: "画面内区域 {s}，所需 {w}",
    density: "像素密度 {p}，余量 {r}",
    focal: "焦距 ≈ {f}", focalEst: "估算",
    variant: "{f} 镜头版本", variantHint: "该型号有多个版本——下单时请注明",
    distortion: "广角镜头：画面边缘的细节低于计算值",
    more: "另有 {n} 款符合——工程师会按价格和安装挑选最合适的",
    rejected: "未通过：覆盖 {c} 款，密度 {d} 款，无画面数据 {n} 款",
    add: "加入申请", added: "✓ 已加入", open: "详情", onOrder: "需订货", inStock: "有现货",
    priceFrom: "{v} 苏姆起", priceOnRequest: "价格面议",
    selected: "已选入申请：{n}",
    leadSelected: "已选摄像机",
    lens: { fixed: "定焦", varifocal: "变焦", ptz: "PTZ" },
    analog: "模拟高清——需配 DVR 录像机",
  },
  product: {
    title: "视场角与 DORI 距离",
    lead: "视场角取自该型号的厂家资料。等级距离是指所需像素密度沿摄像机光轴能保持到的深度；实际效果还取决于光照、拍摄角度和视频压缩。数值可能与规格书中的 DORI 不同：厂家按自己的方法计算，此处严格按 IEC 62676-4 的像素密度阈值计算。",
    colLens: "镜头", colFov: "视场角 水平 × 垂直", colRange: "DORI 距离",
    wide: "广角端", tele: "长焦端",
    verifiedNote: "视场角已与厂家型号页面和规格书核对。",
    reviewNote: "视场角仅由一份厂家文件确认，正在核实。",
    distortion: "广角镜头畸变明显：画面边缘的细节低于计算值。",
    openCalc: "为您的项目计算",
    units: { mm: "毫米", m: "米" },
  },
};

export const CATALOG_CONTENT: Record<string, Pack> = { ru, uz, en, tr, zh };
export const catalogContentFor = (locale: string): Pack => CATALOG_CONTENT[locale] ?? ru;
