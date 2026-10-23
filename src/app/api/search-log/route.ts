import {NextResponse} from "next/server";import {prisma} from "@/lib/prisma";import {currentUser} from "@/lib/auth";
export async function POST(req:Request){const user=await currentUser();const {query}=await req.json();if(!query)return NextResponse.json({error:"البحث مطلوب."},{status:400});await prisma.searchLog.create({data:{query,userId:user?user.id:null}});return NextResponse.json({ok:true});}
