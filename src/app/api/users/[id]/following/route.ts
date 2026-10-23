import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const followings = await prisma.follow.findMany({
    where: { followerId: id },
    include: { following: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(followings.map(f => f.following));
}
