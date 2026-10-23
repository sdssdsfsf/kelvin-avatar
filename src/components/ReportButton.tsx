"use client";
import { useState } from "react";
export function ReportButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  if (done) return <div className="tick-box"><div className="tick">✔</div><p>تم الإبلاغ عن المحتوى.</p></div>;
  return (
    <>
      <button className="btn secondary" onClick={() => setOpen(true)} style={{fontSize:13,padding:"6px 12px"}}>إبلاغ</button>
      {open && (
        <div className="tick-overlay"><div className="tick-box">
          <div className="tick">!</div><p>الإبلاغ عن المحتوى</p>
          <div className="field" style={{marginTop:10}}><label>السبب</label><select className="tl-in" value={reason} onChange={e=>setReason(e.target.value)}><option value="محتوى غير لائق">محتوى غير لائق</option><option value="حماية الملكية الفكرية">حماية الملكية الفكرية</option><option value="محتوى مزعج">محتوى مزعج</option><option value="آخر">آخر</option></select></div>
          <div className="field" style={{marginTop:10}}><label>تفاصيل إضافية</label><textarea className="tl-in" rows={2} value={details} onChange={e=>setDetails(e.target.value)} placeholder="أضف تفاصيل..."/></div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button className="btn secondary" onClick={()=>setOpen(false)}>إلغاء</button>
            <button className="btn" onClick={async ()=>{
              const r = await fetch(`/api/content/${id}/report`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ reason, details }) });
              if (r.ok) setDone(true);
            }}>إرسال البلاغ</button>
          </div>
        </div></div>
      )}
    </>
  );
}
