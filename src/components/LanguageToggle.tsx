import { useLang } from "./LanguageProvider";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      className="btn secondary"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      style={{ padding: "8px 14px", fontSize: 12 }}
    >
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}
