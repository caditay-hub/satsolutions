"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Вложения онлайн-чата (06.10.2026): голосовые, видео и файлы — в обе стороны.
// Раньше чат сайта понимал только текст и фото: договор PDF, голосовое или видео
// менеджера из Telegram-темы до посетителя не доходили.

export type ChatAttachment = {
  url: string;
  kind: "voice" | "audio" | "video" | "file";
  name: string;
  size: number;
  mime: string;
  duration?: number | null;
};

export function parseAttachment(v: unknown): ChatAttachment | null {
  if (!v || typeof v !== "object") return null;
  const a = v as Record<string, unknown>;
  const kind = String(a.kind || "");
  if (!["voice", "audio", "video", "file"].includes(kind) || typeof a.url !== "string") return null;
  return {
    url: a.url,
    kind: kind as ChatAttachment["kind"],
    name: String(a.name || ""),
    size: Number(a.size) || 0,
    mime: String(a.mime || ""),
    duration: Number(a.duration) > 0 ? Number(a.duration) : null,
  };
}

function fmtDur(s: number | null | undefined) {
  const t = Math.max(0, Math.round(Number(s) || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
function fmtSize(b: number) {
  if (b >= 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1).replace(".0", "")} МБ`;
  return `${Math.max(1, Math.round(b / 1024))} КБ`;
}

/** Полоски «волны» — постоянные для сообщения (от его адреса), закрашиваются по ходу воспроизведения. */
function useBars(seed: string, n = 26) {
  return useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return Array.from({ length: n }, (_, i) => 5 + Math.abs(Math.sin(i * 1.7 + h) * 11 + Math.cos(i * 0.6 + h) * 5));
  }, [seed, n]);
}

function VoicePlayer({ a, mine, labels }: { a: ChatAttachment; mine: boolean; labels: { play: string; pause: string } }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState<number>(a.duration || 0);
  const bars = useBars(a.url);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = Math.min(dur, Math.max(0, ((e.clientX - r.left) / r.width) * dur));
  };
  const frac = dur ? pos / dur : 0;
  return (
    <div className="flex w-[220px] max-w-full items-center gap-2">
      <audio
        ref={ref}
        src={a.url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setPos(0); }}
        onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (Number.isFinite(d) && d > 0) setDur(d); }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? labels.pause : labels.play}
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${mine ? "bg-white text-brand-700" : "bg-brand-600 text-white"}`}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <div className="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-[2px]" onClick={seek} aria-hidden>
        {bars.map((h, i) => {
          const on = i / bars.length < frac;
          const color = mine ? (on ? "bg-white" : "bg-white/45") : on ? "bg-brand-600" : "bg-slate-400";
          return <span key={i} className={`w-[3px] shrink-0 rounded-sm ${color}`} style={{ height: `${h}px` }} />;
        })}
      </div>
      <span className={`shrink-0 text-xs tabular-nums ${mine ? "text-white/90" : "text-slate-600"}`}>{fmtDur(playing || pos ? pos : dur)}</span>
    </div>
  );
}

const EXT_COLOR: Record<string, string> = { pdf: "bg-red-50 text-red-700", doc: "bg-blue-50 text-blue-700", docx: "bg-blue-50 text-blue-700", xls: "bg-emerald-50 text-emerald-700", xlsx: "bg-emerald-50 text-emerald-700", csv: "bg-emerald-50 text-emerald-700" };

export function AttachmentView({ a, mine, labels }: { a: ChatAttachment; mine: boolean; labels: { play: string; pause: string; download: string; video: string } }) {
  if (a.kind === "voice" || a.kind === "audio") return <VoicePlayer a={a} mine={mine} labels={labels} />;
  if (a.kind === "video") {
    return (
      <video src={a.url} controls playsInline preload="metadata" aria-label={labels.video} className="max-h-60 w-full max-w-[260px] rounded-lg bg-black" />
    );
  }
  const ext = (/\.([a-z0-9]{1,5})$/i.exec(a.name || a.url)?.[1] || "file").toLowerCase();
  return (
    <a href={a.url} target="_blank" rel="noopener noreferrer" download={a.name || undefined}
      className={`flex max-w-[260px] items-center gap-3 rounded-xl border p-2.5 ${mine ? "border-white/30 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[11px] font-black uppercase ${mine ? "bg-white/20 text-white" : EXT_COLOR[ext] ?? "bg-slate-100 text-slate-700"}`}>{ext.slice(0, 4)}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{a.name || ext}</span>
        <span className={`block text-xs ${mine ? "text-white/80" : "text-slate-500"}`}>{a.size ? `${fmtSize(a.size)} · ` : ""}{labels.download}</span>
      </span>
    </a>
  );
}

/** Запись голосового в браузере. Chrome пишет webm/opus, Safari — mp4/aac; сервер приводит к m4a и ogg. */
export function useVoiceRecorder(maxSec = 120) {
  const supported = typeof window !== "undefined" && typeof window.MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  const [recording, setRecording] = useState(false);
  const [secs, setSecs] = useState(0);
  const [denied, setDenied] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timer = useRef<number | null>(null);
  const resolveRef = useRef<((b: Blob | null) => void) | null>(null);

  const cleanup = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recRef.current = null;
    setRecording(false);
  };
  useEffect(() => () => cleanup(), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function start() {
    if (!supported || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const type = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"].find((t) => MediaRecorder.isTypeSupported?.(t));
      const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
      chunks.current = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.current.push(e.data); };
      rec.onstop = () => {
        const blob = chunks.current.length ? new Blob(chunks.current, { type: rec.mimeType || type || "audio/webm" }) : null;
        cleanup();
        resolveRef.current?.(blob);
        resolveRef.current = null;
      };
      recRef.current = rec;
      rec.start(250);
      setSecs(0);
      setRecording(true);
      const t0 = Date.now();
      timer.current = window.setInterval(() => {
        const s = Math.floor((Date.now() - t0) / 1000);
        setSecs(s);
        if (s >= maxSec) recRef.current?.stop();
      }, 250);
    } catch {
      setDenied(true);
      cleanup();
    }
  }
  /** Остановить и получить запись (null — если отменили или пусто). */
  function stop(): Promise<Blob | null> {
    const rec = recRef.current;
    if (!rec || rec.state === "inactive") return Promise.resolve(null);
    return new Promise((resolve) => { resolveRef.current = resolve; rec.stop(); });
  }
  function cancel() {
    const rec = recRef.current;
    resolveRef.current = null;
    if (rec && rec.state !== "inactive") { rec.onstop = () => cleanup(); rec.stop(); } else cleanup();
  }
  return { supported, recording, secs, denied, start, stop, cancel, fmt: fmtDur };
}
