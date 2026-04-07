export type BlogLocale = "ar" | "en";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImage: string;
  gallery: string[];
  author: string;
  publishedAt: string;
}

export interface BlogSection {
  badge: string;
  title: string;
  subtitle: string;
  galleryLabel: string;
  readMoreLabel: string;
  backHomeLabel: string;
  emptyMessage: string;
  publishedLabel: string;
  backToBlogsLabel: string;
  posts: BlogPost[];
}

const DEFAULT_BLOG_SECTION: Record<BlogLocale, Omit<BlogSection, "posts">> = {
  ar: {
    badge: "المدونة",
    title: "مقالاتنا",
    subtitle: "تابع أحدث المقالات والنصائح المتعلقة بخدمات الضيافة وتنظيم المناسبات.",
    galleryLabel: "المعرض",
    readMoreLabel: "اقرأ المزيد",
    backHomeLabel: "العودة للرئيسية",
    emptyMessage: "لا توجد مقالات منشورة حالياً.",
    publishedLabel: "تاريخ النشر",
    backToBlogsLabel: "العودة للمدونة",
  },
  en: {
    badge: "Blog",
    title: "Our Blog",
    subtitle: "Read the latest articles and tips about hospitality and premium event services.",
    galleryLabel: "Gallery",
    readMoreLabel: "Read More",
    backHomeLabel: "Back To Home",
    emptyMessage: "No published articles yet.",
    publishedLabel: "Published",
    backToBlogsLabel: "Back To Blog",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeGallery(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePost(value: unknown): BlogPost {
  const input = isRecord(value) ? value : {};

  return {
    slug: asString(input.slug),
    title: asString(input.title),
    excerpt: asString(input.excerpt),
    contentHtml: asString(input.contentHtml),
    coverImage: asString(input.coverImage),
    gallery: normalizeGallery(input.gallery),
    author: asString(input.author),
    publishedAt: asString(input.publishedAt),
  };
}

export function getBlogSection(dictionary: Record<string, unknown>, locale: BlogLocale): BlogSection {
  const defaults = DEFAULT_BLOG_SECTION[locale];
  const blogsNode = isRecord(dictionary.blogs) ? dictionary.blogs : {};
  const postsRaw = Array.isArray(blogsNode.posts) ? blogsNode.posts : [];

  return {
    badge: asString(blogsNode.badge, defaults.badge),
    title: asString(blogsNode.title, defaults.title),
    subtitle: asString(blogsNode.subtitle, defaults.subtitle),
    galleryLabel: asString(blogsNode.galleryLabel, defaults.galleryLabel),
    readMoreLabel: asString(blogsNode.readMoreLabel, defaults.readMoreLabel),
    backHomeLabel: asString(blogsNode.backHomeLabel, defaults.backHomeLabel),
    emptyMessage: asString(blogsNode.emptyMessage, defaults.emptyMessage),
    publishedLabel: asString(blogsNode.publishedLabel, defaults.publishedLabel),
    backToBlogsLabel: asString(blogsNode.backToBlogsLabel, defaults.backToBlogsLabel),
    posts: postsRaw.map(normalizePost),
  };
}

export function buildBlogSection(locale: BlogLocale, posts: BlogPost[]): BlogSection {
  const defaults = DEFAULT_BLOG_SECTION[locale];

  return {
    ...defaults,
    posts,
  };
}

export function toBlogSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sanitizeBlogHtml(html: string): string {
  if (!html) {
    return "";
  }

  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\son\w+=\S+/gi, "")
    .replace(/href=(["'])javascript:[\s\S]*?\1/gi, "href=\"#\"");
}

export function stripBlogHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatBlogDate(value: string, locale: BlogLocale): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
