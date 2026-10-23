"use client";
import { useEffect, useRef, useState } from "react";
import { CopyBtn, Dropzone, Empty, Field, Range, Seg, ToolShell, copyText, downloadCanvas, hexToRgb, hslToRgb, isHex, rgbToHex, rgbToHsl, useImage } from "./ui";

/* =============== Palette from image =============== */
export function PaletteTool() {
  const { img, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [cols, setCols] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const c = ref.current;
    if (!c || !img) return;
    const k = Math.min(1, 520 / Math.max(img.naturalWidth, img.naturalHeight));
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d", { willReadFrequently: true })!.drawImage(img, 0, 0, c.width, c.height);

    const t = document.createElement("canvas");
    const kk = 90 / Math.max(img.naturalWidth, img.naturalHeight);
    t.width = Math.max(1, Math.round(img.naturalWidth * kk));
    t.height = Math.max(1, Math.round(img.naturalHeight * kk));
    const tc = t.getContext("2d", { willReadFrequently: true })!;
    tc.drawImage(img, 0, 0, t.width, t.height);
    const px = tc.getImageData(0, 0, t.width, t.height).data;

    const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] < 128) continue;
      const key = ((px[i] >> 4) << 8) | ((px[i + 1] >> 4) << 4) | (px[i + 2] >> 4);
      const e = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      e.n++; e.r += px[i]; e.g += px[i + 1]; e.b += px[i + 2];
      buckets.set(key, e);
    }
    const sorted = [...buckets.values()].sort((a, b) => b.n - a.n).map((e) => [e.r / e.n, e.g / e.n, e.b / e.n] as const);
    const chosen: (readonly [number, number, number])[] = [];
    for (const c1 of sorted) {
      if (chosen.every((c2) => Math.hypot(c1[0] - c2[0], c1[1] - c2[1], c1[2] - c2[2]) > 45)) chosen.push(c1);
      if (chosen.length >= 8) break;
    }
    setCols(chosen.map((v) => rgbToHex(v[0], v[1], v[2])));
    setPicked(null);
  }, [img]);

  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const x = Math.min(c.width - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * c.width)));
    const y = Math.min(c.height - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * c.height)));
    const d = c.getContext("2d")!.getImageData(x, y, 1, 1).data;
    setPicked(rgbToHex(d[0], d[1], d[2]));
  };

  const copy = async (hex: string) => { await copyText(hex); setCopied(hex); setTimeout(() => setCopied(""), 1000); };

  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          {picked && (
            <Field label="اللون الملتقط">
              <div className="tl-flex">
                <span style={{ width: 44, height: 44, borderRadius: 12, background: picked, border: "1px solid #e3dbf7" }} />
                <code style={{ direction: "ltr" }}>{picked}</code>
                <CopyBtn text={picked} />
              </div>
            </Field>
          )}
          {cols.length > 0 && <button className="tl-btn full" onClick={() => copy(cols.join(", "))}>نسخ كل الألوان</button>}
          <div className="tl-note">اضغط على أي لون لنسخه، أو اضغط على الصورة لالتقاط لون من نقطة محددة.</div>
        </>
      }
    >
      {!img && <Empty text="ارفع صورة لاستخراج ألوانها" />}
      <canvas ref={ref} onClick={pick} style={{ display: img ? "block" : "none", cursor: "crosshair", maxHeight: 340 }} />
      {cols.length > 0 && (
        <div className="tl-swatches">
          {cols.map((c) => (
            <button key={c} className="tl-sw" onClick={() => copy(c)}>
              <i style={{ background: c }} />
              <span>{copied === c ? "✓ تم النسخ" : c}</span>
            </button>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

/* =============== Gradient maker =============== */
const PRESETS: { n: string; c: string[] }[] = [
  { n: "بنفسجي", c: ["#6d28d9", "#8b5cf6", "#c4b5fd"] },
  { n: "غروب", c: ["#ff512f", "#f09819"] },
  { n: "محيط", c: ["#2193b0", "#6dd5ed"] },
  { n: "نيون", c: ["#00f5a0", "#00d9f5"] },
  { n: "وردي", c: ["#ff5ecb", "#8338ec"] },
  { n: "ليل", c: ["#0f0c29", "#302b63", "#24243e"] },
];

export function GradientTool() {
  const [stops, setStops] = useState(["#6d28d9", "#8b5cf6", "#c4b5fd"]);
  const [kind, setKind] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [dim, setDim] = useState<[number, number]>([1360, 480]);

  const css = kind === "linear" ? `linear-gradient(${angle}deg, ${stops.join(", ")})` : `radial-gradient(circle, ${stops.join(", ")})`;

  const save = () => {
    const [W, H] = dim;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d")!;
    let g: CanvasGradient;
    if (kind === "linear") {
      const a = (angle * Math.PI) / 180;
      const dx = Math.sin(a), dy = -Math.cos(a);
      const len = Math.abs(W * dx) + Math.abs(H * dy);
      g = ctx.createLinearGradient(W / 2 - (dx * len) / 2, H / 2 - (dy * len) / 2, W / 2 + (dx * len) / 2, H / 2 + (dy * len) / 2);
    } else {
      g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W / 2, H / 2));
    }
    stops.forEach((s, i) => g.addColorStop(stops.length === 1 ? 0 : i / (stops.length - 1), s));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    downloadCanvas(c, "gradient.png");
  };

  return (
    <ToolShell
      controls={
        <>
          <Field label="ألوان جاهزة">
            <div className="tl-flex">
              {PRESETS.map((p) => (
                <button key={p.n} type="button" title={p.n} onClick={() => setStops(p.c)} style={{ width: 44, height: 34, borderRadius: 11, border: "2px solid #fff", outline: "1px solid #e3dbf7", cursor: "pointer", background: `linear-gradient(135deg,${p.c.join(",")})` }} />
              ))}
            </div>
          </Field>
          <Field label="ألوان التدرج">
            <div className="tl-flex">
              {stops.map((s, i) => (
                <input key={i} type="color" value={s} onChange={(e) => setStops(stops.map((x, j) => (j === i ? e.target.value : x)))} />
              ))}
              {stops.length < 5 && <button className="tl-btn sec" type="button" onClick={() => setStops([...stops, "#ffffff"])}>＋</button>}
              {stops.length > 2 && <button className="tl-btn sec" type="button" onClick={() => setStops(stops.slice(0, -1))}>－</button>}
            </div>
          </Field>
          <Field label="النوع">
            <Seg value={kind} onChange={setKind} options={[{ v: "linear", l: "خطي" }, { v: "radial", l: "دائري" }]} />
          </Field>
          {kind === "linear" && <Range label="الزاوية" value={angle} min={0} max={360} onChange={setAngle} unit="°" />}
          <Field label="مقاس التنزيل">
            <Seg value={dim.join("x")} onChange={(v) => setDim(v.split("x").map(Number) as [number, number])} options={[{ v: "1360x480", l: "بنر" }, { v: "1920x1080", l: "خلفية" }, { v: "1024x1024", l: "مربع" }]} />
          </Field>
          <button className="tl-btn full" onClick={save}>تنزيل PNG</button>
        </>
      }
    >
      <div className="tl-gradbox" style={{ background: css, borderRadius: 24, height: 220, width: "100%", boxShadow: "0 20px 48px rgba(109,40,217,.22)", border: "1px solid rgba(255,255,255,.4)" }} />
      <div className="tl-item" style={{ width: "100%" }}>
        <div><small>كود CSS</small><code>background: {css};</code></div>
        <CopyBtn text={`background: ${css};`} />
      </div>
    </ToolShell>
  );
}

/* =============== Color converter =============== */
export function ColorConverter() {
  const [hex, setHex] = useState("#8b5cf6");
  const ok = isHex(hex);
  const norm = ok ? (hex.startsWith("#") ? hex : "#" + hex) : "#8b5cf6";
  const [r, g, b] = hexToRgb(norm);
  const [h, s, l] = rgbToHsl(r, g, b);
  const full = rgbToHex(r, g, b);
  const rows: [string, string][] = [
    ["HEX", full.toUpperCase()],
    ["RGB", `rgb(${r}, ${g}, ${b})`],
    ["HSL", `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`],
    ["رقم ديسكورد (إيمبد)", String(parseInt(full.slice(1), 16))],
    ["0x", "0x" + full.slice(1).toUpperCase()],
  ];
  const [hh, setHh] = useState(0);
  useEffect(() => setHh(Math.round(h)), [h]);

  return (
    <ToolShell
      controls={
        <>
          <Field label="اختر لوناً">
            <div className="tl-flex">
              <input type="color" value={full} onChange={(e) => setHex(e.target.value)} />
              <input className="tl-in" style={{ flex: 1, direction: "ltr" }} value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#8b5cf6" />
            </div>
          </Field>
          {!ok && <div className="tl-note tl-warn">أدخل كود HEX صحيحاً مثل #8b5cf6</div>}
          <Range label="درجة اللون (Hue)" value={hh} min={0} max={360} onChange={(v) => { setHh(v); const [rr, gg, bb] = hslToRgb(v, s || 0.8, l || 0.5); setHex(rgbToHex(rr, gg, bb)); }} unit="°" />
        </>
      }
    >
      <div style={{ width: "100%", height: 150, borderRadius: 20, background: full, border: "1px solid #ece6fb" }} />
      <div className="tl-list">
        {rows.map(([k, v]) => (
          <div className="tl-item" key={k}>
            <div><small>{k}</small><code>{v}</code></div>
            <CopyBtn text={v} />
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

/* =============== Text case converter =============== */
export function TextCaseTool() {
  const [text, setText] = useState("");
  const [a, setA] = useState("ar");
  const cases: Record<string, string> = {
    ar: text,
    upper: text.toUpperCase(),
    lower: text.toLowerCase(),
    title: text.replace(/\b\w/g, (c) => c.toUpperCase()),
    sentence: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    camel: text.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[^a-zA-Z0-9]+/, ""),
    snake: text.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase(),
    kebab: text.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase(),
    inverse: text.split("").map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join(""),
  };
  const lang = a === "ar" ? "العربية" : "English";
  return (
    <ToolShell
      controls={
        <>
          <Field label="النص">
            <textarea className="tl-in" rows={4} placeholder="اكتب النص هنا…" value={text} onChange={(e) => setText(e.target.value)} style={{direction:a==="ar"?"rtl":"ltr"}} />
          </Field>
          <Field label="لغة الاتجاه">
            <Seg value={a} onChange={setA} options={[{v:"ar",l:"من اليمين لليسار"},{v:"en",l:"English LTR"}]}/>
          </Field>
          <button className="tl-btn full" disabled={!text} onClick={()=>{navigator.clipboard.writeText(text);alert("تم النسخ")}}>نسخ الكل</button>
        </>
      }
    >
      <div className="tl-grid2">
        {Object.entries(cases).map(([k,v])=>(
          <div key={k} className="tl-card2"><div className="tl-card2-head"><span>{k=== "ar"?"أصلي":k}</span><button className="tl-btn sec" onClick={()=>{navigator.clipboard.writeText(v);alert("تم النسخ")}}>نسخ</button></div><div className="tl-card2-body" style={{wordBreak:"break-word",fontFamily:"'Cairo',monospace"}}>{v||"—"}</div></div>
        ))}
      </div>
    </ToolShell>
  );
}

/* =============== Password generator =============== */
export function PasswordGeneratorTool() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [pass, setPass] = useState("");
  const U="ABCDEFGHIJKLMNOPQRSTUVWXYZ",L="abcdefghijklmnopqrstuvwxyz",N="0123456789",S="!@#$%^&*()_+-=[]{}|;:,.<>?";
  useEffect(()=>{let pool="";if(upper)pool+=U;if(lower)pool+=L;if(num)pool+=N;if(sym)pool+=S;if(!pool){setPass("");return}let p="";for(let i=0;i<len;i++)p+=pool[Math.floor(Math.random()*pool.length)];setPass(p);},[len,upper,lower,num,sym]);
  return (
    <ToolShell
      controls={
        <>
          <Field label={`طول كلمة المرور (${len})`}><Range label={String(len)} value={len} min={4} max={64} onChange={setLen} unit="حرف"/></Field>
          <Field label="الخيارات"><div className="tl-flex" style={{gap:10,flexWrap:"wrap"}}><button className="tl-btn sec" style={{flex:1}} onClick={()=>setUpper(!upper)}>{upper?"تشمل أحرف كبيرة ✓":"أحرف كبيرة"}</button><button className="tl-btn sec" style={{flex:1}} onClick={()=>setLower(!lower)}>{lower?"تشمل أحرف صغيرة ✓":"أحرف صغيرة"}</button><button className="tl-btn sec" style={{flex:1}} onClick={()=>setNum(!num)}>{num?"أرقام ✓":"أرقام"}</button><button className="tl-btn sec" style={{flex:1}} onClick={()=>setSym(!sym)}>{sym?"رموز ✓":"رموز"}</button></div></Field>
          <button className="tl-btn full" onClick={()=>{navigator.clipboard.writeText(pass);alert("تم النسخ")}} disabled={!pass}>توليد ونسخ</button>
        </>
      }
    >
      <div style={{width:"100%",height:72,borderRadius:16,background:"var(--card)",border:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",fontFamily:"'Cairo',monospace",fontSize:18,color:"#f3f4f6",wordBreak:"break-all"}}>{pass||"—"}</div>
      <div className="tl-note">تُولد كلمة المرور محلياً في متصفحك ولا تُرسل إلى أي مكان.</div>
    </ToolShell>
  );
}

/* =============== Box shadow generator =============== */
export function BoxShadowTool() {
  const [h, setH] = useState(0);const [v, setV] = useState(12);const [b, setB] = useState(24);const [s, setS] = useState(0);const [color, setColor] = useState("rgba(0,0,0,.25)");
  const css = `box-shadow: ${h}px ${v}px ${b}px ${s}px ${color};`;
  return (
    <ToolShell
      controls={
        <>
          <Field label="الإزاحة الأفقي"><Range label={String(h)} value={h} min={-50} max={50} onChange={setH} unit="px"/></Field>
          <Field label="الإزاحة العمودي"><Range label={String(v)} value={v} min={-50} max={50} onChange={setV} unit="px"/></Field>
          <Field label="التمويه"><Range label={String(b)} value={b} min={0} max={80} onChange={setB} unit="px"/></Field>
          <Field label="الانتشار"><Range label={String(s)} value={s} min={0} max={40} onChange={setS} unit="px"/></Field>
          <Field label="اللون"><input type="color" value={color} onChange={(e)=>setColor(e.target.value)}/></Field>
          <button className="tl-btn full" onClick={()=>{navigator.clipboard.writeText(css);alert("تم النسخ")}}>نسخ كود CSS</button>
        </>
      }
    >
      <div style={{width:"100%",height:220,borderRadius:24,background:"#0f0a1e",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`${h}px ${v}px ${b}px ${s}px ${color}`,border:"1px solid rgba(255,255,255,.08)"}}><div style={{width:110,height:110,borderRadius:22,background:"linear-gradient(135deg,#8b5cf6,#c084fc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:900,color:"#fff"}}>K</div></div>
      <div className="tl-item" style={{width:"100%"}}><div><small>كود CSS</small><code style={{direction:"ltr"}}>{css}</code></div><CopyBtn text={css}/></div>
    </ToolShell>
  );
}

/* =============== Border radius generator =============== */
export function BorderRadiusTool() {
  const [all, setAll] = useState(20);const [tl,setTl]=useState(20);const [tr,setTr]=useState(20);const [br,setBr]=useState(20);const [bl,setBl]=useState(20);
  const css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
  const setEach = (v:number)=>{setAll(v);setTl(v);setTr(v);setBr(v);setBl(v);};
  return (
    <ToolShell
      controls={
        <>
          <Field label="جميع الزوايا"><Range label={String(all)} value={all} min={0} max={100} onChange={setEach} unit="px"/></Field>
          <div className="tl-grid2" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
            <Field label="أعلى يمين"><Range label={String(tl)} value={tl} min={0} max={100} onChange={setTl} unit="px"/></Field>
            <Field label="أعلى شمال"><Range label={String(tr)} value={tr} min={0} max={100} onChange={setTr} unit="px"/></Field>
            <Field label="أ abajo يمنى"><Range label={String(br)} value={br} min={0} max={100} onChange={setBr} unit="px"/></Field>
            <Field label="أ abajo شمال"><Range label={String(bl)} value={bl} min={0} max={100} onChange={setBl} unit="px"/></Field>
          </div>
          <button className="tl-btn full" onClick={()=>{navigator.clipboard.writeText(css);alert("تم النسخ")}}>نسخ كود CSS</button>
        </>
      }
    >
      <div style={{width:"100%",height:200,borderRadius:`${tl}px ${tr}px ${br}px ${bl}px`,background:"linear-gradient(135deg,#8b5cf6,#c084fc)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,.12)"}}><div style={{width:100,height:100,borderRadius:12,background:"#0f0a1e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,color:"#fff"}}>K</div></div>
      <div className="tl-item" style={{width:"100%"}}><div><small>كود CSS</small><code style={{direction:"ltr"}}>{css}</code></div><CopyBtn text={css}/></div>
    </ToolShell>
  );
}

/* =============== CSS button generator =============== */
export function CssButtonTool() {
  const [bg, setBg] = useState("#8b5cf6");const [txt, setTxt] = useState("#ffffff");const [rad, setRad] = useState(16);const [pad, setPad] = useState(14);const [text, setText] = useState("زرّي");
  const css = `.btn{\n  display:inline-flex;\n  align-items:center;\n  justify-content:center;\n  gap:10px;\n  padding:${pad}px 22px;\n  border-radius:${rad}px;\n  border:none;\n  background:${bg};\n  color:${txt};\n  font-weight:900;\n  cursor:pointer;\n  transition:.3s;\n}\n.btn:hover{filter:brightness(1.15);transform:translateY(-2px);}`;
  return (
    <ToolShell
      controls={
        <>
          <Field label="نص الزر"><input className="tl-in" value={text} onChange={e=>setText(e.target.value)} placeholder="زرّي"/></Field>
          <Field label="لون الخلفية"><input type="color" value={bg} onChange={e=>setBg(e.target.value)}/></Field>
          <Field label="لون النص"><input type="color" value={txt} onChange={e=>setTxt(e.target.value)}/></Field>
          <Field label="استدارة الحواف"><Range label={String(rad)} value={rad} min={0} max={60} onChange={setRad} unit="px"/></Field>
          <Field label="الحشو الداخلي"><Range label={String(pad)} value={pad} min={4} max={40} onChange={setPad} unit="px"/></Field>
          <button className="tl-btn full" onClick={()=>{navigator.clipboard.writeText(css);alert("تم النسخ")}}>نسخ كود CSS</button>
        </>
      }
    >
      <div style={{width:"100%",display:"flex",justifyContent:"center",gap:16}}><button style={{padding:`${pad}px ${pad+8}px`,borderRadius:`${rad}px`,background:bg,color:txt,border:"none",fontWeight:900,fontFamily:"'Cairo',system-ui",fontSize:16,cursor:"pointer",transition:"all .3s"}} onMouseEnter={(e:any)=>{e.currentTarget.style.filter="brightness(1.15)";e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={(e:any)=>{e.currentTarget.style.filter="";e.currentTarget.style.transform=""}}>{text}</button></div>
      <div className="tl-item" style={{width:"100%"}}><div><small>كود CSS</small><code style={{direction:"ltr",whiteSpace:"pre-wrap"}}>{css}</code></div><CopyBtn text={css}/></div>
    </ToolShell>
  );
}
