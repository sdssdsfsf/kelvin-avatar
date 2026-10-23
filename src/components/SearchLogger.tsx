"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
export function SearchLogger() {
  const sp = useSearchParams();
  const q = sp.get("q") || "";
  useEffect(() => {
    if (!q) return;
    fetch("/api/search-log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) }).catch(() => {});
  }, [q]);
  return null;
}
