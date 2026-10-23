"use client";
import { useState } from "react";
export function DownloadButton({id,kind,kinds,label}:{id:string;kind?:"avatar"|"banner"|"image";kinds?:string[];label:string}) {
  const [sent, setSent] = useState(false);
  async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
  async function download() {
    try {
      const targets = kinds && kinds.length ? kinds : kind ? [kind] : [];
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const r = await fetch(`/api/content/${id}/download-file?kind=${t}`);
        if (!r.ok) throw new Error("تعذر التحميل");
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${t}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        if (i < targets.length - 1) await sleep(800);
      }
      setSent(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "تعذر التحميل");
    }
  }
  return (
    <>
      <button className="btn" onClick={download}>{label}</button>
      {sent && (
        <div className="tick-overlay">
          <div className="tick-box">
            <div className="tick">✔</div>
            <p>تم التحميل بنجاح</p>
            <button className="btn secondary" onClick={() => setSent(false)}>حسناً</button>
          </div>
        </div>
      )}
    </>
  );
}
