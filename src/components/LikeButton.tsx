"use client";
import { useState } from "react";
export function LikeButton({id, liked=false, likes=0}:{id:string;liked?:boolean;likes?:number}) {
  const [myLiked, setMyLiked] = useState(liked);
  const [myLikes, setMyLikes] = useState(likes);
  async function toggleLike() {
    try {
      const r = await fetch(`/api/content/${id}/like`, { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "فشل");
      setMyLiked(!!d.liked);
      setMyLikes(typeof d.likes === "number" ? d.likes : myLikes + (d.liked ? 1 : -1));
    } catch { alert("تعذر الإعجاب بالمحتوى."); }
  }
  return (
    <button className="like-btn" onClick={toggleLike} style={{display:"inline-flex",alignItems:"center",gap:8,background:myLiked?"#c084fc":"transparent",color:myLiked?"#fff":"#c084fc",border:"2px solid #c084fc",borderRadius:14,padding:8,fontWeight:900,cursor:"pointer",transition:"transform .2s",transform:myLiked?"scale(1.05)":"scale(1)"}}>
      {myLiked?"❤":"♡"} <span>إعجاب ({myLikes})</span>
    </button>
  );
}
