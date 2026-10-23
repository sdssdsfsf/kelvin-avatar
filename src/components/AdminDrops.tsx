"use client";
import { useEffect, useState } from "react";
export default function AdminDrops() {
  const [items, setItems] = useState<{id:string;title:string;imageUrl?:string|null;contentId?:string|null;active:boolean;createdAt:string}[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contentId, setContentId] = useState("");
  const [active, setActive] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    const r = await fetch("/api/admin/drops");
    setItems(await r.json());
  }
  async function create() {
    if (!title) return alert("العنوان مطلوب.");
    await fetch("/api/admin/drops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, imageUrl, contentId, active }) });
    setTitle(""); setImageUrl(""); setContentId(""); load();
  }
  async function toggle(id: string, cur: boolean) {
    await fetch("/api/admin/drops", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active: !cur }) });
    load();
  }
  async function del(id: string) {
    if (!confirm("حذف الإسقاط؟")) return;
    await fetch("/api/admin/drops", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }
  return (
    <div className="card">
      <div className="card-body">
        <h2>إدارة الإسقاطات اليومية</h2>
        <p className="muted" style={{marginBottom:14}}>الإسقاطات تظهر محتوى مميزًا في صفحة الأدوات والموقع.</p>
        <div className="field" style={{marginBottom:14}}>
          <label>عنوان الإسقاط</label><input className="tl-in" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="عنوان الإسقاط"/>
        </div>
        <div className="field" style={{marginBottom:14}}>
          <label>رابط الصورة (اختياري)</label><input className="tl-in" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="https://…"/>
        </div>
        <div className="field" style={{marginBottom:14}}>
          <label>معرف المحتوى المرتبط (اختياري)</label><input className="tl-in" value={contentId} onChange={(e)=>setContentId(e.target.value)} placeholder="معرف المحتوى"/>
        </div>
        <div className="field" style={{marginBottom:14}}>
          <label>نشط</label><select className="tl-in" value={active?"true":"false"} onChange={(e)=>setActive(e.target.value==="true")}><option value="true">نعم</option><option value="false">لا</option></select>
        </div>
        <button className="btn" onClick={create} style={{width:"auto"}}>إضافة إسقاط</button>
        <div className="section-head" style={{marginTop:24}}><div><h2>قائمة الإسقاطات</h2></div></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>العنوان</th><th>الصورة</th><th>المحتوى المرتبط</th><th>الحالة</th><th>تاريخ الإنشاء</th><th>إجراءات</th></tr></thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.imageUrl || "-"}</td>
                  <td>{d.contentId || "-"}</td>
                  <td>{d.active ? "نشط" : "موقف"}</td>
                  <td>{new Date(d.createdAt).toLocaleDateString("ar")}</td>
                  <td>
                    <button className="btn secondary" onClick={()=>toggle(d.id,d.active)} style={{marginRight:6}}>{d.active ? "إيقاف" : "تفعيل"}</button>
                    <button className="btn secondary" onClick={()=>del(d.id)}>حذف</button>
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
