import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { contentId: id },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "تسجيل الدخول أولاً." }, { status: 401 });
  const { id } = await params;
  const { text } = await req.json();
  if (!text || text.trim().length === 0) return NextResponse.json({ error: "نص التعليق مطلوب." }, { status: 400 });
  const comment = await prisma.comment.create({
    data: { text, userId: user.id, contentId: id },
    include: { user: { select: { id: true, username: true } } },
  });
  return NextResponse.json(comment);
}
