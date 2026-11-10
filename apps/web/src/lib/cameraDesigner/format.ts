/**
 * Числа в интерфейсе SAT Camera Designer (калькулятор и план объекта).
 * Своё форматирование вместо Intl: в Node и в браузере данные локалей (uz, tr) различаются,
 * а разная строка на сервере и клиенте — это ошибка гидратации.
 */
const SEP: Record<string, { dec: string; grp: string }> = {
  // ru/uz: неразрывный пробел (U+00A0) — число не переносится посередине
  ru: { dec: ",", grp: " " }, uz: { dec: ",", grp: " " }, tr: { dec: ",", grp: "." },
  en: { dec: ".", grp: "," }, zh: { dec: ".", grp: "," },
};

export function makeFmt(locale: string) {
  const s = SEP[locale] ?? SEP.ru;
  const num = (n: number, frac?: number) => {
    if (!Number.isFinite(n)) return "∞";
    const a = Math.abs(n);
    const f = frac ?? (a >= 100 ? 0 : a >= 10 ? 1 : 2);
    let [int, dec] = a.toFixed(f).split(".");
    if (int.length > 3) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, s.grp);
    if (dec) dec = dec.replace(/0+$/, "");
    return (n < 0 ? "−" : "") + int + (dec ? s.dec + dec : "");
  };
  return { num, dec: s.dec };
}

export const fill = (tpl: string, v: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
