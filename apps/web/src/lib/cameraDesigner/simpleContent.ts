/**
 * Тексты простого режима калькулятора (редизайн 11.11.2026) — 5 языков.
 * Подстановки: {d} дистанция, {w}/{h} ширина/высота, {p} плотность, {n} нужная плотность,
 * {m} предельная дистанция, {t} задача, {f} объектив, {mp} разрешение, {a} угол, {nx} пиксели.
 * Узбекский — без калек (feedback-uz-no-calques).
 */
import type { SimpleTask } from "./simple";

export type SimpleUi = {
  tabs: { camera: string; pick: string; plan: string };
  lens: string; dist: string; distInput: string; mp: string; mpUnit: string;
  task: string; tasks: Record<SimpleTask, string>; taskHint: Record<SimpleTask, string>;
  custom: string; reset: string;
  adv: string; advHint: string;
  viewCam: string; viewTop: string;
  imitation: string; sensorNote: string;
  frame: string; face: string; outside: string; dragHint: string; person: string; camera: string;
  resWidthT: string; resWidth: string;
  resDetT: string; detOk: string; detNo: string; faceCaveat: string;
  resAdvT: string;
  adv_: { narrower: string; moreMp: string; none: string; wider: string; exact: string; customOk: string; customNo: string };
  more: string; less: string;
  pickWidthHint: string;
};

const ru: SimpleUi = {
  tabs: { camera: "Одна камера", pick: "Подобрать камеру", plan: "План объекта" },
  lens: "Объектив", dist: "Расстояние", distInput: "Расстояние в метрах", mp: "Качество камеры", mpUnit: "Мп",
  task: "Что нужно видеть",
  tasks: { overview: "Общий обзор", actions: "Действия человека", face: "Детали лица" },
  taskHint: {
    overview: "Есть ли человек или машина в кадре",
    actions: "Что делает человек, во что одет",
    face: "Черты лица знакомого человека",
  },
  custom: "Камера задана в разделе «Для специалистов».", reset: "Вернуть простые настройки",
  adv: "Для специалистов", advHint: "Тип объектива, матрица, углы из паспорта, высота и наклон, стандарт IEC 62676-4",
  viewCam: "Вид с камеры", viewTop: "Вид сверху",
  imitation: "Инженерная имитация по расчёту, а не снимок камеры. Настоящая картинка зависит от света, сжатия и модели.",
  sensorNote: "Типовая камера с матрицей 1/2.8\". У реальных камер с тем же объективом угол бывает шире.",
  frame: "Кадр на {d}: {w} × {h}", face: "Лицо: {w} × {h} пикс.",
  outside: "Человек вне кадра — перетащите его в зону обзора или поверните камеру.",
  dragHint: "Перетащите человека или поверните камеру за ручку",
  person: "Человек", camera: "Камера",
  resWidthT: "Ширина обзора", resWidth: "На расстоянии {d} камера охватывает {w} по ширине.",
  resDetT: "Детализация",
  detOk: "Расчётной детализации ({p}) достаточно для задачи «{t}» — до {m}.",
  detNo: "Для задачи «{t}» на {d} детализации мало: {p} при нужных {n}. Её хватает до {m}.",
  faceCaveat: "Это расчётная плотность пикселей, а не гарантия распознавания: важны свет, ракурс лица и сжатие.",
  resAdvT: "Рекомендация",
  adv_: {
    narrower: "Выберите объектив {f}: на {d} он даст {p} и охватит {w} по ширине.",
    moreMp: "Даже объектива 12 мм мало — возьмите камеру {mp} с объективом {f}.",
    none: "На {d} эту задачу лучше решить вариофокальной камерой или поставить камеру ближе.",
    wider: "Есть запас: объектив {f} тоже даст нужную детализацию и охватит {w} по ширине.",
    exact: "Объектив подобран точно: более широкий угол уже не даст нужной детализации на {d}.",
    customOk: "Детализации хватает с запасом — до {m}.",
    customNo: "Нужен угол обзора не шире {a} или разрешение от {nx} пикс. по ширине.",
  },
  more: "Подробнее", less: "Скрыть",
  pickWidthHint: "Сколько метров по ширине должно попасть в кадр на этом расстоянии",
};

const uz: SimpleUi = {
  tabs: { camera: "Bitta kamera", pick: "Kamera tanlash", plan: "Obyekt rejasi" },
  lens: "Obyektiv", dist: "Masofa", distInput: "Masofa, metr", mp: "Kamera sifati", mpUnit: "Mp",
  task: "Nimani koʻrish kerak",
  tasks: { overview: "Umumiy koʻrinish", actions: "Odamning harakatlari", face: "Yuz tafsilotlari" },
  taskHint: {
    overview: "Kadrda odam yoki mashina bormi",
    actions: "Odam nima qilyapti, qanday kiyingan",
    face: "Tanish odamning yuz qiyofasi",
  },
  custom: "Kamera «Mutaxassislar uchun» boʻlimida berilgan.", reset: "Oddiy sozlamalarga qaytish",
  adv: "Mutaxassislar uchun", advHint: "Obyektiv turi, matritsa, pasportdagi burchaklar, balandlik va qiyalik, IEC 62676-4 standarti",
  viewCam: "Kameradan koʻrinish", viewTop: "Yuqoridan koʻrinish",
  imitation: "Bu hisob boʻyicha muhandislik imitatsiyasi, kamera surati emas. Haqiqiy tasvir yorugʻlik, siqish va modelga bogʻliq.",
  sensorNote: "Matritsasi 1/2.8\" boʻlgan oddiy kamera. Xuddi shu obyektivli haqiqiy kameralarda burchak kengroq boʻlishi mumkin.",
  frame: "{d} masofada kadr: {w} × {h}", face: "Yuz: {w} × {h} piksel",
  outside: "Odam kadrdan tashqarida — uni koʻrish zonasiga torting yoki kamerani buring.",
  dragHint: "Odamni torting yoki kamerani dastasidan buring",
  person: "Odam", camera: "Kamera",
  resWidthT: "Koʻrish kengligi", resWidth: "{d} masofada kamera kenglik boʻyicha {w} ni qamraydi.",
  resDetT: "Tafsilot darajasi",
  detOk: "Hisobiy tafsilot ({p}) «{t}» vazifasi uchun yetarli — {m} gacha.",
  detNo: "«{t}» vazifasi uchun {d} masofada tafsilot kam: kerakli {n} oʻrniga {p}. U {m} gacha yetadi.",
  faceCaveat: "Bu piksellarning hisobiy zichligi, tanib olish kafolati emas: yorugʻlik, yuz burchagi va siqish muhim.",
  resAdvT: "Tavsiya",
  adv_: {
    narrower: "{f} obyektivni tanlang: {d} masofada u {p} beradi va kenglik boʻyicha {w} ni qamraydi.",
    moreMp: "12 mm obyektiv ham yetmaydi — {mp} kamerani {f} obyektiv bilan oling.",
    none: "{d} masofada bu vazifani varifokal kamera bilan hal qilgan yoki kamerani yaqinroq qoʻygan maʼqul.",
    wider: "Zaxira bor: {f} obyektiv ham kerakli tafsilotni beradi va kenglik boʻyicha {w} ni qamraydi.",
    exact: "Obyektiv aniq tanlangan: kengroq burchak {d} masofada kerakli tafsilotni bermaydi.",
    customOk: "Tafsilot zaxirasi bilan yetadi — {m} gacha.",
    customNo: "Koʻrish burchagi {a} dan keng boʻlmasligi yoki kenglik boʻyicha {nx} pikseldan ruxsat kerak.",
  },
  more: "Batafsil", less: "Yashirish",
  pickWidthHint: "Shu masofada kadrga kenglik boʻyicha necha metr tushishi kerak",
};

const en: SimpleUi = {
  tabs: { camera: "Single camera", pick: "Find a camera", plan: "Site plan" },
  lens: "Lens", dist: "Distance", distInput: "Distance in metres", mp: "Camera quality", mpUnit: "MP",
  task: "What you need to see",
  tasks: { overview: "General overview", actions: "What a person does", face: "Facial details" },
  taskHint: {
    overview: "Whether a person or a car is in the frame",
    actions: "What a person is doing and wearing",
    face: "The features of a familiar face",
  },
  custom: "The camera is set in the “For specialists” section.", reset: "Back to simple settings",
  adv: "For specialists", advHint: "Lens type, sensor, datasheet angles, mounting height and tilt, IEC 62676-4",
  viewCam: "Camera view", viewTop: "Top view",
  imitation: "An engineering simulation from the calculation, not a camera image. The real picture depends on light, compression and the model.",
  sensorNote: "A typical camera with a 1/2.8\" sensor. Real cameras with the same lens often have a wider angle.",
  frame: "Frame at {d}: {w} × {h}", face: "Face: {w} × {h} px",
  outside: "The person is outside the frame — drag them into view or turn the camera.",
  dragHint: "Drag the person or turn the camera by its handle",
  person: "Person", camera: "Camera",
  resWidthT: "Field width", resWidth: "At {d} the camera covers {w} across.",
  resDetT: "Detail",
  detOk: "The calculated detail ({p}) is enough for “{t}” — up to {m}.",
  detNo: "For “{t}” at {d} the detail is too low: {p} against the {n} needed. It is enough up to {m}.",
  faceCaveat: "This is the calculated pixel density, not a guarantee of recognition: light, face angle and compression matter.",
  resAdvT: "Recommendation",
  adv_: {
    narrower: "Choose a {f} lens: at {d} it gives {p} and covers {w} across.",
    moreMp: "Even a 12 mm lens is not enough — take a {mp} camera with a {f} lens.",
    none: "At {d} this task needs a varifocal camera, or the camera should be placed closer.",
    wider: "There is headroom: a {f} lens also gives the detail needed and covers {w} across.",
    exact: "The lens is a precise fit: a wider angle would no longer give the detail needed at {d}.",
    customOk: "There is enough detail with headroom — up to {m}.",
    customNo: "You need a field of view no wider than {a} or a resolution of at least {nx} px across.",
  },
  more: "Details", less: "Hide",
  pickWidthHint: "How many metres across must fit in the frame at this distance",
};

const tr: SimpleUi = {
  tabs: { camera: "Tek kamera", pick: "Kamera seç", plan: "Tesis planı" },
  lens: "Lens", dist: "Mesafe", distInput: "Metre cinsinden mesafe", mp: "Kamera kalitesi", mpUnit: "MP",
  task: "Ne görmeniz gerekiyor",
  tasks: { overview: "Genel görünüm", actions: "Kişinin hareketleri", face: "Yüz ayrıntıları" },
  taskHint: {
    overview: "Kadrda bir kişi ya da araç var mı",
    actions: "Kişi ne yapıyor, ne giyiyor",
    face: "Tanıdık bir kişinin yüz hatları",
  },
  custom: "Kamera «Uzmanlar için» bölümünde ayarlandı.", reset: "Basit ayarlara dön",
  adv: "Uzmanlar için", advHint: "Lens tipi, sensör, katalog açıları, montaj yüksekliği ve eğim, IEC 62676-4 standardı",
  viewCam: "Kamera görüntüsü", viewTop: "Üstten görünüm",
  imitation: "Hesaba dayalı mühendislik simülasyonu, kamera görüntüsü değildir. Gerçek görüntü ışığa, sıkıştırmaya ve modele bağlıdır.",
  sensorNote: "1/2.8\" sensörlü tipik bir kamera. Aynı lensli gerçek kameralarda açı çoğu zaman daha geniştir.",
  frame: "{d} mesafede kadraj: {w} × {h}", face: "Yüz: {w} × {h} piksel",
  outside: "Kişi kadraj dışında — onu görüş alanına sürükleyin ya da kamerayı çevirin.",
  dragHint: "Kişiyi sürükleyin ya da kamerayı tutamağından çevirin",
  person: "Kişi", camera: "Kamera",
  resWidthT: "Görüş genişliği", resWidth: "{d} mesafede kamera {w} genişliği kapsar.",
  resDetT: "Ayrıntı",
  detOk: "Hesaplanan ayrıntı ({p}) «{t}» için yeterli — {m} mesafeye kadar.",
  detNo: "«{t}» için {d} mesafede ayrıntı az: gereken {n} yerine {p}. {m} mesafeye kadar yeterli.",
  faceCaveat: "Bu, hesaplanan piksel yoğunluğudur, tanıma garantisi değildir: ışık, yüz açısı ve sıkıştırma önemlidir.",
  resAdvT: "Öneri",
  adv_: {
    narrower: "{f} lens seçin: {d} mesafede {p} verir ve {w} genişliği kapsar.",
    moreMp: "12 mm lens bile yetmiyor — {f} lensli {mp} bir kamera seçin.",
    none: "{d} mesafede bu iş için varifokal kamera gerekir ya da kamera daha yakına konmalıdır.",
    wider: "Pay var: {f} lens de gereken ayrıntıyı verir ve {w} genişliği kapsar.",
    exact: "Lens tam uygun: daha geniş açı {d} mesafede gereken ayrıntıyı vermez.",
    customOk: "Ayrıntı payıyla yeterli — {m} mesafeye kadar.",
    customNo: "Görüş açısı {a} değerinden geniş olmamalı ya da genişlikte en az {nx} piksel çözünürlük gerekir.",
  },
  more: "Ayrıntılar", less: "Gizle",
  pickWidthHint: "Bu mesafede kadraja kaç metre genişlik girmeli",
};

const zh: SimpleUi = {
  tabs: { camera: "单个摄像机", pick: "挑选摄像机", plan: "现场平面图" },
  lens: "镜头", dist: "距离", distInput: "距离（米）", mp: "摄像机清晰度", mpUnit: "MP",
  task: "需要看清什么",
  tasks: { overview: "总体概览", actions: "人的动作", face: "面部细节" },
  taskHint: {
    overview: "画面中是否有人或车辆",
    actions: "人在做什么、穿着什么",
    face: "熟人的面部特征",
  },
  custom: "摄像机参数已在“专业设置”中设定。", reset: "恢复简单设置",
  adv: "专业设置", advHint: "镜头类型、传感器、规格书视场角、安装高度与俯角、IEC 62676-4 标准",
  viewCam: "摄像机画面", viewTop: "俯视图",
  imitation: "这是基于计算的工程模拟，不是摄像机实拍。实际画面取决于光线、压缩和具体型号。",
  sensorNote: "典型摄像机，传感器 1/2.8\"。同焦距的实际摄像机视场角往往更宽。",
  frame: "{d} 处画面：{w} × {h}", face: "人脸：{w} × {h} 像素",
  outside: "人在画面之外——把人拖入视野，或转动摄像机。",
  dragHint: "拖动人物，或拖动手柄转动摄像机",
  person: "人", camera: "摄像机",
  resWidthT: "视野宽度", resWidth: "在 {d} 处，摄像机覆盖宽度 {w}。",
  resDetT: "细节程度",
  detOk: "计算细节（{p}）足以完成“{t}”——最远 {m}。",
  detNo: "在 {d} 处，“{t}”所需细节不足：需要 {n}，实际 {p}。最远只到 {m}。",
  faceCaveat: "这是计算得出的像素密度，并不保证能识别：光线、面部角度和压缩都有影响。",
  resAdvT: "建议",
  adv_: {
    narrower: "选择 {f} 镜头：在 {d} 处可达 {p}，覆盖宽度 {w}。",
    moreMp: "即使 12 mm 镜头也不够——请选 {mp} 摄像机配 {f} 镜头。",
    none: "在 {d} 处，此任务需要变焦摄像机，或把摄像机装得更近。",
    wider: "有余量：{f} 镜头同样能达到所需细节，并覆盖宽度 {w}。",
    exact: "镜头恰好合适：更宽的视场角在 {d} 处将达不到所需细节。",
    customOk: "细节充足且有余量——最远 {m}。",
    customNo: "需要视场角不宽于 {a}，或水平分辨率不低于 {nx} 像素。",
  },
  more: "详细", less: "收起",
  pickWidthHint: "在该距离处画面需要覆盖多少米宽",
};

const ALL: Record<string, SimpleUi> = { ru, uz, en, tr, zh };
export const simpleContentFor = (locale: string): SimpleUi => ALL[locale] ?? ru;
