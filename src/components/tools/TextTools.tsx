"use client";
import { useEffect, useRef, useState } from "react";
import { CopyBtn, Field, ToolShell } from "./ui";

/* =============== Fancy text =============== */
const conv = (text: string, up: number | null, low: number | null, dig: number | null, ex: Record<string, string> = {}) =>
  [...text]
    .map((ch) => {
      if (ex[ch]) return ex[ch];
      const c = ch.codePointAt(0)!;
      if (up !== null && c >= 65 && c <= 90) return String.fromCodePoint(up + c - 65);
      if (low !== null && c >= 97 && c <= 122) return String.fromCodePoint(low + c - 97);
      if (dig !== null && c >= 48 && c <= 57) return String.fromCodePoint(dig + c - 48);
      return ch;
    })
    .join("");

const SMALL = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ";
const CIRC_DIGITS: Record<string, string> = { "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨" };

const STYLES: { n: string; f: (t: string) => string }[] = [
  { n: "عريض", f: (t) => conv(t, 0x1d400, 0x1d41a, 0x1d7ce) },
  { n: "مائل", f: (t) => conv(t, 0x1d434, 0x1d44e, null, { h: "ℎ" }) },
  { n: "عريض مائل", f: (t) => conv(t, 0x1d468, 0x1d482, null) },
  { n: "خط يد", f: (t) => conv(t, 0x1d4d0, 0x1d4ea, null) },
  { n: "قوطي", f: (t) => conv(t, 0x1d56c, 0x1d586, null) },
  { n: "مزدوج", f: (t) => conv(t, 0x1d538, 0x1d552, 0x1d7d8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" }) },
  { n: "سانس", f: (t) => conv(t, 0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { n: "سانس عريض", f: (t) => conv(t, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { n: "سانس مائل", f: (t) => conv(t, 0x1d608, 0x1d622, null) },
  { n: "أحادي المسافة", f: (t) => conv(t, 0x1d670, 0x1d68a, 0x1d7f6) },
  { n: "دوائر", f: (t) => conv(t, 0x24b6, 0x24d0, null, CIRC_DIGITS) },
  { n: "مربعات", f: (t) => conv(t.toUpperCase(), 0x1f130, null, null) },
  { n: "عريض كامل", f: (t) => conv(t, 0xff21, 0xff41, 0xff10) },
  { n: "أحرف صغيرة", f: (t) => [...t.toLowerCase()].map((c) => (c >= "a" && c <= "z" ? SMALL[c.charCodeAt(0) - 97] : c)).join("") },
  { n: "يتوسطه خط", f: (t) => [...t].map((c) => c + "̶").join("") },
  { n: "تحته خط", f: (t) => [...t].map((c) => c + "̲").join("") },
];

const DECOS = ["꧁ T ꧂", "✦ T ✦", "⟡ T ⟡", "｡･:*:･ﾟ★ T ★ﾟ･:*:･｡", "˚ ༘ ⋆｡˚ T ˚｡⋆ ༘ ˚", "『 T 』", "┊ T ┊", "彡 T 彡", "♡ T ♡", "☾ T ☽"];

export function FancyText() {
  const [text, setText] = useState("Kelvin");
  const t = text || "Kelvin";
  return (
    <ToolShell
      controls={
        <>
          <Field label="النص (حروف إنجليزية)">
            <input className="tl-in" style={{ direction: "ltr" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب اسمك هنا" />
          </Field>
          <div className="tl-note">الزخرفة تعمل على الأحرف والأرقام الإنجليزية فقط، والحروف العربية تبقى كما هي. ديسكورد يعرض هذه الرموز في الأسماء والرسائل.</div>
        </>
      }
    >
      <div className="tl-list">
        {STYLES.map((s) => {
          const v = s.f(t);
          return (
            <div className="tl-item" key={s.n}>
              <div><small>{s.n}</small><code style={{ fontSize: 18 }}>{v}</code></div>
              <CopyBtn text={v} />
            </div>
          );
        })}
        {DECOS.map((d) => {
          const v = d.replace("T", t);
          return (
            <div className="tl-item" key={d}>
              <div><small>زخرفة</small><code style={{ fontSize: 18 }}>{v}</code></div>
              <CopyBtn text={v} />
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}

/* =============== Discord markdown formatter =============== */
function render(src: string) {
  const store: string[] = [];
  let t = src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  t = t.replace(/```([\s\S]*?)```/g, (_, c: string) => { store.push(`<pre>${c.replace(/^\n/, "")}</pre>`); return `\u0000${store.length - 1}\u0000`; });
  t = t.replace(/`([^`\n]+)`/g, (_, c: string) => { store.push(`<code>${c}</code>`); return `\u0000${store.length - 1}\u0000`; });
  t = t
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/__([^_]+)__/g, "<u>$1</u>")
    .replace(/~~([^~]+)~~/g, "<s>$1</s>")
    .replace(/\|\|([^|]+)\|\|/g, '<span class="tl-spoiler">$1</span>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
  t = t
    .split("\n")
    .map((l) => {
      if (l.startsWith("&gt; ")) return `<div class="tl-quote">${l.slice(5)}</div>`;
      if (l.startsWith("-# ")) return `<small>${l.slice(3)}</small>`;
      const m = l.match(/^(#{1,3}) (.*)$/);
      if (m) return `<div class="tl-h${m[1].length}">${m[2]}</div>`;
      return l + "<br/>";
    })
    .join("");
  return t.replace(/\u0000(\d+)\u0000/g, (_, i: string) => store[+i]);
}

export function FormatterTool() {
  const [text, setText] = useState("# أهلاً بك\nهذا نص **عريض** و *مائل* و __مسطّر__ و ||مخفي||\n> اقتباس\n-# نص صغير\n`كود`");
  const ta = useRef<HTMLTextAreaElement>(null);

  const wrap = (l: string, r = l) => {
    const el = ta.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    setText(text.slice(0, s) + l + text.slice(s, e) + r + text.slice(e));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + l.length, e + l.length); });
  };
  const prefix = (p: string) => {
    const el = ta.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    const ls = text.lastIndexOf("\n", s - 1) + 1;
    let le = text.indexOf("\n", e);
    if (le === -1) le = text.length;
    const block = text.slice(ls, le).split("\n").map((x) => p + x).join("\n");
    setText(text.slice(0, ls) + block + text.slice(le));
    requestAnimationFrame(() => el.focus());
  };

  const btns: [string, () => void][] = [
    ["عريض", () => wrap("**")], ["مائل", () => wrap("*")], ["مسطّر", () => wrap("__")], ["يتوسطه خط", () => wrap("~~")],
    ["سبويلر", () => wrap("||")], ["كود", () => wrap("`")], ["بلوك كود", () => wrap("```\n", "\n```")],
    ["اقتباس", () => prefix("> ")], ["عنوان", () => prefix("# ")], ["عنوان فرعي", () => prefix("## ")], ["نص صغير", () => prefix("-# ")],
  ];

  return (
    <ToolShell
      controls={
        <>
          <Field label="اكتب نصك ثم حدّد الجزء وطبّق التنسيق">
            <textarea ref={ta} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="tl-flex" style={{ marginTop: 12 }}>
            {btns.map(([l, f]) => (
              <button key={l} type="button" className="tl-btn sec" style={{ padding: "8px 14px" }} onClick={f}>{l}</button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}><CopyBtn text={text} label="نسخ النص" /></div>
        </>
      }
    >
      <div className="tl-lab" style={{ alignSelf: "flex-start" }}>المعاينة</div>
      <div className="tl-preview" dangerouslySetInnerHTML={{ __html: render(text) }} />
    </ToolShell>
  );
}

/* =============== Timestamp generator =============== */
const pad = (n: number) => String(n).padStart(2, "0");

function relative(ts: number) {
  const diff = ts - Date.now();
  const rtf = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536e6], ["month", 2592e6], ["day", 864e5], ["hour", 36e5], ["minute", 6e4], ["second", 1e3]];
  for (const [u, ms] of units) if (Math.abs(diff) >= ms || u === "second") return rtf.format(Math.round(diff / ms), u);
  return "";
}

export function TimestampTool() {
  const [v, setV] = useState("");
  useEffect(() => {
    const d = new Date();
    setV(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
  }, []);

  const date = v ? new Date(v) : null;
  const valid = date && !isNaN(date.getTime());
  const unix = valid ? Math.floor(date!.getTime() / 1000) : 0;
  const L = "ar";
  const rows: [string, string, string][] = valid
    ? [
        ["t", "وقت قصير", date!.toLocaleTimeString(L, { hour: "numeric", minute: "2-digit" })],
        ["T", "وقت كامل", date!.toLocaleTimeString(L, { timeStyle: "medium" })],
        ["d", "تاريخ قصير", date!.toLocaleDateString(L, { day: "2-digit", month: "2-digit", year: "numeric" })],
        ["D", "تاريخ طويل", date!.toLocaleDateString(L, { dateStyle: "long" })],
        ["f", "تاريخ ووقت", date!.toLocaleString(L, { dateStyle: "long", timeStyle: "short" })],
        ["F", "تاريخ ووقت مع اليوم", date!.toLocaleString(L, { dateStyle: "full", timeStyle: "short" })],
        ["R", "نسبي", relative(unix * 1000)],
      ]
    : [];

  return (
    <ToolShell
      controls={
        <>
          <Field label="اختر التاريخ والوقت">
            <input className="tl-in" type="datetime-local" value={v} onChange={(e) => setV(e.target.value)} />
          </Field>
          {valid && (
            <div className="tl-note">
              الطابع الزمني (Unix): <b style={{ direction: "ltr", display: "inline-block" }}>{unix}</b>
            </div>
          )}
          <div className="tl-note">يظهر هذا التوقيت لكل شخص حسب منطقته الزمنية. الصق الكود في أي رسالة على ديسكورد.</div>
        </>
      }
    >
      {!valid ? (
        <div className="tl-empty">اختر تاريخاً صحيحاً</div>
      ) : (
        <div className="tl-list">
          {rows.map(([f, name, ex]) => {
            const code = `<t:${unix}:${f}>`;
            return (
              <div className="tl-item" key={f}>
                <div><small>{name}</small><b>{ex}</b><br /><code>{code}</code></div>
                <CopyBtn text={code} />
              </div>
            );
          })}
        </div>
      )}
    </ToolShell>
  );
}

export function SnowflakeTool() {
  const [v, setV] = useState("");
  const id = v.trim();
  const valid = /^\d{17,20}$/.test(id);
  const ts = valid ? Number((BigInt(id) >> BigInt(22)) + BigInt(1420070400000)) : 0;
  const date = valid ? new Date(ts) : null;
  return (
    <ToolShell controls={<><Field label="Discord Snowflake ID"><input className="tl-in" style={{direction:"ltr"}} value={v} onChange={(e)=>setV(e.target.value)} placeholder="123456789012345678" /></Field></>}>
      {!valid ? <div className="tl-empty">أدخل snowflake id صحيح</div> :
      <div className="tl-list"><div className="tl-item"><div><small>تاريخ الإنشاء</small><b>{date!.toLocaleString("ar")}</b><br/><code>{date!.toISOString()}</code></div><CopyBtn text={date!.toISOString()} /></div>
      <div className="tl-item"><div><small>Unix (s)</small><b>{Math.floor(ts/1000)}</b></div><CopyBtn text={String(Math.floor(ts/1000))} /></div></div>}
    </ToolShell>
  );
}

export function DiscordInviteTool() {
  const [code, setCode] = useState("");
  const out = code ? `https://discord.gg/${code}` : "";
  return (
    <ToolShell controls={<><Field label="كود الدعوة"><input className="tl-in" style={{direction:"ltr"}} value={code} onChange={(e)=>setCode(e.target.value)} placeholder="abc123" /></Field><CopyBtn text={out} label="نسخ الرابط" /></>}>
      <div className="tl-empty"><code style={{fontSize:18}}>{out || "—"}</code></div>
    </ToolShell>
  );
}

export function DiscordMentionTool() {
  const [id, setId] = useState("");
  const [type, setType] = useState("user");
  const out = type === "user" ? `<@${id}>` : type === "role" ? `<@&${id}>` : `<#${id}>`;
  return (
    <ToolShell controls={<><Field label="ID"><input className="tl-in" style={{direction:"ltr"}} value={id} onChange={(e)=>setId(e.target.value)} /></Field><Field label="النوع"><select className="tl-in" value={type} onChange={(e)=>setType(e.target.value)}><option value="user">مستخدم</option><option value="role">رتبة</option><option value="channel">قناة</option></select></Field><CopyBtn text={out} label="نسخ" /></>}>
      <div className="tl-empty"><code style={{fontSize:20}}>{out}</code></div>
    </ToolShell>
  );
}
