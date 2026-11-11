/**
 * «Что видно на уровне детализации» (страница проектировщика, 11.11): один и тот же человек —
 * голова и плечи в кадре 0,4 × 0,5 м — отрисованный с плотностью уровня (пикс./м). При 25 пикс./м
 * это 10 пикселей по ширине, при 250 — 100. Каждый пиксель — среднее по 4 × 4 точкам рисунка,
 * как у матрицы камеры. Картинка — маленький PNG (data URI); на странице её увеличивают с
 * image-rendering: pixelated, чтобы пиксели было видно.
 */
import { deflateSync } from "node:zlib";
import { HEAD_FRAME, PORTRAIT_BG, paintHead, rasterize } from "./portraitPaint";

const FRAME_W = HEAD_FRAME.w; // м
const FRAME_H = HEAD_FRAME.h; // м

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
  // рисунок — общий со сценой «Вид с камеры» (portraitPaint.ts); PNG — RGB без прозрачности
  const rgba = rasterize(paintHead, FRAME_W, FRAME_H, w, h, PORTRAIT_BG);
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let j = 0; j < h; j++) {
    raw[j * (w * 3 + 1)] = 0; // фильтр строки: нет
    for (let i = 0; i < w; i++) {
      const o = j * (w * 3 + 1) + 1 + i * 3, q = (j * w + i) * 4;
      raw[o] = rgba[q]; raw[o + 1] = rgba[q + 1]; raw[o + 2] = rgba[q + 2];
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
