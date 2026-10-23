import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: !!process.env.S3_ENDPOINT,
  credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  } : undefined
});

async function toBuffer(body: any) {
  const chunks: Buffer[] = [];
  for await (const chunk of body as any) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kind = new URL(req.url).searchParams.get("kind") || "image";
  const item = await prisma.content.findFirst({ where: { id, status: "PUBLISHED" } });
  if (!item) return NextResponse.json({ error: "المحتوى غير موجود." }, { status: 404 });
  const key = kind === "avatar" ? item.avatarKey : kind === "banner" ? item.bannerKey : item.imageKey;
  if (!key) return NextResponse.json({ error: "الملف غير موجود." }, { status: 404 });
  const res = await client.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }));
  const buf = await toBuffer(res.Body);
  const fileName = `${item.name.replace(/[^a-z0-9]/gi,"_")}_${kind}`;
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": res.ContentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}.jpg"`,
      "Cache-Control": "no-store"
    }
  });
}
