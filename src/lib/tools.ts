export type ToolMeta = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
  category: "images" | "colors" | "text";
};

export const categories = [
  { id: "all", label: "الكل" },
  { id: "images", label: "الصور والإيموجي" },
  { id: "colors", label: "الألوان" },
  { id: "text", label: "النصوص" },
] as const;

export const tools: ToolMeta[] = [
  { slug: "emoji-color", title: "تغيير لون الإيموجي", desc: "غيّر لون أي إيموجي أو صورة بسرعة: إزاحة الدرجة أو تلوين كامل مع التحكم بالإشباع والإضاءة.", icon: "🎨", category: "images" },
  { slug: "bg-remover", title: "إزالة الخلفية", desc: "احذف الخلفية الموحّدة من الصورة واحصل على PNG شفاف، مع التحكم بالحساسية ونعومة الحواف.", icon: "✂️", category: "images" },
  { slug: "emoji-maker", title: "صانع الإيموجي والستيكر", desc: "حوّل أي صورة إلى إيموجي أو ستيكر بالمقاس الصحيح، مع قص دائري وحجم الملف.", icon: "😀", category: "images" },
  { slug: "avatar-crop", title: "قص الأفاتار", desc: "اقتطع صورة البروفايل بشكل مربع أو دائري بجودة عالية.", icon: "👤", category: "images" },
  { slug: "banner-crop", title: "قص البنر", desc: "اقتطع بنر البروفايل بالنسبة المناسبة لديسكورد مع تحكم بالتكبير والموضع.", icon: "🖼️", category: "images" },
  { slug: "image-converter", title: "تحويل وضغط الصور", desc: "حوّل بين PNG وJPG وWEBP، قلّل الحجم، غيّر المقاس، أو دوّر واقلب الصورة.", icon: "🔄", category: "images" },
  { slug: "rounded-border", title: "حواف دائرية وإطار", desc: "أضف حواف مدوّرة وإطاراً ملوّناً لأي صورة.", icon: "⭕", category: "images" },
  { slug: "palette", title: "ألوان الصورة", desc: "استخرج أبرز الألوان من أي صورة والتقط لوناً بالضغط على الصورة.", icon: "🎯", category: "colors" },
  { slug: "gradient", title: "صانع التدرجات", desc: "اصنع تدرجاً لونياً، انسخ كود CSS أو نزّله كصورة بمقاس البنر أو الخلفية.", icon: "🎨", category: "colors" },
  { slug: "color-converter", title: "محوّل الألوان", desc: "حوّل بين HEX وRGB وHSL، مع رقم اللون العشري المستخدم في إيمبد ديسكورد.", icon: "🧪", category: "colors" },
  { slug: "fancy-text", title: "زخرفة الخطوط", desc: "حوّل نصك الإنجليزي إلى عشرات الأشكال المزخرفة وانسخها مباشرة.", icon: "✨", category: "text" },
  { slug: "discord-format", title: "منسّق نصوص ديسكورد", desc: "عريض، مائل، سبويلر، اقتباس وعناوين مع معاينة مباشرة.", icon: "📝", category: "text" },
  { slug: "timestamp", title: "مولّد التوقيت", desc: "أنشئ أكواد التوقيت التي تظهر بتوقيت كل شخص في ديسكورد.", icon: "🕒", category: "text" },
  { slug: "text-case", title: "تحويل حالة النص", desc: "حوّل نصك إلى أحرف كبيرة، صغيرة، عنوان، جملة، كاميل، سنيك، كيباب أو معكوس.", icon: "🔤", category: "text" },
  { slug: "password-generator", title: "مولّد كلمات المرور", desc: "أنشئ كلمات مرور آمنة وقوية بطول وخيارات مخصّصة، وتُولّد محلياً في متصفحك.", icon: "🔐", category: "text" },
  { slug: "box-shadow", title: "مولّد ظلال CSS", desc: "اصنع ظلالاً احترافية لعناصرك وانسخ كود CSS مباشرة مع معاينة مباشرة.", icon: "🌫️", category: "colors" },
  { slug: "border-radius", title: "مولّد الحواف المدوّرة", desc: "تحكم بكل زاوية على حدة وانسخ كود border-radius مع معاينة حية.", icon: "◻️", category: "colors" },
  { slug: "css-button", title: "صانع أزرار CSS", desc: "اصنع أزراراً أنيقة لديسكورد أو موقعك وانسخ كود CSS كاملاً.", icon: "🔘", category: "colors" },
  { slug: "image-resizer", title: "تغيير حجم الصور", desc: "غيّر أبعاد أي صورة إلى أي مقاس تريده مع الحفاظ على الجودة.", icon: "📏", category: "images" },
  { slug: "color-picker", title: "م wybor الألوان", desc: "اختر أي لون من الشاشة واحصل على كوده بصيغ متعددة.", icon: "🖌️", category: "colors" },
  { slug: "image-compressor", title: "ضغط الصور", desc: "قلّل حجم صورك بدون فقدان الجودة 분명ًا.", icon: "📦", category: "images" },
  { slug: "text-to-ascii", title: "تحويل نص إلى ASCII", desc: "حوّل نصوصك إلى فن ASCII أنيق للبروفايلات.", icon: "🔠", category: "text" },
  { slug: "discord-status", title: "مولّد حالات ديسكورد", desc: "أنشئ حالات مخصصة وأنيقة لديسكورد مع أيقونات.", icon: "💬", category: "text" },
  { slug: "discord-invite", title: "صانع روابط الدعوة", desc: "حوّل كود الدعوة إلى رابط ديسكورد كامل.", icon: "🔗", category: "text" },
  { slug: "discord-mention", title: "منشئ المنشن", desc: "أنشئ أكواد منشن ديسكورد للمستخدمين والرتب والقنوات.", icon: "📣", category: "text" },
  { slug: "photo-enhancer", title: "صانع تحسين الصور", desc: "حسّن جودة الصور، أضف إطارات و limites، وغيّر السطوع والتشبع لتحسين المظهر.", icon: "✨", category: "images" },
  { slug: "image-rotate", title: "تدوير الصور", desc: "دوّر أي صورة بأي زاوية.", icon: "🔄", category: "images" },
  { slug: "image-flip", title: "عكس الصور", desc: "عكس الصورة أفقياً أو رأسياً.", icon: "🔁", category: "images" },
  { slug: "image-grayscale", title: "تدرج رمادي", desc: "حوّل الصورة إلى الأبيض والأسود.", icon: "⚪", category: "images" },
  { slug: "image-sepia", title: "سيبيا", desc: "أضف لمسة سيبيا قديمة للصورة.", icon: "🟤", category: "images" },
  { slug: "image-invert", title: "عكس الألوان", desc: "عكس ألوان الصورة إلى سلبي.", icon: "📸", category: "images" },
  { slug: "image-blur", title: "طمس الصور", desc: "أضف تأثير طمس (Blur) مع التحكم بالقوة.", icon: "🌫️", category: "images" },
  { slug: "image-pixelate", title: "تبيكسل الصور", desc: "حوّل الصورة إلى بكسلات كبيرة.", icon: "🧊", category: "images" },
  { slug: "image-circle-crop", title: "قص دائري", desc: "اقتطع الجزء الدائري من الصورة.", icon: "⭕", category: "images" },
  { slug: "image-watermark", title: "علامة مائية", desc: "أضف نصاً كعلامة مائية في وسط الصورة.", icon: "🏷️", category: "images" },
  { slug: "image-border", title: "إطار ملون", desc: "أضف إطاراً ملوناً حول الصورة.", icon: "🖼️", category: "images" },
  { slug: "image-shadow", title: "إضافة ظل", desc: "أضف ظلاً ناعماً للصورة.", icon: "🌫️", category: "images" },
  { slug: "image-vignette", title: "تغميق الأطراف", desc: "أضف تظليلاً على أطراف الصورة.", icon: "🌑", category: "images" },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
