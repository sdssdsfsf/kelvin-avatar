import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
export const metadata: Metadata = { title: "Kélvin Avátar | مكتبة بروفايلات ديسكورد", description: "اكتشف وشارك بروفايلات ديسكورد والخلفيات عالية الجودة." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body><Header />{children}<footer className="footer"><div className="container footer-row"><div><strong>✦ Kélvin Avátar</strong><p>مساحتك لاكتشاف ومشاركة التصاميم.</p></div><div><a href="/privacy">سياسة الخصوصية</a>　·　<a href="/terms">شروط الاستخدام</a>　·　<a href="https://discord.gg/kell" target="_blank" rel="noopener noreferrer">سيرفر ديسكورد</a></div><small>© {new Date().getFullYear()} Kélvin Avátar</small></div></footer></body></html>;
}