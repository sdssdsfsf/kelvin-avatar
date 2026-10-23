"use client";
import { useEffect, useState } from "react";
export default function AdminUsers() {
  const [users, setUsers] = useState<{id:string;username:string;role:string;suspended:boolean;createdAt:string}[]>([]);
  useEffect(() => {
    fetch("/api/users").then(async (r) => {
      try { setUsers(await r.json()); } catch { setUsers([]); }
    });
  }, []);
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>اسم المستخدم</th><th>الدور</th><th>الحالة</th><th>تاريخ التسجيل</th><th>إجراء</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role === "ADMIN" ? "مدير" : "مستخدم"}</td>
              <td>{u.suspended ? "موقوف" : "نشط"}</td>
              <td>{new Date(u.createdAt).toLocaleDateString("ar")}</td>
              <td>{u.role !== "ADMIN" && <AdminUserAction id={u.id} suspended={u.suspended} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function AdminUserAction({ id, suspended }: { id: string; suspended: boolean }) {
  const [busy, setBusy] = useState(false);
  async function act() {
    if (!confirm("هل أنت متأكد من تنفيذ هذا الإجراء؟")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: suspended ? "unsuspend" : "suspend" }),
      });
      if (!r.ok) throw new Error("فشل");
      setBusy(false);
      window.location.reload();
    } catch { setBusy(false); alert("تعذر تنفيذ الإجراء."); }
  }
  return (
    <button className="btn secondary" disabled={busy} onClick={act}>{suspended ? "إعادة التفعيل" : "إيقاف"}</button>
  );
}
