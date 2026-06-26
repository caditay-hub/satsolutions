import { routing } from "@/i18n/routing";

// Перевод названий ГРУПП характеристик в фильтре (ключи берутся из БД на русском).
// Ключ = русское имя характеристики, RU — исходник/фолбэк. Значения характеристик
// (H.265, IP66, 2 MP) языко-нейтральны и не переводятся.
type Loc = { uz: string; en: string; tr: string; zh: string };

const CHAR_KEYS: Record<string, Loc> = {
  "Питание": { uz: "Quvvat", en: "Power", tr: "Güç", zh: "供电" },
  "Разрешение": { uz: "Ruxsat (piksel)", en: "Resolution", tr: "Çözünürlük", zh: "分辨率" },
  "Кодеки": { uz: "Kodeklar", en: "Codecs", tr: "Kodekler", zh: "编解码" },
  "Защита": { uz: "Himoya", en: "Protection", tr: "Koruma", zh: "防护" },
  "Интерфейсы": { uz: "Interfeyslar", en: "Interfaces", tr: "Arayüzler", zh: "接口" },
  "Тип": { uz: "Turi", en: "Type", tr: "Tip", zh: "类型" },
  "Функции": { uz: "Funksiyalar", en: "Features", tr: "Özellikler", zh: "功能" },
  "Материал": { uz: "Material", en: "Material", tr: "Malzeme", zh: "材质" },
  "Безопасность": { uz: "Xavfsizlik", en: "Security", tr: "Güvenlik", zh: "安全" },
  "Длина": { uz: "Uzunlik", en: "Length", tr: "Uzunluk", zh: "长度" },
  "Зум": { uz: "Zum", en: "Zoom", tr: "Zoom", zh: "变焦" },
  "ИК-подсветка": { uz: "IQ yoritish", en: "IR illumination", tr: "IR aydınlatma", zh: "红外照明" },
  "Корпус": { uz: "Korpus", en: "Housing", tr: "Kasa", zh: "外壳" },
  "Объектив": { uz: "Obyektiv", en: "Lens", tr: "Lens", zh: "镜头" },
  "Управление": { uz: "Boshqaruv", en: "Management", tr: "Yönetim", zh: "管理" },
  "Экран": { uz: "Ekran", en: "Display", tr: "Ekran", zh: "屏幕" },
  "VPN": { uz: "VPN", en: "VPN", tr: "VPN", zh: "VPN" },
  "Wi-Fi": { uz: "Wi-Fi", en: "Wi-Fi", tr: "Wi-Fi", zh: "Wi-Fi" },
  "Антенны": { uz: "Antennalar", en: "Antennas", tr: "Antenler", zh: "天线" },
  "Беспроводная связь": { uz: "Simsiz aloqa", en: "Wireless", tr: "Kablosuz bağlantı", zh: "无线连接" },
  "Видеоулучшение": { uz: "Video yaxshilash", en: "Video enhancement", tr: "Video iyileştirme", zh: "图像增强" },
  "Входы": { uz: "Kirishlar", en: "Inputs", tr: "Girişler", zh: "输入" },
  "Дальность PoE": { uz: "PoE masofasi", en: "PoE range", tr: "PoE menzili", zh: "PoE 距离" },
  "Диапазон": { uz: "Diapazon", en: "Band", tr: "Bant", zh: "频段" },
  "Единица": { uz: "Birlik", en: "Unit", tr: "Birim", zh: "单位" },
  "Емкость карт": { uz: "Karta sig'imi", en: "Card capacity", tr: "Kart kapasitesi", zh: "卡容量" },
  "Жилы": { uz: "Tomirlar", en: "Conductors", tr: "İletkenler", zh: "线芯" },
  "ИК-датчики": { uz: "IQ datchiklar", en: "IR sensors", tr: "IR sensörler", zh: "红外传感器" },
  "Кабель": { uz: "Kabel", en: "Cable", tr: "Kablo", zh: "线缆" },
  "Камера": { uz: "Kamera", en: "Camera", tr: "Kamera", zh: "摄像头" },
  "Каналы": { uz: "Kanallar", en: "Channels", tr: "Kanallar", zh: "通道" },
  "Карта памяти": { uz: "Xotira kartasi", en: "Memory card", tr: "Hafıza kartı", zh: "存储卡" },
  "Категория": { uz: "Kategoriya", en: "Category", tr: "Kategori", zh: "类别" },
  "Класс защиты": { uz: "Himoya klassi", en: "Protection class", tr: "Koruma sınıfı", zh: "防护等级" },
  "Методы идентификации": { uz: "Identifikatsiya usullari", en: "Identification methods", tr: "Kimlik doğrulama yöntemleri", zh: "识别方式" },
  "Ночное видение": { uz: "Tungi ko'rish", en: "Night vision", tr: "Gece görüşü", zh: "夜视" },
  "Полки": { uz: "Tokchalar", en: "Shelves", tr: "Raflar", zh: "层板" },
  "Применение": { uz: "Qo'llanilishi", en: "Application", tr: "Uygulama", zh: "应用" },
  "Пропускная способность": { uz: "O'tkazuvchanlik", en: "Throughput", tr: "Veri hızı", zh: "吞吐量" },
  "Протоколы": { uz: "Protokollar", en: "Protocols", tr: "Protokoller", zh: "协议" },
  "Протоколы L2": { uz: "L2 protokollar", en: "L2 protocols", tr: "L2 protokoller", zh: "L2 协议" },
  "Сечение": { uz: "Kesim", en: "Cross-section", tr: "Kesit", zh: "截面" },
  "Сигнализация": { uz: "Signalizatsiya", en: "Alarm", tr: "Alarm", zh: "报警" },
  "Система": { uz: "Tizim", en: "System", tr: "Sistem", zh: "系统" },
  "Скорость": { uz: "Tezlik", en: "Speed", tr: "Hız", zh: "速率" },
  "Совместимость": { uz: "Moslik", en: "Compatibility", tr: "Uyumluluk", zh: "兼容性" },
  "Стандарт PoE": { uz: "PoE standarti", en: "PoE standard", tr: "PoE standardı", zh: "PoE 标准" },
  "Стандарт Wi-Fi": { uz: "Wi-Fi standarti", en: "Wi-Fi standard", tr: "Wi-Fi standardı", zh: "Wi-Fi 标准" },
  "Технология": { uz: "Texnologiya", en: "Technology", tr: "Teknoloji", zh: "技术" },
  "Тип монтажа": { uz: "O'rnatish turi", en: "Mounting type", tr: "Montaj tipi", zh: "安装方式" },
  "Типы дверей": { uz: "Eshik turlari", en: "Door types", tr: "Kapı tipleri", zh: "门类型" },
  "Угол обзора": { uz: "Ko'rish burchagi", en: "Field of view", tr: "Görüş açısı", zh: "视场角" },
  "Угол обнаружения": { uz: "Aniqlash burchagi", en: "Detection angle", tr: "Algılama açısı", zh: "探测角度" },
  "Хранилище": { uz: "Saqlash", en: "Storage", tr: "Depolama", zh: "存储" },
  "Цвет": { uz: "Rang", en: "Color", tr: "Renk", zh: "颜色" },
};

/** Локализованное имя группы характеристик (фолбэк на русское). */
export function localizeCharKey(key: string, locale: string): string {
  if (!key || locale === routing.defaultLocale) return key;
  const e = CHAR_KEYS[key];
  if (!e) return key;
  return (e as Record<string, string>)[locale]?.trim() || key;
}
