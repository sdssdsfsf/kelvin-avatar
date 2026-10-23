"use client";
import { useEffect, useState } from "react";
export default function AdminAnnouncements() {
  const [items, setItems] = useState<{id:string;title:string;body:string;active:boolean;createdAt:string}[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    const r = await fetch("/api/admin/announcements");
    setItems(await r.json());
  }
  async function create() {
    if (!title || !body) return alert("املأ العنوان والنص.");
    await fetch("/api/admin/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body, active }) });
    setTitle(""); setBody(""); load();
  }
  async function toggle(id: string, cur: boolean) {
    await fetch("/api/admin/announcements", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active: !cur }) });
    load();
  }
  async function del(id: string) {
    if (!confirm("حذف الإعلان؟")) return;
    await fetch("/api/admin/announcements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }
  return (
    <div className="card">
      <div className="card-body">
        <h2>إدارة الإعلانات</h2>
        <div className="field" style={{marginBottom:14}}>
          <label>عنوان الإعلان</label><input className="tl-in" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="عنوان الإعلان"/>
        </div>
        <div className="field" style={{marginBottom:14}}>
          <label>نص الإعلان</label><textarea className="tl-in" rows={3} value={body} onChange={(e)=>setBody(e.target.value)} placeholder="اكتب نص الإعلان…"/></div>
        <div className="field" style={{marginBottom:14}}>
          <label>نشط</label><select className="tl-in" value={active?"true":"false"} onChange={(e)=>setActive(e.target.value==="true")}><option value="true">نعم</option><option value="false">لا</option></select>
        </div>
        <button className="btn" onClick={create} style={{width:"auto"}}>إضافة إعلان</button>
        <div className="section-head" style={{marginTop:24}}><div><h2>قائمة الإعلانات</h2></div></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>العنوان</th><th>النص</th><th>الحالة</th><th>تاريخ الإنشاء</th><th>إجراءات</th></tr></thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td style={{maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.body}</td>
                  <td>{a.active ? "نشط" : "موقف"}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString("ar")}</td>
                  <td>
                    <button className="btn secondary" onClick={()=>toggle(a.id,a.active)} style={{marginRight:6}}>{a.active ? "إيقاف" : "تفعيل"}</button>
                    <button className="btn secondary" onClick={()=>del(a.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
