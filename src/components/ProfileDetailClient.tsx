"use client";
import { useEffect, useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { LikeButton } from "@/components/LikeButton";
import { ReportButton } from "@/components/ReportButton";
export default function ProfileDetailClient({ id, name, avatarKey, bannerKey, creator, createdAt, views, downloads }: { id: string; name: string; avatarKey?: string | null; bannerKey?: string | null; creator: { username: string }; createdAt: Date; views: number; downloads: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [myLike, setMyLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    fetch(`/api/content/${id}/comments`).then(async (r) => { try { setComments(await r.json()); } catch { setComments([]); } });
  }, [id]);
  async function addComment() {
    if (!newComment.trim()) return;
    const r = await fetch(`/api/content/${id}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: newComment }) });
    if (r.ok) { const c = await r.json(); setComments([c, ...comments]); setNewComment(""); }
  }
  return (
    <div className="page container" style={{marginTop:50}}>
      <div className="page-title"><span className="eyebrow">بروفايل ديسكورد</span><h1>{name}</h1><p>بواسطة {creator.username}</p></div>
      <div className="stats"><span>تاريخ الإضافة: {new Date(createdAt).toLocaleDateString("ar")}</span><span>◉ {views+1} مشاهدة</span><span>↓ {downloads} تنزيل</span></div>
      <p>حمّل صور البروفايل الأصلية كلٌّ على حدة.</p>
      <div className="content-actions" style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        {(avatarKey||bannerKey) ? <DownloadButton id={id} kinds={['avatar','banner']} label="تحميل البروفايل كاملاً"/> : null}
        <LikeButton id={id} />
        <ReportButton id={id} />
      </div>
      <div className="card" style={{marginTop:24,padding:16}}>
        <h3 style={{margin:0,marginBottom:12,fontWeight:800}}>التعليقات</h3>
        {comments.length === 0 && <p className="muted">لا توجد تعليقات بعد.</p>}
        {comments.map((c) => (
          <div key={c.id} className="muted" style={{marginBottom:10,padding:8,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
            <strong>{c.user.username}</strong>: {c.text}
          </div>
        ))}
        <div className="field" style={{marginTop:12}}>
          <input className="tl-in" value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليقاً..." />
          <button className="btn" onClick={addComment} style={{marginTop:8}}>إرسال</button>
        </div>
      </div>
    </div>
  );
}
