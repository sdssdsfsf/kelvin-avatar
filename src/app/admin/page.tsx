"use client";
import { useSearchParams, useRouter } from "next/navigation";
import AdminContentList from "@/components/AdminContentList";
import AdminUsers from "@/components/AdminUsers";
import AdminStats from "@/components/AdminStats";
import AdminAnnouncements from "@/components/AdminAnnouncements";
import AdminDrops from "@/components/AdminDrops";
import AdminModeration from "@/components/AdminModeration";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get("tab") || "content") as string;

  return (
    <main className="page container">
      <div className="page-title"><h1>لوحة تحكم الإدارة</h1><p>إدارة المحتوى والمستخدمين — صلاحيات المالك فقط.</p></div>
      <div className="tabs" style={{marginBottom:24}}>
        <button className={"pill"+(tab==="content"?" on":"")} onClick={()=>router.push("?tab=content")}>إدارة المحتوى</button>
        <button className={"pill"+(tab==="users"?" on":"")} onClick={()=>router.push("?tab=users")}>المستخدمون</button>
        <button className={"pill"+(tab==="stats"?" on":"")} onClick={()=>router.push("?tab=stats")}>الإحصائيات</button>
        <button className={"pill"+(tab==="announcements"?" on":"")} onClick={()=>router.push("?tab=announcements")}>الإعلانات</button>
        <button className={"pill"+(tab==="drops"?" on":"")} onClick={()=>router.push("?tab=drops")}>الإسقاطات اليومية</button>
        <button className={"pill"+(tab==="moderation"?" on":"")} onClick={()=>router.push("?tab=moderation")}>المراجعة والإشراف</button>
      </div>
      {tab==="content" && <AdminContentSection/>}
      {tab==="users" && <AdminUsersSection/>}
      {tab==="stats" && <AdminStats/>}
      {tab==="announcements" && <AdminAnnouncements/>}
      {tab==="drops" && <AdminDrops/>}
      {tab==="moderation" && <AdminModeration/>}
    </main>
  );
}

function AdminContentSection(){
  return <div><h2>إدارة المحتوى</h2><AdminContentList/></div>;
}
function AdminUsersSection(){
  return <div><h2>المستخدمون</h2><AdminUsers/></div>;
}
