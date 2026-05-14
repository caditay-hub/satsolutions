"use client";

import { useMemo, useState } from "react";

export type CharacteristicRow = { key: string; value: string };

function splitOnce(line: string): { key: string; value: string } | null {
  const raw = line.trim();
  if (!raw) return null;

  // Prefer tab-delimited (copy/paste from tables/Excel).
  if (raw.includes("\t")) {
    const [k, ...rest] = raw.split("\t");
    const key = (k ?? "").trim();
    const value = rest.join("\t").trim();
    if (!key && !value) return null;
    return { key, value };
  }

  // Next, split on 2+ spaces (common in copied text tables).
  const m = raw.match(/\s{2,}/);
  if (m && m.index !== undefined) {
    const key = raw.slice(0, m.index).trim();
    const value = raw.slice(m.index + m[0].length).trim();
    if (!key && !value) return null;
    return { key, value };
  }

  // Finally, allow "Key: Value" for manual lists.
  const ci = raw.indexOf(":");
  if (ci > 0) {
    const key = raw.slice(0, ci).trim();
    const value = raw.slice(ci + 1).trim();
    if (!key && !value) return null;
    return { key, value };
  }

  return { key: raw, value: "" };
}

function parseBulk(text: string): CharacteristicRow[] {
  const lines = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const rows: CharacteristicRow[] = [];
  for (const line of lines) {
    const kv = splitOnce(line);
    if (!kv) continue;
    rows.push({ key: kv.key, value: kv.value });
  }
  return rows;
}

export function CharacteristicsEditor({
  rows,
  onChange
}: {
  rows: CharacteristicRow[];
  onChange: (rows: CharacteristicRow[]) => void;
}) {
  const [bulk, setBulk] = useState("");

  const bulkParsed = useMemo(() => parseBulk(bulk), [bulk]);

  function applyBulk() {
    const parsed = bulkParsed;
    if (!parsed.length) return;

    const cleaned = rows.filter((x) => (x.key ?? "").trim() || (x.value ?? "").trim());
    const base = cleaned.length ? cleaned : [];
    onChange([...base, ...parsed]);
    setBulk("");
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-semibold text-slate-900">Быстрая вставка</div>
        <div className="mt-1 text-xs text-slate-600">
          Вставьте список характеристик (каждая строка — новая характеристика). Разделители: <span className="font-semibold">TAB</span>,{" "}
          <span className="font-semibold">2+ пробела</span> или <span className="font-semibold">“ключ: значение”</span>.
        </div>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder={
            "Model\tHikvision DS-2SE3C404MWG-E/14 2.8mm\nResolution\t4 MP (2560x1440 pixels)\nField of View\tHorizontal angle: 96°"
          }
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          rows={4}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-600">Найдено строк: {bulkParsed.length}</div>
          <button
            type="button"
            disabled={!bulkParsed.length}
            onClick={applyBulk}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            Добавить в характеристики
          </button>
        </div>
      </div>

      {rows.map((r, idx) => (
        <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          <input
            className="sm:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Напр.: Разрешение"
            value={r.key}
            onPaste={(e) => {
              const text = e.clipboardData?.getData("text/plain") ?? "";
              // Only intercept multi-line or table-like pastes
              if (!text.includes("\n") && !text.includes("\r") && !text.includes("\t")) return;
              const parsed = parseBulk(text);
              if (!parsed.length) return;
              e.preventDefault();

              const next = rows.slice();
              // replace current row with first parsed pair, then insert the rest
              next[idx] = parsed[0];
              next.splice(idx + 1, 0, ...parsed.slice(1));
              // remove fully empty rows
              onChange(next.filter((x) => (x.key ?? "").trim() || (x.value ?? "").trim()));
            }}
            onChange={(e) => {
              const next = rows.slice();
              next[idx] = { ...r, key: e.target.value };
              onChange(next);
            }}
          />
          <input
            className="sm:col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Напр.: 4 Мп"
            value={r.value}
            onPaste={(e) => {
              const text = e.clipboardData?.getData("text/plain") ?? "";
              if (!text.includes("\n") && !text.includes("\r") && !text.includes("\t")) return;
              const parsed = parseBulk(text);
              if (!parsed.length) return;
              e.preventDefault();

              const next = rows.slice();
              next[idx] = parsed[0];
              next.splice(idx + 1, 0, ...parsed.slice(1));
              onChange(next.filter((x) => (x.key ?? "").trim() || (x.value ?? "").trim()));
            }}
            onChange={(e) => {
              const next = rows.slice();
              next[idx] = { ...r, value: e.target.value };
              onChange(next);
            }}
          />
          <div className="sm:col-span-5">
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, i) => i !== idx))}
              className="text-xs font-semibold text-red-700 hover:underline"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { key: "", value: "" }])}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
      >
        Добавить характеристику
      </button>
    </div>
  );
}

