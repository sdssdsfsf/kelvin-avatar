"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dropzone, Empty, Field, Range, Seg, ToolShell, downloadCanvas, fmtBytes, hexToRgb, hslToRgb, rgbToHsl, useImage, CopyBtn } from "./ui";

const hide = (show: boolean) => ({ display: show ? "block" : "none" } as const);

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* =============== 1) Emoji color changer =============== */
const QUICK = ["#ff4d6d", "#ff9f1c", "#ffd60a", "#2ec4b6", "#3a86ff", "#8338ec", "#ff5ecb", "#ffffff"];
export function EmojiColor() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#ff4d6d");
  const [mode, setMode] = useState("overlay");
  const LBL_ADD = "????? ?????";
  const LBL_REPLACE = "??????? ?????";
  const LBL_TINT = "?????";
  const methodOptions = [
    {v:"overlay",l:LBL_ADD},
    {v:"replace",l:LBL_REPLACE},
    {v:"tint",l:LBL_TINT}
  ];
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="?????">
            <div className="tl-swatches">
              {QUICK.map((c) => (
                <button key={c} className="tl-sw" onClick={() => setColor(c)}>
                  <i style={{background:c}}></i>
                  <span style={{fontSize:0}}>{c}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="???????"><Seg value={mode} onChange={setMode} options={methodOptions}/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = img.naturalWidth; c.height = img.naturalHeight;
            const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0);
            const id = ctx.getImageData(0, 0, c.width, c.height);
            for(let i=0;i<id.data.length;i+=4){
              const r=id.data[i],g=id.data[i+1],b=id.data[i+2],a=id.data[i+3];
              const h = parseInt(color.slice(1,3),16), g2 = parseInt(color.slice(3,5),16), b2 = parseInt(color.slice(5,7),16);
              if(mode==="replace"){ id.data[i]=h; id.data[i+1]=g2; id.data[i+2]=b2; }
              else if(mode==="overlay"){ id.data[i]=Math.min(255,(r+h)/2); id.data[i+1]=Math.min(255,(g+g2)/2); id.data[i+2]=Math.min(255,(b+b2)/2); }
              else if(mode==="tint"){ const lum=(r+g+b)/3; id.data[i]=Math.min(255,lum*h/255); id.data[i+1]=Math.min(255,lum*g2/255); id.data[i+2]=Math.min(255,lum*b2/255); }
            }
            ctx.putImageData(id,0,0);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-colored.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? ?????? ???????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
      <div className="tl-note">?????? ???????: {img && fmtBytes(img.naturalWidth * img.naturalHeight * 4)}</div>
    </ToolShell>
  );
}
/* =============== 2) Background remover =============== */
export function BgRemover() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [tol, setTol] = useState(40);
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="?????? ??????? ?????????"><Range label={String(tol)} value={tol} min={0} max={100} onChange={setTol} unit="%" /></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = img.naturalWidth; c.height = img.naturalHeight;
            const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0);
            const id = ctx.getImageData(0, 0, c.width, c.height);
            const tl2 = tol;
            const bgR = id.data[0], bgG = id.data[1], bgB = id.data[2];
            for(let i=0;i<id.data.length;i+=4){
              const dr=Math.abs(id.data[i]-bgR), dg=Math.abs(id.data[i+1]-bgG), db=Math.abs(id.data[i+2]-bgB);
              if(dr<tl2 && dg<tl2 && db<tl2) id.data[i+3]=0;
            }
            ctx.putImageData(id,0,0);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-nobg.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? PNG ????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
      <div className="tl-note">?????? ???????: {img && fmtBytes(img.naturalWidth * img.naturalHeight * 4)}</div>
    </ToolShell>
  );
}

/* =============== 3) Emoji maker =============== */
export function EmojiMaker() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [d, setD] = useState(120);
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="????? (px)"><Range label={String(d)} value={d} min={48} max={512} onChange={setD} unit="px"/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = d; c.height = d;
            const ctx = c.getContext("2d")!;
            ctx.beginPath(); ctx.arc(d/2,d/2,d/2,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill(); ctx.clip();
            ctx.drawImage(img, 0, 0, d, d);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-emoji.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? ????????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
    </ToolShell>
  );
}

/* =============== 4) Avatar crop =============== */
export function AvatarCrop() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(128);
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="????? (px)"><Range label={String(size)} value={size} min={64} max={512} onChange={setSize} unit="px"/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = size; c.height = size;
            const ctx = c.getContext("2d")!;
            ctx.beginPath(); ctx.arc(size/2,size/2,size/2,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill(); ctx.clip();
            const s = Math.min(size/img.naturalWidth, size/img.naturalHeight);
            const sw = img.naturalWidth*s, sh = img.naturalHeight*s;
            ctx.drawImage(img, (size-sw)/2, (size-sh)/2, sw, sh);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-avatar.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? ????????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
    </ToolShell>
  );
}

/* =============== 5) Banner crop =============== */
export function BannerCrop() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [w, setW] = useState(1920); const [h, setH] = useState(480);
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="????? (px)"><Range label={String(w)} value={w} min={100} max={4096} onChange={setW} unit="px"/></Field>
          <Field label="???????? (px)"><Range label={String(h)} value={h} min={100} max={2048} onChange={setH} unit="px"/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = w; c.height = h;
            const ctx = c.getContext("2d")!;
            const s = Math.max(w/img.naturalWidth, h/img.naturalHeight);
            const sw = img.naturalWidth*s, sh = img.naturalHeight*s;
            ctx.drawImage(img, (w-sw)/2, (h-sh)/2, sw, sh);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-banner.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? ?????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 300 }} />
    </ToolShell>
  );
}

/* =============== 6) Image converter =============== */
export function ImageConverter() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [fmt, setFmt] = useState("png");
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="??????"><Seg value={fmt} onChange={setFmt} options={[{v:"png",l:"PNG"},{v:"jpeg",l:"JPG"},{v:"webp",l:"WEBP"}]}/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = img.naturalWidth; c.height = img.naturalHeight;
            const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}.${fmt}`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, `image/${fmt}`);
          }}>????? ??????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
    </ToolShell>
  );
}

/* =============== 7) Rounded border =============== */
export function RoundedBorder() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [r, setR] = useState(20); const [color, setColor] = useState("#8b5cf6");
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="??????? ???????"><Range label={String(r)} value={r} min={0} max={100} onChange={setR} unit="px"/></Field>
          <Field label="??? ??????"><input type="color" value={color} onChange={e=>setColor(e.target.value)}/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = img.naturalWidth; c.height = img.naturalHeight;
            const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0);
            ctx.beginPath(); rr(ctx, 0, 0, c.width, c.height, r); ctx.clip();
            ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.stroke();
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-border.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? PNG ????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
    </ToolShell>
  );
}

/* =============== 8) Image resizer =============== */
export function ImageResizerTool() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [w, setW] = useState(500); const [h, setH] = useState(500);
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="????? (px)"><Range label={String(w)} value={w} min={1} max={2000} onChange={setW} unit="px"/></Field>
          <Field label="???????? (px)"><Range label={String(h)} value={h} min={1} max={2000} onChange={setH} unit="px"/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; c.width = w; c.height = h;
            const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0, w, h);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-resized.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
          }}>????? ??????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
    </ToolShell>
  );
}

/* =============== 9) Color picker =============== */
export function ColorPickerTool() {
  const [color, setColor] = useState("#8b5cf6");
  const [hex, setHex] = useState(color);
  return (
    <ToolShell
      controls={
        <>
          <Field label="?????"><div className="tl-flex"><input type="color" value={color} onChange={(e)=>{setColor(e.target.value); setHex(e.target.value);}}/><input className="tl-in" value={hex} onChange={e=>setHex(e.target.value)} placeholder="#8b5cf6"/></div></Field>
        </>
      }
    >
      <div style={{width:"100%",height:150,borderRadius:20,background:color,border:"1px solid rgba(255,255,255,.12)"}} />
      <div className="tl-item" style={{width:"100%"}}><div><small>????? ???????</small><code style={{direction:"ltr"}}>{hex}</code></div><CopyBtn text={hex}/></div>
    </ToolShell>
  );
}

/* =============== 10) Image compressor =============== */
export function ImageCompressorTool() {
  const { img, name, bytes, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [q, setQ] = useState(80); const [t, setT] = useState(100);
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="??????"><Range label={String(q)} value={q} min={10} max={100} onChange={setQ} unit="%"/></Field>
          <Field label="????? ????? %"><Range label={String(t)} value={t} min={10} max={100} onChange={setT} unit="%"/></Field>
          <button className="tl-btn full" disabled={!img} onClick={() => {
            if(!ref.current || !img) return;
            const c = ref.current; const nw = Math.max(1, Math.round(img.naturalWidth * t / 100)); const nh = Math.max(1, Math.round(img.naturalHeight * t / 100));
            c.width = nw; c.height = nh; const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0, nw, nh);
            c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-compressed.webp`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/webp", q/100);
          }}>??? ??????</button>
        </>
      }
    >
      {!img && <Empty />}
      <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 400 }} />
      {img && <div style={{marginTop:10}}><p className="tl-note">?????? ???????: {fmtBytes(img ? img.naturalWidth * img.naturalHeight * 4 : 0)}</p></div>}
    </ToolShell>
  );
}

/* =============== 11) Text to ASCII =============== */
export function TextToAsciiTool() {
  const [text, setText] = useState("");
  const [font, setFont] = useState("standard");
  const fonts: Record<string, Record<string,string>> = {
    standard: { A: "  A  ", B: " BBB ", C: " CCC " },
    slant: { A: "   A   ", B: "  BBBB  ", C: "  CCCC  " },
  };
  const lines = text.toUpperCase().split("").map((ch, i) => {
    const rows = fonts[font][ch] || "  ?  ";
    return rows.split("\n");
  });
  const ascii = lines.length ? lines[0].map((_, ri) => lines.map(l => ri < l.length ? l[ri] : " ").join("")).join("\n") : "";
  return (
    <ToolShell
      controls={
        <>
          <Field label="????"><input className="tl-in" value={text} onChange={e=>setText(e.target.value)} placeholder="???? ????"/></Field>
          <Field label="????"><Seg value={font} onChange={setFont} options={[{v:"standard",l:"????"},{v:"slant",l:"????"}]}/></Field>
          <button className="tl-btn full" onClick={()=>{navigator.clipboard.writeText(ascii); alert("?? ?????")}}>??? ASCII</button>
        </>
      }
    >
      <div className="tl-preview"><pre>{ascii}</pre></div>
      <div className="tl-item" style={{width:"100%"}}><div><small>??????</small><code style={{direction:"ltr",whiteSpace:"pre-wrap"}}>{ascii}</code></div><CopyBtn text={ascii}/></div>
    </ToolShell>
  );
}

/* =============== 12) Discord status =============== */
export function DiscordStatusTool() {
  const [text, setText] = useState("Playing");
  const [emoji, setEmoji] = useState("??");
  const [color, setColor] = useState("#5865f2");
  return (
    <ToolShell
      controls={
        <>
          <Field label="?? ??????"><input className="tl-in" value={text} onChange={e=>setText(e.target.value)} placeholder="???ing..."/></Field>
          <Field label="????????"><input className="tl-in" value={emoji} onChange={e=>setEmoji(e.target.value)} placeholder="??"/></Field>
          <Field label="?????"><input type="color" value={color} onChange={e=>setColor(e.target.value)}/></Field>
          <button className="tl-btn full" onClick={()=>{navigator.clipboard.writeText(`${emoji} ${text}`); alert("?? ?????")}}>??? ??????</button>
        </>
      }
    >
      <div style={{width:"100%",padding:24,borderRadius:16,background:"#2f3136",border:"1px solid rgba(255,255,255,.12)",color:"#fff",fontFamily:"'Cairo',sans-serif",display:"flex",alignItems:"center",gap:16}}><div style={{fontSize:48}}>{emoji}</div><div><div style={{fontWeight:900,fontSize:18}}>{text}</div><div style={{fontSize:12,color:"#72767d"}}>Playing � 2 viewers</div></div></div>
      <div className="tl-item" style={{width:"100%"}}><div><small>?????? ????????</small><code style={{direction:"ltr"}}>{`${emoji} ${text}`}</code></div><CopyBtn text={`${emoji} ${text}`}/></div>
    </ToolShell>
  );
}

/* =============== 13) Photo Enhancer =============== */
export function PhotoEnhancerTool() {
  const { img, name, load } = useImage();
  const ref = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState("none");
  const [border, setBorder] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const filterOptions = [
    {v:"none",l:"????"},
    {v:"sepia",l:"?????"},
    {v:"grayscale",l:"?????"},
    {v:"invert",l:"??? ???????"},
    {v:"blur",l:"?????"}
  ];
  return (
    <ToolShell
      controls={
        <>
          <Dropzone onFile={load} />
          <Field label="????? ??????"><Seg value={filter} onChange={setFilter} options={filterOptions}/></Field>
          <Field label="??????"><Range label={String(brightness)} value={brightness} min={0} max={200} onChange={setBrightness} unit="%"/></Field>
          <Field label="???????"><Range label={String(contrast)} value={contrast} min={0} max={200} onChange={setContrast} unit="%"/></Field>
          <Field label="??????"><Range label={String(saturation)} value={saturation} min={0} max={200} onChange={setSaturation} unit="%"/></Field>
          <div className="tl-flex" style={{gap:10}}>
            <button className="tl-btn sec" onClick={()=>setBorder(!border)}>{border?"????? ??????":"????? ????"}</button>
            <button className="tl-btn full" disabled={!img} onClick={() => {
              if(!ref.current || !img) return;
              const c = ref.current; c.width = img.naturalWidth; c.height = img.naturalHeight;
              const ctx = c.getContext("2d")!; ctx.drawImage(img, 0, 0);
              ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filter}`;
              ctx.drawImage(img, 0, 0);
              if(border){ ctx.lineWidth = 12; ctx.strokeStyle = "#8b5cf6"; ctx.strokeRect(6,6,c.width-12,c.height-12); }
              c.toBlob((b)=>{ if(b){ const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${name}-enhanced.png`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u); }}, "image/png");
            }}>????? ?????? ????????</button>
          </div>
        </>
      }
    >
      {!img && <Empty />}
      {img && (
        <>
          <canvas ref={ref} className="tl-checker" style={{ ...hide(!!img), maxWidth: "100%", maxHeight: 500 }} />
          <div style={{marginTop:10}}><p className="tl-note">?????? ???????: {fmtBytes(img ? img.naturalWidth * img.naturalHeight * 4 : 0)}</p></div>
        </>
      )}
    </ToolShell>
  );
}
