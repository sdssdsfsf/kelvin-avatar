import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

function randomId() {
  return Array.from({ length: 24 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
}

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

export async function saveImage(file: File, prefix: string) {
  const max = Math.max(1, Number(process.env.MAX_UPLOAD_MB || 12)) * 1024 * 1024;
  if (!file.type || !/^(image\/(jpeg|png|webp))$/i.test(file.type)) throw new Error("صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const valid = file.type === "image/jpeg" ? bytes.subarray(0,3).equals(Buffer.from([0xff,0xd8,0xff]))
    : file.type === "image/png" ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : bytes.subarray(0,4).toString() === "RIFF" && bytes.subarray(8,12).toString() === "WEBP";
  if (!valid) throw new Error("محتوى الملف لا يطابق نوع الصورة.");
  if (file.size <= 0 || file.size > max) throw new Error(`حجم الصورة يجب ألا يتجاوز ${Math.round(max / 1024 / 1024)} ميغابايت.`);
  if (!process.env.S3_BUCKET) throw new Error("تخزين الصور غير مُعدّ بعد. أضف S3_BUCKET إلى ملف البيئة.");
  const key = `${prefix}/${randomId()}.${file.type.split("/")[1]}`;
  await client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, Body: bytes, ContentType: file.type, CacheControl: "public, max-age=31536000, immutable" }));
  return { key, url: publicImageUrl(key) };
}

export async function deleteImage(key?: string | null) {
  if (!key || !process.env.S3_BUCKET) return;
  await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
}

export function publicImageUrl(key?: string | null) {
  if (!key) return null;
  const explicit = process.env.S3_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_S3_BASE_URL;
  if (explicit) return `${explicit.replace(/\/$/, "")}/${key}`;
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  if (endpoint && bucket) {
    let base = endpoint.replace(/\/s3\/?$/, '');
    return `${base}/object/public/${bucket}/${key}`;
  }
  return `/api/content/image?key=${encodeURIComponent(key)}`;
}
