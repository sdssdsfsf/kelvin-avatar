import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/components/LanguageProvider";
import { cookies } from "next/headers";
export const metadata: Metadata = { title: "Kélvin Avátar | مكتبة بروفايلات ديسكورد", description: "اكتشف وشارك بروفايلات ديسكورد والخلفيات عالية الجودة." };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jar = await cookies();
  const lang = jar.get("lang")?.value === "en" ? "en" : "ar";
  return <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}><body><LanguageProvider initialLang={lang}><Header />{children}<footer className="footer"><div className="container footer-row"><div><strong>✦ Kélvin Avátar</strong><p>{lang === "ar" ? "مساحتك لاكتشاف ومشاركة التصاميم." : "Your space to discover and share designs."}</p></div><div><a href="/privacy">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a>　·　<a href="/terms">{lang === "ar" ? "شروط الاستخدام" : "Terms of Use"}</a>　·　<a href="https://discord.gg/kell" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "سيرفر ديسكورد" : "Discord Server"}</a></div><small>© {new Date().getFullYear()} Kélvin Avátar</small></div></footer></LanguageProvider></body></html>;
}
