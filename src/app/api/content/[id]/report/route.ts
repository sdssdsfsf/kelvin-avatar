import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "تسجيل الدخول أولاً." }, { status: 401 });
  const { id } = await params;
  const { reason, details } = await req.json();
  if (!reason) return NextResponse.json({ error: "سبب البلاغ مطلوب." }, { status: 400 });
  const report = await prisma.report.create({
    data: { reason, details, reporterId: user.id, contentId: id },
  });
  return NextResponse.json(report);
}
