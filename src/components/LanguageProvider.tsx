"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "ar" | "en";
type Dict = Record<string, { ar: string; en: string }>;

const dict: Dict = {
  home: { ar: "الرئيسية", en: "Home" },
  profiles: { ar: "بروفايلات ديسكورد", en: "Discord Profiles" },
  wallpapers: { ar: "الخلفيات", en: "Wallpapers" },
  upload: { ar: "إضافة محتوى", en: "Upload" },
  tools: { ar: "ادوات", en: "Tools" },
  leaderboard: { ar: "الأفضل", en: "Leaderboard" },
  dashboard: { ar: "مكتبتي", en: "Dashboard" },
  admin: { ar: "الإدارة", en: "Admin" },
  login: { ar: "تسجيل الدخول", en: "Login" },
  register: { ar: "إنشاء حساب", en: "Register" },
  logout: { ar: "خروج", en: "Logout" },
  account: { ar: "حسابي", en: "My Account" },
  lang: { ar: "EN", en: "عربي" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangCtx = createContext<Ctx>({ lang: "ar", setLang: () => {}, t: (k) => k });

export function useLang() {
  return useContext(LangCtx);
}

export function LanguageProvider({ children, initialLang = "ar" }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const c = document.cookie.split(";").find((x) => x.trim().startsWith("lang="));
    if (c) {
      const v = c.split("=")[1].trim();
      if (v === "en" || v === "ar") setLangState(v);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000`;
  };

  const t = (key: string) => dict[key]?.[lang] ?? key;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}
