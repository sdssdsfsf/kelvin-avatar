import {NextResponse} from "next/server";import {prisma} from "@/lib/prisma";import {requireAdmin} from "@/lib/auth";
export async function GET(){
  const [users,contents,likes,downloadsAgg,searches]=await Promise.all([
    prisma.user.count(),
    prisma.content.count(),
    prisma.like.count(),
    prisma.content.aggregate({_sum:{downloads:true}}),
    prisma.searchLog.groupBy({by:["query"],_count:{query:true},orderBy:{_count:{query:"desc"}},take:10}),
  ]);
  const registrationsByDay=await prisma.user.groupBy({by:["createdAt"],_count:{id:true},orderBy:{_count:{id:"desc"}},take:7});
  const topContent=await prisma.content.findMany({
    where:{status:"PUBLISHED"},
    include:{creator:{select:{username:true}},likes:{select:{id:true}}},
    orderBy:[{views:"desc"},{downloads:"desc"}],
    take:10,
  });
  return NextResponse.json({
    users,contents,likes,
    downloads:downloadsAgg._sum.downloads||0,
    searches,
    registrationsByDay,
    topContent:topContent.map((c)=>({
      id:c.id,name:c.name,type:c.type,username:c.creator.username,
      likes:c.likes.length,views:c.views,downloads:c.downloads,
    })),
  });
}
export async function POST(req:Request){
  const admin=await requireAdmin();
  const {query,userId}=await req.json();
  if(!query)return NextResponse.json({error:"البحث مطلوب."},{status:400});
  await prisma.searchLog.create({data:{query,userId:userId||null}});
  return NextResponse.json({ok:true});
}
