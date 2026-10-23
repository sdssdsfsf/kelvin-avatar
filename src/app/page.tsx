import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { publicImageUrl } from "@/lib/storage";
import { ContentCard } from "@/components/ContentCard";
import { Hero } from "@/components/Hero";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, latest, wallpapers] = await Promise.all([
    prisma.content.findMany({where:{status:"PUBLISHED",featured:true},include:{creator:{select:{username:true}}},orderBy:{createdAt:"desc"},take:4}),
    prisma.content.findMany({where:{status:"PUBLISHED"},include:{creator:{select:{username:true}}},orderBy:{createdAt:"desc"},take:8}),
    prisma.content.findMany({where:{status:"PUBLISHED",type:"WALLPAPER"},include:{creator:{select:{username:true}}},orderBy:{createdAt:"desc"},take:4}),
  ]);
  const samples = latest.filter((i:any)=>i.type==="PROFILE"&&(i.avatarKey||i.bannerKey)).slice(0,3).map((i:any)=>({banner:i.bannerKey?publicImageUrl(i.bannerKey):null,avatar:i.avatarKey?publicImageUrl(i.avatarKey):null}));
  return (
    <>
      <div className="container"><Hero samples={samples} /></div>
      <section className="section"><div className="container"><div className="section-head"><div><h2>مختارات مميزة</h2><p>تصاميم اختيرت لتلهمك</p></div><Link className="btn secondary" href="/profiles">عرض الكل</Link></div>{featured.length?<div className="grid">{featured.map((i:any)=><ContentCard key={i.id} item={i}/>)}</div>:<div className="empty">لا توجد تصاميم مميزة حتى الآن.</div>}</div></section>
      <section className="section"><div className="container"><div className="section-head"><div><h2>أحدث الإضافات</h2><p>اكتشف ما أضافه المجتمع مؤخراً</p></div><Link className="btn secondary" href="/search">استكشف المكتبة</Link></div>{latest.length?<div className="grid">{latest.map((i:any)=><ContentCard key={i.id} item={i}/>)}</div>:<div className="empty">المكتبة فارغة حالياً.</div>}</div></section>
      <section className="section"><div className="container"><div className="section-head"><div><h2>خلفيات تستحق التجربة</h2><p>خلفيات عالية الجودة لأجهزتك</p></div><Link className="btn secondary" href="/wallpapers">كل الخلفيات</Link></div>{wallpapers.length?<div className="grid">{wallpapers.map((i:any)=><ContentCard key={i.id} item={i}/>)}</div>:<div className="empty">لم تتم إضافة خلفيات بعد.</div>}</div></section>
    </>
  );
}
