// Styles for the tools section. Everything is prefixed with "tl-" so it can't clash with the rest of the site.
export const toolsCss = `
.tl-hero{position:relative;overflow:hidden;border-radius:32px;padding:44px 40px;margin:24px 0 26px;color:#fff;background:linear-gradient(135deg,#2e1065,#5b21b6 50%,#8b5cf6)}
.tl-hero::after{content:"";position:absolute;width:320px;height:320px;border-radius:50%;background:#c4b5fd;filter:blur(80px);opacity:.45;top:-120px;left:-60px}
.tl-hero h1{margin:0 0 10px;font-size:clamp(30px,4.5vw,46px);font-weight:900;position:relative;color:#fff}
.tl-hero p{margin:0;max-width:580px;line-height:1.8;color:rgba(255,255,255,.88);position:relative}
.tl-badges{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;position:relative}
.tl-badges span{padding:6px 14px;border-radius:999px;background:rgba(255,255,255,.14);font-size:13px;font-weight:700}

.tl-bar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:20px}
.tl-search{flex:1;min-width:220px;padding:13px 18px;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);font:inherit;outline:none;color:#f3f4f6}
.tl-search::placeholder{color:#94a3b8}
.tl-search:focus{border-color:var(--purple,#8b5cf6);box-shadow:0 0 0 4px #8b5cf61a}
.tl-chips{display:flex;gap:8px;flex-wrap:wrap}
.tl-chip{border:0;cursor:pointer;font:inherit;font-weight:700;font-size:14px;padding:10px 18px;border-radius:14px;background:rgba(255,255,255,.08);color:#f3f4f6;transition:.15s;border:1px solid rgba(255,255,255,.12)}
.tl-chip:hover{background:rgba(255,255,255,.18)}
.tl-chip.on{background:var(--purple,#8b5cf6);color:#fff}

.tl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px}
.tl-card{display:block;text-decoration:none;color:#f3f4f6;background:#18122f;border:1px solid rgba(255,255,255,.12);border-radius:26px;padding:22px;transition:transform .2s,box-shadow .2s,border-color .2s}
.tl-card:hover{transform:translateY(-5px);box-shadow:0 22px 44px rgba(0,0,0,.35);border-color:#c084fc}
.tl-card h3{margin:14px 0 6px;font-size:18px;font-weight:800;color:#fff}
.tl-card p{margin:0;font-size:14px;line-height:1.75;color:#a1a1aa}
.tl-ic{width:54px;height:54px;border-radius:17px;display:grid;place-items:center;font-size:26px;color:#fff;background:linear-gradient(135deg,#8b5cf6,#c084fc);box-shadow:0 10px 22px #8b5cf64d;flex:none}
.tl-none{padding:50px;text-align:center;color:#94a3b8;border:2px dashed rgba(255,255,255,.18);border-radius:24px}

.tl-back{display:inline-block;margin:18px 0 6px;font-weight:700;color:#c084fc;text-decoration:none}
.tl-head{display:flex;gap:16px;align-items:center;margin:10px 0 22px}
.tl-head h1{margin:0;font-size:clamp(24px,3.6vw,34px);font-weight:900;color:#fff}
.tl-head p{margin:4px 0 0;color:#a1a1aa;line-height:1.7}

.tl-shell{display:grid;grid-template-columns:350px 1fr;gap:20px;align-items:start;margin-bottom:40px}
.tl-panel{background:#18122f;border:1px solid rgba(255,255,255,.12);border-radius:26px;padding:20px;box-shadow:0 14px 38px rgba(0,0,0,.25)}
.tl-stage{min-height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center}
.tl-stage canvas{max-width:100%;height:auto;border-radius:14px}
.tl-checker{background-color:#18122f;background-image:linear-gradient(45deg,#271e3f 25%,transparent 25%,transparent 75%,#271e3f 75%),linear-gradient(45deg,#271e3f 25%,transparent 25%,transparent 75%,#271e3f 75%);background-size:18px 18px;background-position:0 0,9px 9px}

.tl-drop{border:2px dashed rgba(255,255,255,.18);border-radius:20px;padding:24px 14px;text-align:center;cursor:pointer;background:rgba(255,255,255,.04);color:#f3f4f6;font-weight:700;transition:.15s}
.tl-drop:hover,.tl-drop.over{background:rgba(255,255,255,.1);border-color:#c084fc}
.tl-field{margin-top:16px}
.tl-lab,.tl-row{font-size:14px;font-weight:700;margin-bottom:8px;color:#f3f4f6}
.tl-row{display:flex;justify-content:space-between;align-items:center}
.tl-row b{color:#c084fc;font-variant-numeric:tabular-nums}
.tl-panel input[type=range]{width:100%;accent-color:#c084fc}
.tl-panel input[type=color]{width:46px;height:40px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:#18122f;padding:3px;cursor:pointer}
.tl-in,.tl-panel textarea,.tl-panel select{width:100%;padding:11px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#f3f4f6;font:inherit;outline:none}
.tl-in:focus,.tl-panel textarea:focus{border-color:#c084fc;box-shadow:0 0 0 4px #8b5cf622}
.tl-panel textarea{min-height:130px;resize:vertical;line-height:1.7;color:#f3f4f6}
.tl-seg{display:flex;flex-wrap:wrap;gap:6px}
.tl-seg button{border:0;cursor:pointer;font:inherit;font-size:13px;font-weight:700;padding:8px 14px;border-radius:12px;background:rgba(255,255,255,.08);color:#f3f4f6;border:1px solid rgba(255,255,255,.12)}
.tl-seg button.on{background:#c084fc;color:#fff}
.tl-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:0;cursor:pointer;font:inherit;font-weight:800;padding:12px 20px;border-radius:14px;background:#c084fc;color:#0b0618;transition:transform .15s}
.tl-btn:hover{transform:translateY(-2px)}
.tl-btn.sec{background:rgba(255,255,255,.08);color:#f3f4f6;border:1px solid rgba(255,255,255,.12)}
.tl-btn.full{width:100%;margin-top:18px}
.tl-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.tl-note{margin-top:14px;font-size:13px;line-height:1.7;color:#94a3b8;background:rgba(255,255,255,.04);border-radius:14px;padding:10px 14px}
.tl-warn{color:#fcd34d;background:rgba(251,191,36,.12)}
.tl-empty{color:#94a3b8;line-height:1.9}
.tl-flex{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

.tl-swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;width:100%}
.tl-sw{border:1px solid rgba(255,255,255,.12);border-radius:16px;overflow:hidden;cursor:pointer;background:rgba(255,255,255,.04);font:inherit;padding:0;text-align:center;color:#f3f4f6}
.tl-sw i{display:block;height:64px}
.tl-sw span{display:block;padding:8px;font-size:13px;font-weight:700;direction:ltr}
.tl-list{width:100%;display:grid;gap:10px;text-align:start}
.tl-item{display:flex;gap:12px;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:12px 16px;background:rgba(255,255,255,.02)}
.tl-item small{display:block;color:#94a3b8;font-size:12px;margin-bottom:2px}
.tl-item div{min-width:0;overflow-wrap:anywhere}
.tl-item code{direction:ltr;unicode-bidi:plaintext;font-size:15px;color:#f3f4f6}
.tl-gradbox{width:100%;height:220px;border-radius:20px;border:1px solid rgba(255,255,255,.12)}

.tl-preview{width:100%;text-align:start;background:#1e1430;color:#cbd5e1;border-radius:18px;padding:18px;line-height:1.6;overflow-wrap:anywhere;border:1px solid rgba(255,255,255,.12)}
.tl-preview pre{background:#130b24;border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:8px 10px;margin:6px 0;white-space:pre-wrap;direction:ltr;text-align:left;color:#cbd5e1}
.tl-preview code{background:#130b24;border-radius:4px;padding:1px 5px;direction:ltr;unicode-bidi:plaintext;color:#f3f4f6}
.tl-quote{border-inline-start:4px solid #8b5cf6;padding-inline-start:12px;margin:4px 0}
.tl-h1{font-size:1.6em;font-weight:800}.tl-h2{font-size:1.3em;font-weight:800}.tl-h3{font-size:1.1em;font-weight:800}
.tl-preview small{color:#94a3b8;font-size:.8em;display:block}
.tl-spoiler{background:#1e1f22;color:transparent;border-radius:4px;padding:0 3px;cursor:pointer;transition:.15s}
.tl-spoiler:hover{background:#4e5058;color:#dbdee1}

@media (max-width:900px){.tl-shell{grid-template-columns:1fr}.tl-hero{padding:32px 22px}}
`;
