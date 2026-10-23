"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------- color helpers ---------- */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (mx + mn) / 2;
  const d = mx - mn;
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    switch (mx) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return [h, s, l];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

export const isHex = (v: string) => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

/* ---------- misc helpers ---------- */
export function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function downloadCanvas(c: HTMLCanvasElement, filename: string, type = "image/png", quality?: number) {
  c.toBlob((b) => {
    if (!b) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }, type, quality);
}

export async function copyText(t: string) {
  try { await navigator.clipboard.writeText(t); return true; } catch { return false; }
}

/* ---------- image loading hook ---------- */
export function useImage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [bytes, setBytes] = useState(0);
  const urlRef = useRef<string | null>(null);

  const load = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(f);
    urlRef.current = url;
    const im = new Image();
    im.onload = () => {
      setImg(im);
      setName(f.name.replace(/\.[^.]+$/, "") || "image");
      setBytes(f.size);
    };
    im.src = url;
  }, []);

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);
  return { img, name, bytes, load };
}

/* ---------- UI primitives ---------- */
export function Dropzone({ onFile, label = "اسحب الصورة هنا أو اضغط للاختيار", accept = "image/*" }: { onFile: (f: File) => void; label?: string; accept?: string }) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={"tl-drop" + (over ? " over" : "")}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
    >
      <div style={{ fontSize: 28 }}>⬆</div>
      <div>{label}</div>
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="tl-field"><div className="tl-lab">{label}</div>{children}</div>;
}

export function Range({ label, value, min, max, step = 1, onChange, unit = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="tl-field">
      <div className="tl-row"><span>{label}</span><b>{value}{unit}</b></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="tl-seg">
      {options.map((o) => (
        <button key={String(o.v)} type="button" className={o.v === value ? "on" : ""} onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

export function CopyBtn({ text, label = "نسخ" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="tl-btn sec" onClick={async () => { await copyText(text); setOk(true); setTimeout(() => setOk(false), 1200); }}>
      {ok ? "✓ تم" : label}
    </button>
  );
}

export function Empty({ text = "ارفع صورة لتبدأ" }: { text?: string }) {
  return <div className="tl-empty"><div style={{ fontSize: 40 }}>🖼️</div>{text}</div>;
}

export function ToolShell({ controls, children }: { controls: ReactNode; children: ReactNode }) {
  return (
    <div className="tl-shell">
      <div className="tl-panel">{controls}</div>
      <div className="tl-panel tl-stage">{children}</div>
    </div>
  );
}
