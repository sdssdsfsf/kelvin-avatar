"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminActions } from "@/components/AdminActions";
export default function AdminContentList() {
  const [items, setItems] = useState<{id:string;name:string;type:string;status:string;featured:boolean;creator:{username:string};createdAt:string}[]>([]);
  useEffect(() => {
    fetch("/api/content?limit=200").then(async (r) => {
      try { setItems(await r.json()); } catch { setItems([]); }
    });
  }, []);
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>المحتوى</th><th>النوع</th><th>الناشر</th><th>الحالة</th><th>تاريخ الإضافة</th><th>إجراءات</th></tr></thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.type === "PROFILE" ? "بروفايل" : "خلفية"}</td>
              <td>{i.creator?.username || "-"}</td>
              <td>{i.status === "PENDING" ? "قيد المراجعة" : i.status === "PUBLISHED" ? "منشور" : "مرفوض"}</td>
              <td>{new Date(i.createdAt).toLocaleDateString("ar")}</td>
              <td><AdminActions id={i.id} status={i.status} featured={i.featured} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
