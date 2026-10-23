import { tools } from "@/lib/tools";
import { toolsCss } from "@/lib/toolsCss";
import { ToolsGrid } from "@/components/tools/ToolsGrid";

export const metadata = { title: "ادوات" };

export default function ToolsPage() {
  return (
    <main className="page container">
      <style dangerouslySetInnerHTML={{ __html: toolsCss }} />
      <section className="tl-hero">
        <h1>ادوات</h1>
        <p>مجموعة أدوات جاهزة لتجهيز صورك وبروفايلك: تحسين جودة الصور، إضافة إطارات، تغيير الألوان، إزالة الخلفيات، والمزيد.</p>
        <div className="tl-badges">
          <span>{tools.length} أداة</span>
          <span>مجانية</span>
          <span>تعمل داخل متصفحك، صورك لا تُرفع لأي سيرفر</span>
        </div>
      </section>
      <ToolsGrid tools={tools} />
    </main>
  );
}
