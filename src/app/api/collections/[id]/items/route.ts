import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await prisma.collectionItem.findMany({
    where: { collectionId: id },
    include: { content: { include: { creator: { select: { username: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "تسجيل الدخول أولاً." }, { status: 401 });
  const { id } = await params;
  const { contentId } = await req.json();
  if (!contentId) return NextResponse.json({ error: "معرف المحتوى مطلوب." }, { status: 400 });
  const collection = await prisma.collection.findFirst({ where: { id, userId: user.id } });
  if (!collection) return NextResponse.json({ error: "المجموعة غير موجودة." }, { status: 404 });
  const item = await prisma.collectionItem.create({
    data: { collectionId: id, contentId },
    include: { content: true },
  });
  return NextResponse.json(item);
}
