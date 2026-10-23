import Link from "next/link";

type Sample = { banner?: string | null; avatar?: string | null };

// Class names are prefixed with "kx-" so they can't clash with your existing .hero / .hero-grid CSS.
const css = `
.kx-hero{position:relative;overflow:hidden;border-radius:36px;margin:28px 0 12px;padding:64px 56px;
  background:linear-gradient(135deg,#2e1065 0%,#5b21b6 45%,#8b5cf6 100%);color:#fff;isolation:isolate}
.kx-hero::before,.kx-hero::after{content:"";position:absolute;border-radius:50%;filter:blur(70px);z-index:-1;opacity:.55}
.kx-hero::before{width:420px;height:420px;background:#c4b5fd;top:-140px;left:-100px;animation:kxDrift 14s ease-in-out infinite alternate}
.kx-hero::after{width:360px;height:360px;background:#7c3aed;bottom:-160px;right:-80px;animation:kxDrift 18s ease-in-out infinite alternate-reverse}
.kx-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
.kx-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(8px);font-size:14px;font-weight:700;animation:kxUp .7s both}
.kx-hero h1{margin:18px 0 14px;font-size:clamp(34px,5vw,58px);line-height:1.15;font-weight:900;color:#fff;animation:kxUp .7s .08s both}
.kx-hero h1 span{background:linear-gradient(90deg,#fff,#ddd6fe);-webkit-background-clip:text;background-clip:text;color:transparent}
.kx-hero p{margin:0 0 24px;max-width:520px;font-size:18px;line-height:1.8;color:rgba(255,255,255,.85);animation:kxUp .7s .16s both}
.kx-search{display:flex;gap:8px;max-width:520px;padding:6px;border-radius:18px;background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.3);backdrop-filter:blur(10px);animation:kxUp .7s .2s both}
.kx-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#fff;font:inherit;font-size:16px;padding:10px 14px}
.kx-search input::placeholder{color:rgba(255,255,255,.65)}
.kx-search button{border:0;cursor:pointer;font:inherit;font-weight:800;padding:10px 22px;border-radius:13px;background:#fff;color:#5b21b6}
.kx-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px;animation:kxUp .7s .26s both}
.kx-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:16px;font-weight:800;font-size:16px;text-decoration:none;
  transition:transform .2s ease,box-shadow .2s ease}
.kx-btn:hover{transform:translateY(-3px)}
.kx-btn.primary{background:#fff;color:#5b21b6;box-shadow:0 14px 34px rgba(0,0,0,.25)}
.kx-btn.ghost{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.35)}
.kx-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;animation:kxUp .7s .32s both}
.kx-chips span{padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.1);font-size:13px;font-weight:700}

.kx-visual{position:relative;height:380px;animation:kxUp .8s .2s both}
.kx-card{position:absolute;width:260px;padding:12px 12px 56px;border-radius:26px;background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(14px);box-shadow:0 30px 60px rgba(20,0,60,.35)}
.kx-card .b{height:120px;border-radius:18px;border:2.5px solid #111;background-size:cover;background-position:center}
.kx-card .a{position:absolute;left:50%;top:92px;width:84px;height:84px;margin-left:-42px;border-radius:50%;border:3px solid #111;
  background-size:cover;background-position:center;box-shadow:0 10px 24px rgba(0,0,0,.35)}
.kx-card .l{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);width:60%;height:8px;border-radius:99px;background:rgba(255,255,255,.35)}
.kx-card.c1{top:10px;right:10px;transform:rotate(5deg);animation:kxFloat 6s ease-in-out infinite}
.kx-card.c2{top:120px;left:0;transform:rotate(-6deg);animation:kxFloat 7s ease-in-out -2s infinite}
.kx-card.c3{top:215px;right:70px;transform:rotate(2deg);animation:kxFloat 8s ease-in-out -4s infinite}

@keyframes kxUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes kxFloat{0%,100%{translate:0 0}50%{translate:0 -14px}}
@keyframes kxDrift{from{transform:translate(0,0)}to{transform:translate(40px,30px)}}
@media (max-width:860px){
  .kx-hero{padding:40px 22px;border-radius:28px}
  .kx-grid{grid-template-columns:1fr}
  .kx-visual{height:320px}
  .kx-card{width:220px}
  .kx-card.c3{display:none}
}
@media (prefers-reduced-motion:reduce){.kx-hero *,.kx-hero::before,.kx-hero::after{animation:none!important}}
`;

const fallbacks = [
  { b: "linear-gradient(135deg,#1e1b4b,#6d28d9)", a: "linear-gradient(135deg,#f0abfc,#7c3aed)" },
  { b: "linear-gradient(135deg,#0f172a,#7c3aed,#f472b6)", a: "linear-gradient(135deg,#fde68a,#f97316)" },
  { b: "linear-gradient(135deg,#312e81,#a78bfa)", a: "linear-gradient(135deg,#a5f3fc,#6366f1)" },
];

const bg = (url: string | null | undefined, fb: string) =>
  url ? { backgroundImage: `url("${url}")` } : { backgroundImage: fb };

export function Hero({ samples = [] }: { samples?: Sample[] }) {
  return (
    <section className="kx-hero">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="kx-grid">
        <div>
          <span className="kx-eyebrow">✦ منصة البروفايلات والخلفيات</span>
          <h1>
            اجعل بروفايلك <span>يعكس شخصيتك.</span>
          </h1>
          <p>اكتشف بروفايلات ديسكورد وخلفيات مميزة، شارك تصاميمك مع المجتمع، وحمّل الصور بجودتها الأصلية.</p>

          <form className="kx-search" action="/search">
            <input name="q" placeholder="ابحث عن بروفايل أو خلفية…" />
            <button type="submit">بحث</button>
          </form>

          <div className="kx-actions">
            <Link className="kx-btn primary" href="/profiles">تصفح البروفايلات ←</Link>
            <Link className="kx-btn ghost" href="/upload">أضف تصميمك</Link>
          </div>
          <div className="kx-chips">
            <span>تحميل مجاني</span>
            <span>جودة أصلية</span>
            <span>أفاتار + بنر</span>
          </div>
        </div>

        <div className="kx-visual" aria-hidden="true">
          {[0, 1, 2].map((i) => {
            const s = samples[i];
            return (
              <div key={i} className={`kx-card c${i + 1}`}>
                <div className="b" style={bg(s?.banner, fallbacks[i].b)} />
                <div className="a" style={bg(s?.avatar, fallbacks[i].a)} />
                <div className="l" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
