import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    include: { follower: { select: { id: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(followers.map(f => f.follower));
}
