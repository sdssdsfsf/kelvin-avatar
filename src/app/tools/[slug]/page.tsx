import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTool, tools } from "@/lib/tools";
import { toolsCss } from "@/lib/toolsCss";
import { AvatarCrop, BannerCrop, BgRemover, EmojiColor, EmojiMaker, ImageConverter, RoundedBorder } from "@/components/tools/ImageTools";
import { ColorConverter, GradientTool, PaletteTool } from "@/components/tools/ColorTools";
import { FancyText, FormatterTool, TimestampTool, SnowflakeTool } from "@/components/tools/TextTools";
import { TextCaseTool, PasswordGeneratorTool, BoxShadowTool, BorderRadiusTool, CssButtonTool } from "@/components/tools/ColorTools";
import { PhotoEnhancerTool, RotateTool, FlipTool, GrayscaleTool, SepiaTool, InvertTool, BlurTool, PixelateTool, CircleCropTool, WatermarkTool, BorderTool, ShadowTool, VignetteTool } from "@/components/tools/ImageTools";

const registry: Record<string, ComponentType> = {
  "emoji-color": EmojiColor,
  "bg-remover": BgRemover,
  "emoji-maker": EmojiMaker,
  "avatar-crop": AvatarCrop,
  "banner-crop": BannerCrop,
  "image-converter": ImageConverter,
  "rounded-border": RoundedBorder,
  palette: PaletteTool,
  gradient: GradientTool,
  "color-converter": ColorConverter,
  "fancy-text": FancyText,
  "discord-format": FormatterTool,
  timestamp: TimestampTool,
  snowflake: SnowflakeTool,
  "text-case": TextCaseTool,
  "password-generator": PasswordGeneratorTool,
  "box-shadow": BoxShadowTool,
  "border-radius": BorderRadiusTool,
  "css-button": CssButtonTool,
  "photo-enhancer": PhotoEnhancerTool,
  "image-rotate": RotateTool,
  "image-flip": FlipTool,
  "image-grayscale": GrayscaleTool,
  "image-sepia": SepiaTool,
  "image-invert": InvertTool,
  "image-blur": BlurTool,
  "image-pixelate": PixelateTool,
  "image-circle-crop": CircleCropTool,
  "image-watermark": WatermarkTool,
  "image-border": BorderTool,
  "image-shadow": ShadowTool,
  "image-vignette": VignetteTool,
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTool(slug);
  return { title: t ? `${t.title} | ادوات` : "ادوات" };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Tool = registry[slug];
  if (!tool || !Tool) notFound();

  return (
    <main className="page container">
      <style dangerouslySetInnerHTML={{ __html: toolsCss }} />
      <Link href="/tools" className="tl-back">→ كل الأدوات</Link>
      <div className="tl-head">
        <div className="tl-ic">{tool.icon}</div>
        <div>
          <h1>{tool.title}</h1>
          <p>{tool.desc}</p>
        </div>
      </div>
      <Tool />
    </main>
  );
}
