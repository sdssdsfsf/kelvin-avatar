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
