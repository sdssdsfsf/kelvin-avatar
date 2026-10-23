import Link from "next/link";
import { currentUser } from "@/lib/auth";

const headerCss = `
.topbar{background:rgba(15,10,30,.65);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.1);position:sticky;top:0;z-index:50}
.nav{height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.brand{display:flex;align-items:center;gap:8px;color:#fff}
.links{display:flex;gap:10px;align-items:center}
.links a{padding:8px 16px;border-radius:14px;background:rgba(255,255,255,.08);color:#f3f4f6;font-weight:800;font-size:13px;min-width:95px;text-align:center;display:flex;align-items:center;justify-content:center;white-space:nowrap;transition:.3s;border:1px solid rgba(255,255,255,.12)}
.links a:hover{background:var(--purple);color:white;transform:translateY(-2px);box-shadow:0 10px 24px #8b5cf644}
.btn{border:0;border-radius:16px;padding:10px 20px;background:linear-gradient(135deg,#8b5cf6,#c084fc);color:#0b0618;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:.3s;box-shadow:0 10px 26px #8b5cf63f}
.btn:hover{background:linear-gradient(135deg,#7c3aed,#a78bfa);transform:translateY(-2px);box-shadow:0 14px 32px #8b5cf655}
.btn.secondary{background:rgba(255,255,255,.08);color:#f3f4f6;border:1px solid rgba(255,255,255,.12);box-shadow:none}
.btn.secondary:hover{background:rgba(255,255,255,.18);transform:translateY(-1px)}
@media (max-width: 860px){
  .topbar .nav{height:auto;flex-wrap:wrap;padding-top:10px;padding-bottom:10px;direction:rtl}
  .topbar .links{order:3;width:100%;gap:14px;overflow-x:auto;padding-bottom:4px;direction:rtl;text-align:right;justify-content:flex-end}
  .topbar .links a{min-width:120px;padding:8px 14px;direction:rtl;text-align:right;white-space:nowrap}
}
`;

const KLogo = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-label="K">
    <path d="M4 4V20M4 12L12 4M4 12L12 20" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4V20M4 12L12 4M4 12L12 20" stroke="url(#kgrad)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <defs>
      <linearGradient id="kgrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d946ef" stopOpacity={1} />
        <stop offset="100%" stopColor="#f472b6" stopOpacity={1} />
      </linearGradient>
    </defs>
  </svg>
);

export async function Header() {
  const user = await currentUser();
  return (
    <header className="topbar">
      <style dangerouslySetInnerHTML={{ __html: headerCss }} />
      <div className="container nav">
        <Link className="brand" href="/"><KLogo /></Link>
        <nav className="links">
          <Link href="/">الرئيسية</Link>
          <Link href="/profiles">بروفايلات ديسكورد</Link>
          <Link href="/wallpapers">الخلفيات</Link>
          <Link href="/upload">إضافة محتوى</Link>
          <Link href="/tools">ادوات</Link>
          <Link href="/leaderboard">الأفضل</Link>
          {user && <Link href="/dashboard">مكتبتي</Link>}
          {user?.role === "ADMIN" && <Link href="/admin">الإدارة</Link>}
        </nav>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {user ? (
            <>
              <span className="muted">{user.username}</span>
              <Link className="btn secondary" href="/dashboard">حسابي</Link>
              <form action="/api/auth/logout" method="post"><button className="btn" type="submit">خروج</button></form>
            </>
          ) : (
            <>
              <Link className="btn secondary" href="/login">تسجيل الدخول</Link>
              <Link className="btn" href="/register">إنشاء حساب</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
