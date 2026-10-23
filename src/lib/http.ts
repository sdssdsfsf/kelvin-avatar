import { NextResponse } from "next/server";
export function errorResponse(error: unknown) {
  const msg = error instanceof Error ? error.message : "";
  const status = msg === "UNAUTHENTICATED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
  const safe = status === 401 ? "يجب تسجيل الدخول أولاً." : status === 403 ? "ليست لديك صلاحية لتنفيذ هذا الإجراء." : (msg || "حدث خطأ غير متوقع.");
  return NextResponse.json({ error: safe }, { status });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients are still protected by auth and SameSite cookies
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}
