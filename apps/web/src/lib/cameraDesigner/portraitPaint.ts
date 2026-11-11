/**
 * Рисунок человека для «что видно камере» — общий для сервера (силуэты уровней, pixelPortrait.ts)
 * и браузера (сцена «Вид с камеры»). Рисунок задан в метрах; растр строится с плотностью камеры
 * (пикс./м): каждый пиксель — среднее по 4 × 4 точкам, как у матрицы. Так дальний человек
 * честно получается из нескольких пикселей, а не уменьшенной картинкой.
 */

export type RGB = [number, number, number];
const SKIN: RGB = [224, 180, 143], SKIN_D: RGB = [196, 150, 116], HAIR: RGB = [58, 42, 32];
const EYE: RGB = [34, 34, 34], LIP: RGB = [156, 79, 79], JACKET: RGB = [47, 111, 138], SHIRT: RGB = [241, 245, 249];
const TROUSERS: RGB = [51, 65, 85], SHOES: RGB = [30, 30, 30];
export const PORTRAIT_BG: RGB = [223, 231, 236];

const inEl = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

/** Голова и плечи в кадре 0,4 × 0,5 м: точка (x от центра, y от верхнего края), м. null — фон. */
export function paintHead(x: number, y: number): RGB | null {
  const ax = Math.abs(x);
  // лицо
  if (inEl(ax, y, 0.035, 0.175, 0.014, 0.007)) return EYE;
  if (y > 0.153 && y < 0.161 && ax > 0.02 && ax < 0.052) return HAIR; // брови
  if (inEl(x, y, 0, 0.24, 0.028, 0.007)) return LIP;
  if (inEl(x, y, 0.004, 0.205, 0.012, 0.024)) return SKIN_D; // нос
  // волосы — над лбом и по бокам головы
  if (inEl(x, y, 0, 0.162, 0.103, 0.13) && (y < 0.125 || (ax > 0.087 && y < 0.17))) return HAIR;
  if (inEl(x, y, 0, 0.18, 0.095, 0.122)) return SKIN;
  if (inEl(ax, y, 0.097, 0.183, 0.013, 0.024)) return SKIN_D; // уши
  // шея
  if (ax < 0.05 && y > 0.28 && y < 0.36) return SKIN;
  // плечи: пиджак, белая рубашка вырезом
  const shoulder = 0.345 + 0.08 * (ax / 0.2) ** 2;
  if (y > shoulder) {
    if (ax < 0.06 - (y - 0.345) * 0.35) return SHIRT;
    return JACKET;
  }
  return null;
}
export const HEAD_FRAME = { w: 0.4, h: 0.5 };

/** Человек ростом 1,75 м в рамке 0,6 × 1,75 м (y от макушки), тот же, что в портрете. null — фон. */
export function paintBody(x: number, y: number): RGB | null {
  const ax = Math.abs(x);
  // голова: портрет в масштабе 1:1, его кадр начинается на 0,05 м выше макушки
  if (y < 0.33) {
    const c = paintHead(x, y + 0.05);
    if (c && c !== JACKET && c !== SHIRT) return c;
  }
  // корпус и руки
  if (y >= 0.28 && y < 0.95) {
    const shoulder = 0.3 + 0.05 * (ax / 0.22) ** 2;
    if (y > shoulder && ax < 0.21) return ax < 0.05 - (y - 0.3) * 0.2 && y < 0.5 ? SHIRT : JACKET;
    // руки вдоль тела, кисти
    if (ax >= 0.21 && ax < 0.27 && y > 0.33) return y > 0.86 ? SKIN : JACKET;
  }
  // ноги с просветом между ними, обувь
  if (y >= 0.95 && y <= 1.75) {
    if (ax < 0.02 && y > 1.0) return null;
    if (ax < 0.17 - (y - 0.95) * 0.05) return y > 1.69 ? SHOES : TROUSERS;
  }
  return null;
}
export const BODY_FRAME = { w: 0.6, h: 1.75 };

/**
 * Растр RGBA w × h пикселей рисунка paint в рамке frameW × frameH метров; фон — прозрачный
 * (или bg, если задан). Пиксель = среднее 4 × 4 точек; доля фона идёт в прозрачность.
 */
export function rasterize(paint: (x: number, y: number) => RGB | null, frameW: number, frameH: number, w: number, h: number, bg?: RGB): Uint8ClampedArray {
  const SS = 4;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let sj = 0; sj < SS; sj++) for (let si = 0; si < SS; si++) {
        const x = ((i + (si + 0.5) / SS) / w - 0.5) * frameW;
        const y = ((j + (sj + 0.5) / SS) / h) * frameH;
        const c = paint(x, y) ?? bg ?? null;
        if (!c) continue;
        r += c[0]; g += c[1]; b += c[2]; n++;
      }
      const o = (j * w + i) * 4;
      if (n) { out[o] = Math.round(r / n); out[o + 1] = Math.round(g / n); out[o + 2] = Math.round(b / n); }
      out[o + 3] = Math.round((n / (SS * SS)) * 255);
    }
  }
  return out;
}
