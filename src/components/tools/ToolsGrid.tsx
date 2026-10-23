"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { categories } from "@/lib/tools";
import type { ToolMeta } from "@/lib/tools";

export function ToolsGrid({ tools }: { tools: ToolMeta[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return tools.filter((t) => (cat === "all" || t.category === cat) && (!s || (t.title + " " + t.desc).toLowerCase().includes(s)));
  }, [tools, q, cat]);

  return (
    <>
      <div className="tl-bar">
        <input className="tl-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن أداة…" />
        <div className="tl-chips">
          {categories.map((c) => (
            <button key={c.id} type="button" className={"tl-chip" + (cat === c.id ? " on" : "")} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>
      </div>
      {list.length ? (
        <div className="tl-grid">
          {list.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="tl-card">
              <div className="tl-ic">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="tl-none">لا توجد أداة بهذا الاسم</div>
      )}
    </>
  );
}
