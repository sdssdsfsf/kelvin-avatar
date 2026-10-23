import Link from "next/link";
export default function NotFound(){return <main className="page container" style={{textAlign:"center"}}><div style={{fontSize:70,color:"var(--purple)",fontWeight:800}}>404</div><h1>الصفحة غير موجودة</h1><p className="muted">قد يكون الرابط غير صحيح أو أن المحتوى لم يعد متاحاً.</p><Link className="btn" href="/">العودة للرئيسية</Link></main>}
