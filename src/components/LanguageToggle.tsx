"use client";
import { useEffect, useState } from "react";

type Lang = "ar" | "en";

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("ar");
  useEffect(() => {
    const c = document.cookie.split(";").find((x) => x.trim().startsWith("lang="));
    if (c) {
      const v = c.split("=")[1].trim();
      if (v === "en" || v === "ar") setLang(v);
    }
  }, []);

  const toggle = () => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    setLang(next);
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
  };

  return (
    <button
      className="btn secondary"
      onClick={toggle}
      style={{ padding: "8px 14px", fontSize: 12 }}
    >
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}
