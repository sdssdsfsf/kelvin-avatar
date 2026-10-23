import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "تسجيل الدخول أولاً." }, { status: 401 });
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(collections);
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "تسجيل الدخول أولاً." }, { status: 401 });
  const { name } = await req.json();
  if (!name || name.trim().length === 0) return NextResponse.json({ error: "اسم المجموعة مطلوب." }, { status: 400 });
  const collection = await prisma.collection.create({
    data: { name, userId: user.id },
    include: { _count: { select: { items: true } } },
  });
  return NextResponse.json(collection);
}
