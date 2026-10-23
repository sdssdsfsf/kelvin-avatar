import {notFound} from "next/navigation";
import {prisma} from "@/lib/prisma";
import {publicImageUrl} from "@/lib/storage";
import ProfileDetailClient from "@/components/ProfileDetailClient";
export const dynamic = "force-dynamic";
export default async function ProfileDetail({params}:{params:Promise<{id:string}>}){
  const {id} = await params;
  const item = await prisma.content.findFirst({where:{id,type:"PROFILE",status:"PUBLISHED"},include:{creator:{select:{username:true}}}});
  if(!item) notFound();
  await prisma.content.update({where:{id},data:{views:{increment:1}}});
  const avatar = publicImageUrl(item.avatarKey), banner = publicImageUrl(item.bannerKey);
  return (
    <main className="page container">
      <div className="detail-grid">
        <div style={{position:"relative",borderRadius:30,overflow:"hidden",background:"linear-gradient(135deg,#6d28d9,#8b5cf6,#b794f6)",padding:"24px 24px 120px"}}>
          <div aria-hidden style={{position:"absolute",inset:0,overflow:"hidden"}}>
            {banner && <img src={banner} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"blur(30px) saturate(1.2)",transform:"scale(1.4)"}}/>}
            {avatar && <img src={avatar} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",WebkitMaskImage:"radial-gradient(circle at 50% 80%, #000 0%, transparent 70%)",maskImage:"radial-gradient(circle at 50% 80%, #000 0%, transparent 70%)"}}/>}
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.12)"}}/>
          </div>
          <div style={{position:"relative"}}>
            <div style={{aspectRatio:"16/9",width:"100%",overflow:"hidden",borderRadius:28,border:"3px solid #111",background:"linear-gradient(135deg,#6d28d9,#8b5cf6)"}}>
              {banner && <img className="detail-image" src={banner} alt={`بنر ${item.name}`} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>}
            </div>
            {avatar && <img src={avatar} alt={`أفاتار ${item.name}`} style={{width:180,height:180,objectFit:"cover",borderRadius:"50%",border:"4px solid #111",background:"#fff",position:"absolute",bottom:-90,left:"50%",transform:"translateX(-50%)",boxShadow:"0 20px 45px #0005"}}/>}
          </div>
        </div>
        <ProfileDetailClient id={id} name={item.name} avatarKey={item.avatarKey} bannerKey={item.bannerKey} creator={item.creator} createdAt={item.createdAt} views={item.views} downloads={item.downloads} />
      </div>
    </main>
  );
}
