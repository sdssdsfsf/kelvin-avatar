"use client";
import { useEffect, useState } from "react";
export default function AdminStats() {
  const [data, setData] = useState<{users:number;contents:number;likes:number;downloads:number;searches:{query:string;_count:{query:number}}[];registrationsByDay:{createdAt:Date;_count:{id:number}}[];topContent:{id:string;name:string;type:string;username:string;likes:number;views:number;downloads:number}[]}|null>(null);
  useEffect(() => {
    fetch("/api/admin/stats").then(async (r) => {
      try { setData(await r.json()); } catch { setData(null); }
    });
  }, []);
  if (!data) return <div className="empty">جارٍ تحميل الإحصائيات…</div>;
  return (
    <>
      <div className="grid" style={{marginBottom:28}}>
        {[
          ["المستخدمون", data.users],
          ["المحتوى المنشور", data.contents],
          ["إجمالي الإعجابات", data.likes],
          ["إجمالي التنزيلات", data.downloads],
        ].map(([label, value]) => (
          <div className="card" key={label}>
            <div className="card-body">
              <div className="muted">{label}</div>
              <div style={{fontSize:30,fontWeight:800,color:"var(--purple)"}}>{value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="section-head"><div><h2>أكثر المحتوياتpopularity</h2><p>الأكثر مشاهدة وتنزيلاً وإعجاباً.</p></div></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>المحتوى</th><th>النوع</th><th>الناشر</th><th>الإعجابات</th><th>المشاهدات</th><th>التنزيلات</th></tr></thead>
          <tbody>
            {data.topContent.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.type === "PROFILE" ? "بروفايل" : "خلفية"}</td>
                <td>{c.username}</td>
                <td>{c.likes}</td>
                <td>{c.views}</td>
                <td>{c.downloads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-head" style={{marginTop:30}}><div><h2>أكثر عمليات البحث</h2><p>الكلمات التي يبحث عنها المستخدمون.</p></div></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>البحث</th><th>عدد المرات</th></tr></thead>
          <tbody>
            {data.searches.map((s) => (
              <tr key={s.query}><td>{s.query}</td><td>{s._count.query}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-head" style={{marginTop:30}}><div><h2>التسجيلات الحديثة</h2><p>المستخدمين الجدد حسب اليوم.</p></div></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>التاريخ</th><th>عدد التسجيلات</th></tr></thead>
          <tbody>
            {data.registrationsByDay.map((r) => (
              <tr key={new Date(r.createdAt).getTime()}><td>{new Date(r.createdAt).toLocaleDateString("ar")}</td><td>{r._count.id}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
