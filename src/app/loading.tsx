export default function Loading() {
  return (
    <div className="splash-wrap">
      <div className="splash-logo">
        <img src="/logo.png" alt="Kélvin Avátar" style={{width:"520px",height:"auto",display:"block"}}/>
      </div>
      <h1 className="splash-title">Kélvin Avátar</h1>
      <div className="splash-dots">
        <div className="splash-dot"></div>
        <div className="splash-dot"></div>
        <div className="splash-dot"></div>
      </div>
      <p className="splash-text">جارٍ التحميل…</p>
      <style>{`
        .splash-wrap{min-height:100vh;width:100%;background:#0b0618;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f3f4f6;font-family:'Cairo',system-ui,sans-serif;overflow:hidden}
        .splash-logo{width:520px;height:auto;margin-top:-40px;margin-bottom:8px;filter:drop-shadow(0 0 40px rgba(139,92,246,.5))}
        .splash-title{font-size:30px;font-weight:900;letter-spacing:2px;margin-bottom:10px;background:linear-gradient(to right,#fff,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .splash-dots{display:flex;gap:8px;align-items:center;margin-top:18px}
        .splash-dot{width:10px;height:10px;border-radius:50%;background:#8b5cf6;animation:bounce 1.4s infinite ease-in-out}
        .splash-dot:nth-child(2){animation-delay:0.2s}
        .splash-dot:nth-child(3){animation-delay:0.4s}
        .splash-text{margin-top:26px;font-size:13px;color:#94a3b8}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
    </div>
  );
}
