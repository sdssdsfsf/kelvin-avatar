import Link from "next/link";import {prisma} from "@/lib/prisma";import {publicImageUrl} from "@/lib/storage";
export const dynamic="force-dynamic";
export default async function Leaderboard() {
  const top = await prisma.content.findMany({
    where: { status: "PUBLISHED" },
    include: { creator: { select: { username: true } }, likes: { select: { id: true } } },
    orderBy: [{ likes: { _count: "desc" } }, { views: "desc" }, { downloads: "desc" }],
    take: 20,
  });
  return (
    <main className="page container">
      <div className="page-title"><h1>جدول الأفضل</h1><p>أكثر المحتويات إعجاباً وانتشاراً في  كلفن أفاتار.</p></div>
      <div className="grid">
        {top.map((c, i) => {
          const banner = c.bannerKey ? publicImageUrl(c.bannerKey) : c.imageKey ? publicImageUrl(c.imageKey) : c.thumbnailUrl;
          const avatar = c.avatarKey ? publicImageUrl(c.avatarKey) : null;
          const isNumbered = i < 3;
          return (
            <article key={c.id} className={`card ${isNumbered ? "top-card" : ""}`}>
              <div className="top-badge">{i + 1}</div>
              <Link href={c.type === "PROFILE" ? `/profiles/${c.id}` : `/wallpapers/${c.id}`} style={{display:"block",textDecoration:"none"}}>
                <div className="thumb" style={{position:"relative",overflow:"hidden",borderRadius:22,height:240,background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#b794f6)",boxShadow:"0 14px 38px #39205a16"}}>
                  {c.type === "PROFILE" ? (
                    <>
<div style={{position:"relative",borderRadius:22,overflow:"hidden",background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#b794f6)",padding:"16px 16px 80px"}}>
  <div aria-hidden style={{position:"absolute",inset:0,overflow:"hidden"}}>
    {banner ? <img src={banner} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"blur(20px) saturate(1.2)",transform:"scale(1.4)"}}/> : null}
    {avatar ? <img src={avatar} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",WebkitMaskImage:"radial-gradient(circle at 50% 80%, #000 0%, transparent 70%)",maskImage:"radial-gradient(circle at 50% 80%, #000 0%, transparent 70%)"}}/> : null}
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.12)"}}/>
  </div>
  <div style={{position:"relative"}}>
    <div style={{aspectRatio:"16/9",width:"100%",overflow:"hidden",borderRadius:18,border:"2px solid #111",background:"linear-gradient(135deg,#6d28d9,#8b5cf6)"}}>
      {banner ? <img src={banner} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/> : <span style={{fontSize:56,color:"rgba(255,255,255,0.3)"}}>✦</span>}
    </div>
    {avatar ? <img src={avatar} alt={c.name} style={{width:90,height:90,objectFit:"cover",borderRadius:"50%",border:"3px solid #111",background:"#fff",position:"absolute",bottom:-45,left:"50%",transform:"translateX(-50%)",boxShadow:"0 12px 30px #0005"}}/> : null}
  </div>
</div>
                    </>
                  ) : <>{banner ? <img loading="lazy" src={banner} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/> : <span style={{fontSize:56,color:"rgba(255,255,255,0.3)"}}>✦</span>}</>}
                </div>
              </Link>
              <div className="card-body" style={{padding:18}}>
                <Link href={c.type === "PROFILE" ? `/profiles/${c.id}` : `/wallpapers/${c.id}`} style={{color:"inherit"}}><h3 style={{margin:0,fontSize:17,fontWeight:800,lineHeight:1.35,overflowWrap:"anywhere"}}>{c.name}</h3></Link>
                <div className="muted" style={{marginTop:5,fontSize:13}}>بواسطة {c.creator.username}</div>
                <div className="meta" style={{marginTop:11,fontSize:13}}><span>♡ {c.likes.length} إعجاب</span><span>◉ {c.views} مشاهدة</span><span>↓ {c.downloads} تنزيل</span></div>
              </div>
            </article>
          );
        })}
      </div>
      <style>{`
        .top-card{position:relative;border:2px solid #c084fc;box-shadow:0 20px 50px rgba(192,132,252,.25)}
        .top-badge{position:absolute;top:-10px;right:-10px;width:28px;height:28px;border-radius:50%;background:#c084fc;color:#0b0618;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;z-index:2;box-shadow:0 4px 12px rgba(192,132,252,.4)}
        .thumb{border-radius:20px}
      `}</style>
    </main>
  );
}
