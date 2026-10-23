import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { publicImageUrl } from "@/lib/storage";
import { ContentCard } from "@/components/ContentCard";
import { Hero } from "@/components/Hero";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latest, wallpapers, users, profiles, walls] = await Promise.all([
    prisma.content.findMany({where:{status:"PUBLISHED"},include:{creator:{select:{username:true}}},orderBy:{createdAt:"desc"},take:8}),
    prisma.content.findMany({where:{status:"PUBLISHED",type:"WALLPAPER"},include:{creator:{select:{username:true}}},orderBy:{createdAt:"desc"},take:4}),
    prisma.user.count(),
    prisma.content.count({where:{status:"PUBLISHED",type:"PROFILE"}}),
    prisma.content.count({where:{status:"PUBLISHED",type:"WALLPAPER"}}),
  ]);
  const samples = latest.filter((i:any)=>i.type==="PROFILE"&&(i.avatarKey||i.bannerKey)).slice(0,3).map((i:any)=>({banner:i.bannerKey?publicImageUrl(i.bannerKey):null,avatar:i.avatarKey?publicImageUrl(i.avatarKey):null}));
  return (
    <>
      <div className="container"><Hero samples={samples} /></div>
      <section className="section"><div className="container"><div className="grid" style={{gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        {[["المستخدمون",users],["البروفايلات",profiles],["الخلفيات",walls],["الإجمالي",users+profiles+walls]].map(([l,v])=>(
          <div key={l} className="card" style={{textAlign:"center",padding:20}}><div className="muted" style={{fontSize:13}}>{l}</div><div style={{fontSize:32,fontWeight:800,color:"var(--purple)",marginTop:6}}>{v}</div></div>
        ))}
      </div></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><h2>أحدث الإضافات</h2><p>اكتشف ما أضافه المجتمع مؤخراً</p></div><Link className="btn secondary" href="/search">استكشف المكتبة</Link></div>{latest.length?<div className="grid">{latest.map((i:any)=><ContentCard key={i.id} item={i}/>)}</div>:<div className="empty">المكتبة فارغة حالياً.</div>}</div></section>
      <section className="section"><div className="container"><div className="section-head"><div><h2>خلفيات تستحق التجربة</h2><p>خلفيات عالية الجودة لأجهزتك</p></div><Link className="btn secondary" href="/wallpapers">كل الخلفيات</Link></div>{wallpapers.length?<div className="grid">{wallpapers.map((i:any)=><ContentCard key={i.id} item={i}/>)}</div>:<div className="empty">لم تتم إضافة خلفيات بعد.</div>}</div></section>
    </>
  );
}
