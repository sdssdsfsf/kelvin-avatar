"use client";
import Link from "next/link";
import { publicImageUrl } from "@/lib/storage";
import { useEffect, useState } from "react";
type Item = {id:string;name:string;type:"PROFILE"|"WALLPAPER";thumbnailUrl:string|null;avatarKey?:string|null;bannerKey?:string|null;imageKey?:string|null;createdAt:Date;views:number;downloads:number;likes?:number;creator:{username:string}};
const blurLayer: React.CSSProperties = {position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"blur(28px) saturate(1.2)",transform:"scale(1.4)"};
export function ContentCard({item}:{item:Item}) {
  const [myLiked, setMyLiked] = useState(false);
  const [myLikes, setMyLikes] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const href = item.type === "PROFILE" ? `/profiles/${item.id}` : `/wallpapers/${item.id}`;
  const isProfile = item.type === "PROFILE";
  const banner = isProfile ? (item.bannerKey ? publicImageUrl(item.bannerKey) : item.thumbnailUrl) : (item.imageKey ? publicImageUrl(item.imageKey) : item.thumbnailUrl);
  const avatar = item.avatarKey ? publicImageUrl(item.avatarKey) : null;
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const r=await fetch(`/api/content/${item.id}/like`);
        const d=await r.json();
        if(!cancelled){setMyLiked(!!d.liked);setMyLikes(typeof d.likes==="number"?d.likes:0);}
      }catch{}finally{if(!cancelled)setLoaded(true);}
    })();
    return ()=>{cancelled=true;};
  },[item.id]);
  async function toggleLike() {
    try {
      const r = await fetch(`/api/content/${item.id}/like`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "فشل");
      setMyLiked(!!d.liked);
      setMyLikes(typeof d.likes === "number" ? d.likes : myLikes + (d.liked ? 1 : -1));
    } catch { alert("تعذر الإعجاب بالمحتوى."); }
  }
  return (
    <article className="card">
      <Link href={href} style={{display:"block",textDecoration:"none"}}>
        <div className="thumb" style={{position:"relative",overflow:"hidden",borderRadius:26,height:250,background:"linear-gradient(135deg,var(--purple),var(--purple2))",boxShadow:"0 14px 38px #39205a16"}}>
          {isProfile ? (
            <>
              <div aria-hidden style={{position:"absolute",inset:0,overflow:"hidden"}}>
                {banner ? <img src={banner} alt="" style={blurLayer}/> : null}
                {avatar ? <img src={avatar} alt="" style={{...blurLayer,WebkitMaskImage:"radial-gradient(circle at 50% 80%, #000 0%, transparent 70%)",maskImage:"radial-gradient(circle at 50% 80%, #000 0%, transparent 70%)"}}/> : null}
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.12)"}}/>
              </div>
              <div style={{position:"relative",aspectRatio:"16/9",width:"100%",overflow:"hidden",borderRadius:18,border:"2px solid #111",background:"linear-gradient(135deg,var(--purple),var(--purple2))"}}>
                {banner ? <img src={banner} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/> : <span style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:60,color:"rgba(255,255,255,0.28)"}}>✦</span>}
              </div>
              {avatar ? <img src={avatar} alt={item.name} style={{position:"absolute",bottom:-45,left:"50%",transform:"translateX(-50%)",width:90,height:90,objectFit:"cover",borderRadius:"50%",border:"3px solid #111",background:"#fff",boxShadow:"0 12px 30px #0005"}}/> : null}
              <button className="like-btn" disabled={!loaded} onClick={toggleLike} style={{position:"absolute",top:12,right:12,width:40,height:40,borderRadius:"50%",border:"none",background:myLiked?"#c084fc":"rgba(255,255,255,.15)",color:"#fff",fontWeight:900,fontSize:20,cursor:"pointer",boxShadow:"0 6px 16px #0005",transition:"transform .2s",transform:myLiked?"scale(1.08)":"scale(1)",opacity:loaded?1:.5}}>{myLiked?"❤":"♡"}</button>
            </>
          ) : (
            <>
              {banner ? (
                <>
                  <img src={banner} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  <button className="like-btn" disabled={!loaded} onClick={toggleLike} style={{position:"absolute",top:12,right:12,width:40,height:40,borderRadius:"50%",border:"none",background:myLiked?"#c084fc":"rgba(255,255,255,.15)",color:"#fff",fontWeight:900,fontSize:20,cursor:"pointer",boxShadow:"0 6px 16px #0005",transition:"transform .2s",transform:myLiked?"scale(1.08)":"scale(1)",opacity:loaded?1:.5}}>{myLiked?"❤":"♡"}</button>
                </>
              ) : <span style={{fontSize:60,color:"rgba(255,255,255,0.28)"}}>✦</span>}
            </>
          )}
        </div>
      </Link>
      <div className="card-body" style={{padding:18,paddingTop:52}}>
        <Link href={href} style={{color:"inherit"}}><h3 style={{margin:0,fontSize:18,fontWeight:800,lineHeight:1.35,overflowWrap:"anywhere"}}>{item.name}</h3></Link>
        <div className="muted" style={{marginTop:7,fontSize:13}}>بواسطة {item.creator.username}</div>
        <div className="meta" style={{marginTop:13,fontSize:13,display:"flex",gap:16,alignItems:"center"}}><span>◉ {item.views} مشاهدة</span><span>↓ {item.downloads} تنزيل</span><span style={{color:myLiked?"#c084fc":"inherit"}}>♡ {myLikes} إعجاب</span></div>
      </div>
    </article>
  );
}
