"use client";
import { useEffect, useState } from "react";
import { AdminActions } from "@/components/AdminActions";
export default function AdminModeration() {
  const [pending, setPending] = useState<any[]>([]);
  const [reported, setReported] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/content?limit=200").then(async (r) => {
      try {
        const items = await r.json();
        setPending(items.filter((i: any) => i.status === "PENDING"));
        setReported(items.filter((i: any) => i.status === "PUBLISHED"));
      } catch { setPending([]); setReported([]); }
    });
  }, []);
  return (
    <div className="card">
      <div className="card-body">
        <h2>إدارة المحتوى والمراجعة</h2>
        <div className="tabs" style={{marginBottom:16}}>
          <button className={"pill"+(true?" on":"")} style={{cursor:"default"}}>بانتظار المراجعة ({pending.length})</button>
          <button className={"pill"+(false?" on":"")} style={{cursor:"default"}}>المبلغ عنها ({reported.length})</button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>المحتوى</th><th>النوع</th><th>الناشر</th><th>الحالة</th><th>تاريخ الإضافة</th><th>إجراء</th></tr></thead>
            <tbody>
              {[...pending, ...reported].map((i: any) => (
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
      </div>
    </div>
  );
}
