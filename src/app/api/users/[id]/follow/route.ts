import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "تسجيل الدخول أولاً." }, { status: 401 });
  const { id } = await params;
  if (id === user.id) return NextResponse.json({ error: "لا يمكن متابعة نفسك." }, { status: 400 });
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId: id } },
  });
  if (existing) {
    await prisma.follow.delete({ where: { followerId_followingId: { followerId: user.id, followingId: id } } });
    return NextResponse.json({ following: false });
  }
  await prisma.follow.create({ data: { followerId: user.id, followingId: id } });
  return NextResponse.json({ following: true });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const follows = await prisma.follow.findMany({
    where: { followerId: id },
    include: { following: { select: { id: true, username: true } } },
  });
  const isFollowing = user ? await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId: id } },
  }) : null;
  return NextResponse.json({ follows, isFollowing: !!isFollowing });
}
