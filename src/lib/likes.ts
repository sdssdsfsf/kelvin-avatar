import {prisma} from "@/lib/prisma";
export async function getUserLikedContentIds(userId:string, contentIds:string[]){
  const likes=await prisma.like.findMany({where:{userId,contentId:{in:contentIds}},select:{contentId:true}});
  return new Set(likes.map(l=>l.contentId));
}
export async function getLikeCounts(contentIds:string[]){
  const rows=await prisma.like.groupBy({by:["contentId"],where:{contentId:{in:contentIds}},_count:{contentId:true}});
  const map=new Map<string,number>();
  for(const r of rows) map.set(r.contentId,r._count.contentId);
  return map;
}
