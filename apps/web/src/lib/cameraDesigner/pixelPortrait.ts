/**
 * «Что видно на уровне детализации» (страница проектировщика, 11.11): один и тот же человек —
 * голова и плечи в кадре 0,4 × 0,5 м — отрисованный с плотностью уровня (пикс./м). При 25 пикс./м
 * это 10 пикселей по ширине, при 250 — 100. Каждый пиксель — среднее по 4 × 4 точкам рисунка,
 * как у матрицы камеры. Картинка — маленький PNG (data URI); на странице её увеличивают с
 * image-rendering: pixelated, чтобы пиксели было видно.
 */
import { deflateSync } from "node:zlib";

const FRAME_W = 0.4; // м
const FRAME_H = 0.5; // м

type RGB = [number, number, number];
const BG: RGB = [223, 231, 236], SKIN: RGB = [224, 180, 143], SKIN_D: RGB = [196, 150, 116], HAIR: RGB = [58, 42, 32];
const EYE: RGB = [34, 34, 34], LIP: RGB = [156, 79, 79], JACKET: RGB = [47, 111, 138], SHIRT: RGB = [241, 245, 249];

const inEl = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

/** Цвет рисунка в точке (м от верхнего края, x — от центра кадра). Порядок проверок = порядок слоёв сверху вниз. */
function paint(x: number, y: number): RGB {
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
  return BG;
}

let crcTable: Uint32Array | null = null;
function crc32(buf: Buffer) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[n] = c >>> 0; }
  }
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** Размер картинки в пикселях для плотности уровня. */
export const portraitSize = (ppm: number) => ({ w: Math.max(4, Math.round(FRAME_W * ppm)), h: Math.max(5, Math.round(FRAME_H * ppm)) });

const memo = new Map<number, string>();
/** PNG (data URI) портрета при плотности ppm пикселей на метр. */
export function portraitPng(ppm: number): string {
  const hit = memo.get(ppm);
  if (hit) return hit;
  const { w, h } = portraitSize(ppm);
  const SS = 4; // точек на пиксель по каждой оси
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let j = 0; j < h; j++) {
    raw[j * (w * 3 + 1)] = 0; // фильтр строки: нет
    for (let i = 0; i < w; i++) {
      let r = 0, g = 0, b = 0;
      for (let sj = 0; sj < SS; sj++) for (let si = 0; si < SS; si++) {
        const x = ((i + (si + 0.5) / SS) / w - 0.5) * FRAME_W;
        const y = ((j + (sj + 0.5) / SS) / h) * FRAME_H;
        const c = paint(x, y);
        r += c[0]; g += c[1]; b += c[2];
      }
      const o = j * (w * 3 + 1) + 1 + i * 3, k = SS * SS;
      raw[o] = Math.round(r / k); raw[o + 1] = Math.round(g / k); raw[o + 2] = Math.round(b / k);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8 бит, RGB
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
  ]);
  const uri = `data:image/png;base64,${png.toString("base64")}`;
  memo.set(ppm, uri);
  return uri;
}
