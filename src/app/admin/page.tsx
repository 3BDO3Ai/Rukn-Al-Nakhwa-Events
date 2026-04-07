"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { announceContentUpdated, BilingualContent } from "@/content/useContent";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type Path = Array<string | number>;
type Locale = "ar" | "en";
type LocaleRoot = Record<string, JsonValue>;
type SectionKey = "overview" | "services" | "gallery" | "partners" | "reviews" | "search";

type NewEntryKind = "string" | "number" | "boolean" | "object" | "array";

interface SearchResult {
  locale: Locale;
  path: string;
  value: string;
}

interface ServicePackage {
  title: string;
  price: string;
  featured?: boolean;
  items: string[];
  whatsappMessage?: string;
}

interface PartnerLogo {
  src: string;
  alt: string;
}

interface ReviewItem {
  name: string;
  rating: number;
  text: string;
}

type GalleryMediaType = "image" | "video";

interface GalleryItem {
  src: string;
  fileName: string;
  type: GalleryMediaType;
  title: string;
  description: string;
  thumbnail?: string;
}

interface NewServiceDraft {
  titleAr: string;
  titleEn: string;
  price: string;
  featured: boolean;
  whatsappAr: string;
  whatsappEn: string;
  firstItemAr: string;
  firstItemEn: string;
}

interface NewPartnerDraft {
  src: string;
  altAr: string;
  altEn: string;
}

interface NewGalleryDraft {
  src: string;
  fileName: string;
  type: GalleryMediaType;
  thumbnail: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

const EMPTY_NEW_SERVICE: NewServiceDraft = {
  titleAr: "",
  titleEn: "",
  price: "",
  featured: false,
  whatsappAr: "",
  whatsappEn: "",
  firstItemAr: "",
  firstItemEn: "",
};

const EMPTY_NEW_PARTNER: NewPartnerDraft = {
  src: "",
  altAr: "",
  altEn: "",
};

const EMPTY_NEW_GALLERY: NewGalleryDraft = {
  src: "",
  fileName: "",
  type: "image",
  thumbnail: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
};

interface AdminText {
  title: string;
  subtitle: string;
  uiLanguage: string;
  contentLanguage: string;
  reload: string;
  reloadLoading: string;
  save: string;
  saveLoading: string;
  statusDefault: string;
  sidebarTitle: string;
  searchPlaceholder: string;
  searchHint: string;
  searchResults: string;
  noSearchResults: string;
  sectionLabels: Record<SectionKey, string>;
  overviewCards: {
    services: string;
    gallery: string;
    partners: string;
    reviews: string;
    keys: string;
  };
  quick: {
    addService: string;
    addGallery: string;
    addPartner: string;
    addReview: string;
    syncGallery: string;
    syncingGallery: string;
    upload: string;
    delete: string;
    up: string;
    down: string;
    items: string;
    addItem: string;
  };
}

const ADMIN_TEXTS: Record<Locale, AdminText> = {
  en: {
    title: "Site Management Dashboard",
    subtitle: "Manage all website sections, media, and dictionaries from one professional control panel.",
    uiLanguage: "Admin UI",
    contentLanguage: "Content Locale",
    reload: "Reload",
    reloadLoading: "Loading...",
    save: "Save & Publish",
    saveLoading: "Saving...",
    statusDefault: "Use the sidebar to manage each section, then save to publish live.",
    sidebarTitle: "Management Sections",
    searchPlaceholder: "Search all content in Arabic and English...",
    searchHint: "Search scans both locale dictionaries and values.",
    searchResults: "Search Results",
    noSearchResults: "No matches found.",
    sectionLabels: {
      overview: "Overview",
      services: "Services Manager",
      gallery: "Gallery Manager",
      partners: "Partners Manager",
      reviews: "Reviews Manager",
      search: "Global Search",
    },
    overviewCards: {
      services: "Services",
      gallery: "Gallery",
      partners: "Partners",
      reviews: "Reviews",
      keys: "Top-level Keys",
    },
    quick: {
      addService: "Add service",
      addGallery: "Add gallery item",
      addPartner: "Add partner",
      addReview: "Add review",
      syncGallery: "Sync from public/Gallery",
      syncingGallery: "Syncing gallery files...",
      upload: "Upload",
      delete: "Delete",
      up: "Up",
      down: "Down",
      items: "Items",
      addItem: "Add item",
    },
  },
  ar: {
    title: "لوحة إدارة الموقع",
    subtitle: "إدارة جميع أقسام الموقع والوسائط والقواميس من لوحة تحكم احترافية واحدة.",
    uiLanguage: "لغة لوحة التحكم",
    contentLanguage: "لغة المحتوى",
    reload: "إعادة تحميل",
    reloadLoading: "جارٍ التحميل...",
    save: "حفظ ونشر",
    saveLoading: "جارٍ الحفظ...",
    statusDefault: "استخدم الشريط الجانبي لإدارة كل قسم ثم احفظ لنشر التغييرات مباشرة.",
    sidebarTitle: "أقسام الإدارة",
    searchPlaceholder: "ابحث في كل محتوى الموقع بالعربية والإنجليزية...",
    searchHint: "البحث يشمل القيم والمفاتيح في اللغتين.",
    searchResults: "نتائج البحث",
    noSearchResults: "لا توجد نتائج مطابقة.",
    sectionLabels: {
      overview: "نظرة عامة",
      services: "إدارة الخدمات",
      gallery: "إدارة المعرض",
      partners: "إدارة الشركاء",
      reviews: "إدارة التقييمات",
      search: "بحث شامل",
    },
    overviewCards: {
      services: "الخدمات",
      gallery: "المعرض",
      partners: "الشركاء",
      reviews: "التقييمات",
      keys: "المفاتيح الرئيسية",
    },
    quick: {
      addService: "إضافة خدمة",
      addGallery: "إضافة عنصر للمعرض",
      addPartner: "إضافة شريك",
      addReview: "إضافة تقييم",
      syncGallery: "مزامنة من public/Gallery",
      syncingGallery: "جارٍ مزامنة ملفات المعرض...",
      upload: "رفع",
      delete: "حذف",
      up: "أعلى",
      down: "أسفل",
      items: "العناصر",
      addItem: "إضافة عنصر",
    },
  },
};

const EMPTY_CONTENT: BilingualContent = { ar: {}, en: {} };

const CONTENT_SECTION_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    about: "About",
    common: "Common",
    footer: "Footer",
    gallery: "Gallery",
    hero: "Hero",
    location: "Location",
    navbar: "Navbar",
    partners: "Partners",
    reviews: "Reviews",
    services: "Services",
    whyChooseUs: "Why Choose Us",
  },
  ar: {
    about: "من نحن",
    common: "عام",
    footer: "التذييل",
    gallery: "المعرض",
    hero: "البطل",
    location: "الموقع",
    navbar: "شريط التنقل",
    partners: "الشركاء",
    reviews: "التقييمات",
    services: "الخدمات",
    whyChooseUs: "لماذا نحن",
  },
};

const DEFAULT_PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/Partners/Absher.png", alt: "أبشر" },
  { src: "/Partners/Najiz.png", alt: "ناجز" },
  { src: "/Partners/Mudad-1.png", alt: "مدد" },
  { src: "/Partners/GOSI-2.png", alt: "التأمينات الاجتماعية" },
  { src: "/Partners/balady.png", alt: "بلدي" },
  { src: "/Partners/Ministry-of-Commerce.png", alt: "وزارة التجارة" },
  { src: "/Partners/QIWA-011.png", alt: "قوى" },
  { src: "/Partners/Musaned-_011.png", alt: "مساند" },
  { src: "/Partners/General_Directorate_of_Passports-1.png", alt: "المديرية العامة للجوازات" },
  { src: "/Partners/Ministry-of-Foreign-Affairs-01.png", alt: "وزارة الخارجية" },
  { src: "/Partners/Sadad-01.png", alt: "سداد" },
  { src: "/Partners/zakat-rax-and-customs-authority-1.png", alt: "هيئة الزكاة والضريبة والجمارك" },
  { src: "/Partners/Jeddah-Chamber-01.png", alt: "الغرفة التجارية" },
];

const DEFAULT_GALLERY_BY_LOCALE: Record<Locale, Record<string, JsonValue>> = {
  ar: {
    badge: "معرض الأعمال",
    title: "لقطات من أعمالنا",
    subtitle: "شاهد نماذج حقيقية من صور وفيديوهات تجهيزاتنا في المناسبات الراقية.",
    focusHint: "اضغط لعرض مكبر",
    emptyMessage: "لا توجد وسائط متاحة حالياً.",
    videoBadge: "فيديو",
    items: [],
  },
  en: {
    badge: "Our Gallery",
    title: "Highlights From Our Work",
    subtitle: "Browse real photo and video highlights from our premium event executions.",
    focusHint: "Click for focus view",
    emptyMessage: "No media available yet.",
    videoBadge: "Video",
    items: [],
  },
};

function createEmptyServicePackage(): ServicePackage {
  return {
    title: "",
    price: "",
    featured: false,
    items: [""],
    whatsappMessage: "",
  };
}

function normalizeServicePackage(value: unknown): ServicePackage {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createEmptyServicePackage();
  }

  const input = value as Record<string, unknown>;
  const items = Array.isArray(input.items)
    ? input.items.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];

  const price = typeof input.price === "string"
    ? input.price
    : typeof input.subtitle === "string"
      ? input.subtitle
      : "";

  return {
    title: typeof input.title === "string" ? input.title : "",
    price,
    featured: Boolean(input.featured),
    items,
    whatsappMessage: typeof input.whatsappMessage === "string" ? input.whatsappMessage : "",
  };
}

function mapLegacyCardsToPackages(cards: unknown[]): ServicePackage[] {
  return cards.map(normalizeServicePackage);
}

function createEmptyPartnerLogo(): PartnerLogo {
  return { src: "", alt: "" };
}

function createEmptyReview(): ReviewItem {
  return { name: "", rating: 5, text: "" };
}

function isObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function formatPath(path: Path): string {
  return path
    .map((part) => (typeof part === "number" ? `[${part}]` : part))
    .join(".");
}

function getSectionFromResultPath(path: string): SectionKey {
  const head = path.split(/[.\[\]]/).filter(Boolean)[0] || "";

  if (head === "services") return "services";
  if (head === "gallery") return "gallery";
  if (head === "partners") return "partners";
  if (head === "reviews") return "reviews";

  return "overview";
}

function getFileNameFromSrc(src: string): string {
  const raw = src.split("/").pop() || "";
  if (!raw) {
    return "";
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function buildDefaultValue(kind: NewEntryKind): JsonValue {
  if (kind === "string") return "";
  if (kind === "number") return 0;
  if (kind === "boolean") return false;
  if (kind === "array") return [];
  return {};
}

function getAtPath(root: JsonValue, path: Path): JsonValue {
  let cursor: JsonValue = root;
  for (const segment of path) {
    if (Array.isArray(cursor) && typeof segment === "number") {
      cursor = cursor[segment];
      continue;
    }
    if (isObject(cursor) && typeof segment === "string") {
      cursor = cursor[segment];
      continue;
    }
    return null;
  }
  return cursor;
}

function setAtPath(root: JsonValue, path: Path, nextValue: JsonValue): JsonValue {
  if (path.length === 0) {
    return nextValue;
  }

  const [head, ...tail] = path;
  if (Array.isArray(root) && typeof head === "number") {
    const next = [...root];
    next[head] = setAtPath(next[head], tail, nextValue);
    return next;
  }

  if (isObject(root) && typeof head === "string") {
    return {
      ...root,
      [head]: setAtPath(root[head], tail, nextValue),
    };
  }

  return root;
}

function deleteAtPath(root: JsonValue, path: Path): JsonValue {
  if (path.length === 0) {
    return root;
  }

  const [head, ...tail] = path;

  if (tail.length === 0) {
    if (Array.isArray(root) && typeof head === "number") {
      return root.filter((_, index) => index !== head);
    }
    if (isObject(root) && typeof head === "string") {
      const next = { ...root };
      delete next[head];
      return next;
    }
    return root;
  }

  if (Array.isArray(root) && typeof head === "number") {
    const next = [...root];
    next[head] = deleteAtPath(next[head], tail);
    return next;
  }

  if (isObject(root) && typeof head === "string") {
    return {
      ...root,
      [head]: deleteAtPath(root[head], tail),
    };
  }

  return root;
}

function moveInArray(root: JsonValue, path: Path, fromIndex: number, toIndex: number): JsonValue {
  const target = getAtPath(root, path);
  if (!Array.isArray(target)) {
    return root;
  }

  if (toIndex < 0 || toIndex >= target.length) {
    return root;
  }

  const next = [...target];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return setAtPath(root, path, next);
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function inferUploadTarget(path: Path): "Services" | "Partners" | "Gallery" | null {
  if (path.length === 4 && path[0] === "services" && path[1] === "cards" && path[3] === "logoUrl") {
    return "Services";
  }
  if (path.length === 4 && path[0] === "partners" && path[1] === "logos" && path[3] === "src") {
    return "Partners";
  }
  if (
    path.length === 4 &&
    path[0] === "gallery" &&
    path[1] === "items" &&
    typeof path[2] === "number" &&
    (path[3] === "src" || path[3] === "thumbnail")
  ) {
    return "Gallery";
  }
  return null;
}

function flattenSearch(node: JsonValue, locale: Locale, prefix: string, results: SearchResult[]) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => flattenSearch(item, locale, `${prefix}[${index}]`, results));
    return;
  }

  if (isObject(node)) {
    Object.entries(node).forEach(([key, value]) => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenSearch(value, locale, nextPrefix, results);
    });
    return;
  }

  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    results.push({ locale, path: prefix, value: String(node) });
  }
}

function normalizeContentWithDefaults(input: BilingualContent): BilingualContent {
  const next = deepClone(input);

  (["ar", "en"] as Locale[]).forEach((locale) => {
    const root = (next[locale] ?? {}) as Record<string, any>;
    root.services = root.services && typeof root.services === "object" ? root.services : {};
    root.partners = root.partners && typeof root.partners === "object" ? root.partners : {};
    root.gallery = root.gallery && typeof root.gallery === "object" ? root.gallery : deepClone(DEFAULT_GALLERY_BY_LOCALE[locale]);

    if (!Array.isArray(root.services.packages) || root.services.packages.length === 0) {
      if (Array.isArray(root.services.cards) && root.services.cards.length > 0) {
        root.services.packages = mapLegacyCardsToPackages(root.services.cards);
      } else {
        root.services.packages = [];
      }
    } else {
      root.services.packages = root.services.packages.map(normalizeServicePackage);
    }

    if (!Array.isArray(root.partners.logos) || root.partners.logos.length === 0) {
      root.partners.logos = deepClone(DEFAULT_PARTNER_LOGOS);
    }

    if (!Array.isArray(root.gallery.items)) {
      root.gallery.items = [];
    }

    ["badge", "title", "subtitle", "focusHint", "emptyMessage", "videoBadge"].forEach((field) => {
      if (typeof root.gallery[field] !== "string") {
        root.gallery[field] = DEFAULT_GALLERY_BY_LOCALE[locale][field];
      }
    });

    next[locale] = root as unknown as BilingualContent[Locale];
  });

  return next;
}

interface PrimitiveFieldProps {
  path: Path;
  value: JsonPrimitive;
  onChange: (path: Path, value: JsonValue) => void;
  onUpload: (path: Path, file: File) => Promise<void>;
  uploadingPath: string | null;
}

function PrimitiveField({ path, value, onChange, onUpload, uploadingPath }: PrimitiveFieldProps) {
  const pathId = formatPath(path);
  const uploadTarget = inferUploadTarget(path);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAccept = uploadTarget === "Gallery" ? "image/*,video/*" : "image/*";

  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-darkGreen"
        />
        {value ? "true" : "false"}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(path, Number(event.target.value))}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-darkGreen"
      />
    );
  }

  if (value === null) {
    return <div className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500">null</div>;
  }

  const stringValue = typeof value === "string" ? value : "";
  const isLong = stringValue.length > 80 || stringValue.includes("\n");

  return (
    <div className="space-y-2">
      {isLong ? (
        <textarea
          value={stringValue}
          onChange={(event) => onChange(path, event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-darkGreen"
        />
      ) : (
        <input
          type="text"
          value={stringValue}
          onChange={(event) => onChange(path, event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-darkGreen"
        />
      )}

      {uploadTarget && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-1.5 text-xs font-semibold text-darkGreen hover:bg-darkGreen/10"
          >
            Upload to {uploadTarget} bucket
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={uploadAccept}
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              if (file) {
                void onUpload(path, file);
              }
              event.target.value = "";
            }}
          />
          {uploadingPath === pathId && <span className="text-xs text-slate-500">Uploading...</span>}
        </div>
      )}
    </div>
  );
}

interface NodeEditorProps {
  path: Path;
  value: JsonValue;
  onChange: (path: Path, value: JsonValue) => void;
  onDelete: (path: Path) => void;
  onMove: (path: Path, from: number, to: number) => void;
  onAddToArray: (path: Path, kind: NewEntryKind) => void;
  onAddToObject: (path: Path, key: string, kind: NewEntryKind) => void;
  onUpload: (path: Path, file: File) => Promise<void>;
  uploadingPath: string | null;
  isRoot?: boolean;
}

function NodeEditor({
  path,
  value,
  onChange,
  onDelete,
  onMove,
  onAddToArray,
  onAddToObject,
  onUpload,
  uploadingPath,
  isRoot,
}: NodeEditorProps) {
  if (!Array.isArray(value) && !isObject(value)) {
    return (
      <PrimitiveField
        path={path}
        value={value}
        onChange={onChange}
        onUpload={onUpload}
        uploadingPath={uploadingPath}
      />
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
        {value.map((item, index) => (
          <div key={`${formatPath(path)}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Item {index + 1}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onMove(path, index, index - 1)}
                  disabled={index === 0}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => onMove(path, index, index + 1)}
                  disabled={index === value.length - 1}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onDelete([...path, index])}
                  className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <NodeEditor
              path={[...path, index]}
              value={item}
              onChange={onChange}
              onDelete={onDelete}
              onMove={onMove}
              onAddToArray={onAddToArray}
              onAddToObject={onAddToObject}
              onUpload={onUpload}
              uploadingPath={uploadingPath}
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-1">
          {(["string", "number", "boolean", "object", "array"] as NewEntryKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onAddToArray(path, kind)}
              className="rounded-md border border-darkGreen/25 bg-darkGreen/5 px-2.5 py-1 text-xs font-semibold text-darkGreen"
            >
              Add {kind}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const entries = Object.entries(value);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
      {entries.map(([key, child]) => (
        <div key={`${formatPath(path)}.${key}`} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</div>
            {!isRoot && (
              <button
                type="button"
                onClick={() => onDelete([...path, key])}
                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
              >
                Delete key
              </button>
            )}
          </div>
          <NodeEditor
            path={[...path, key]}
            value={child}
            onChange={onChange}
            onDelete={onDelete}
            onMove={onMove}
            onAddToArray={onAddToArray}
            onAddToObject={onAddToObject}
            onUpload={onUpload}
            uploadingPath={uploadingPath}
          />
        </div>
      ))}

      <ObjectAddForm onAdd={(key, kind) => onAddToObject(path, key, kind)} />
    </div>
  );
}

function ObjectAddForm({ onAdd }: { onAdd: (key: string, kind: NewEntryKind) => void }) {
  const [key, setKey] = useState("");
  const [kind, setKind] = useState<NewEntryKind>("string");

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Add New Key</div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder="newKey"
          className="min-w-[180px] flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-darkGreen"
        />
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value as NewEntryKind)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-darkGreen"
        >
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="object">object</option>
          <option value="array">array</option>
        </select>
        <button
          type="button"
          onClick={() => {
            if (!key.trim()) return;
            onAdd(key.trim(), kind);
            setKey("");
          }}
          className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-1.5 text-sm font-semibold text-darkGreen"
        >
          Add key
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<BilingualContent>(EMPTY_CONTENT);
  const [activeLocale, setActiveLocale] = useState<Locale>("ar");
  const [adminLocale, setAdminLocale] = useState<Locale>("en");
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSyncingGallery, setIsSyncingGallery] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [showNewGalleryForm, setShowNewGalleryForm] = useState(false);
  const [showNewPartnerForm, setShowNewPartnerForm] = useState(false);
  const [newServiceDraft, setNewServiceDraft] = useState<NewServiceDraft>(EMPTY_NEW_SERVICE);
  const [newGalleryDraft, setNewGalleryDraft] = useState<NewGalleryDraft>(EMPTY_NEW_GALLERY);
  const [newPartnerDraft, setNewPartnerDraft] = useState<NewPartnerDraft>(EMPTY_NEW_PARTNER);
  const [newItemDraftByService, setNewItemDraftByService] = useState<Record<number, { ar: string; en: string; open: boolean }>>({});

  const text = ADMIN_TEXTS[adminLocale];
  const sectionLabels = CONTENT_SECTION_LABELS[adminLocale];
  const root = useMemo<JsonValue>(() => data[activeLocale] ?? {}, [data, activeLocale]);
  const localeRoot = useMemo<LocaleRoot>(() => (isObject(root) ? (root as LocaleRoot) : {}), [root]);

  const quickServices = useMemo<ServicePackage[]>(() => {
    const packages = localeRoot?.services && isObject(localeRoot.services)
      ? (localeRoot.services as Record<string, JsonValue>).packages
      : null;
    return Array.isArray(packages) ? (packages as unknown as ServicePackage[]) : [];
  }, [localeRoot]);

  const quickGallery = useMemo<GalleryItem[]>(() => {
    const items = localeRoot?.gallery && isObject(localeRoot.gallery)
      ? (localeRoot.gallery as Record<string, JsonValue>).items
      : null;
    return Array.isArray(items) ? (items as unknown as GalleryItem[]) : [];
  }, [localeRoot]);

  const quickPartners = useMemo<PartnerLogo[]>(() => {
    const logos = localeRoot?.partners && isObject(localeRoot.partners)
      ? (localeRoot.partners as Record<string, JsonValue>).logos
      : null;
    return Array.isArray(logos) && logos.length > 0
      ? (logos as unknown as PartnerLogo[])
      : deepClone(DEFAULT_PARTNER_LOGOS);
  }, [localeRoot]);

  const quickReviews = useMemo<ReviewItem[]>(() => {
    const list = localeRoot?.reviews && isObject(localeRoot.reviews)
      ? (localeRoot.reviews as Record<string, JsonValue>).list
      : null;
    return Array.isArray(list) ? (list as unknown as ReviewItem[]) : [];
  }, [localeRoot]);

  const topLevelKeysCount = useMemo(() => (isObject(root) ? Object.keys(root).length : 0), [root]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const all: SearchResult[] = [];
    flattenSearch((data.ar as unknown as JsonValue) || {}, "ar", "", all);
    flattenSearch((data.en as unknown as JsonValue) || {}, "en", "", all);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return all.slice(0, 80);
    }

    return all
      .filter((entry) => {
        const combined = `${entry.locale} ${entry.path} ${entry.value}`.toLowerCase();
        return combined.includes(query);
      })
      .slice(0, 150);
  }, [data, searchQuery]);

  const loadContent = async () => {
    setIsLoading(true);
    setStatus(adminLocale === "ar" ? "جارٍ تحميل المحتوى..." : "Loading content...");
    try {
      const response = await fetch(`/api/admin/content?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status}`);
      }
      const content = (await response.json()) as BilingualContent;
      const normalized = normalizeContentWithDefaults(content);
      setData(normalized);
      setStatus(adminLocale === "ar" ? "تم تحميل أحدث نسخة من الخادم." : "Loaded latest content from server.");
    } catch (error) {
      console.error(error);
      setStatus(adminLocale === "ar" ? "فشل تحميل المحتوى." : "Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    setStatus(adminLocale === "ar" ? "جارٍ حفظ المحتوى..." : "Saving content...");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = `Failed to save: ${response.status}`;
        try {
          const payload = (await response.json()) as { error?: string; details?: string };
          const details = [payload.error, payload.details].filter(Boolean).join(" - ");
          if (details) {
            message = details;
          }
        } catch {
          // Ignore JSON parse errors and keep status-based fallback message.
        }

        throw new Error(message);
      }

      announceContentUpdated();
      setStatus(adminLocale === "ar" ? "تم الحفظ والنشر بنجاح." : "Saved successfully. Site content updated.");
    } catch (error) {
      console.error(error);
      const fallback = adminLocale === "ar" ? "فشل حفظ المحتوى." : "Failed to save content.";
      const details = error instanceof Error && error.message ? ` ${error.message}` : "";
      setStatus(`${fallback}${details}`);
    } finally {
      setIsSaving(false);
    }
  };

  const mutateLocaleRoot = (updater: (current: JsonValue) => JsonValue) => {
    setData((current) => ({
      ...current,
      [activeLocale]: updater((current[activeLocale] ?? {}) as JsonValue) as BilingualContent[Locale],
    }));
  };

  const handleChange = (path: Path, nextValue: JsonValue) => {
    mutateLocaleRoot((currentRoot) => setAtPath(currentRoot, path, nextValue));
  };

  const handleDelete = (path: Path) => {
    mutateLocaleRoot((currentRoot) => deleteAtPath(currentRoot, path));
  };

  const handleMove = (path: Path, from: number, to: number) => {
    mutateLocaleRoot((currentRoot) => moveInArray(currentRoot, path, from, to));
  };

  const handleAddToArray = (path: Path, kind: NewEntryKind) => {
    mutateLocaleRoot((currentRoot) => {
      const target = getAtPath(currentRoot, path);
      if (!Array.isArray(target)) {
        return currentRoot;
      }
      return setAtPath(currentRoot, path, [...target, buildDefaultValue(kind)]);
    });
  };

  const handleAddToObject = (path: Path, key: string, kind: NewEntryKind) => {
    mutateLocaleRoot((currentRoot) => {
      const target = getAtPath(currentRoot, path);
      if (!isObject(target)) {
        return currentRoot;
      }
      return setAtPath(currentRoot, path, {
        ...target,
        [key]: buildDefaultValue(kind),
      });
    });
  };

  const uploadAndGetUrl = async (path: Path, file: File): Promise<string | null> => {
    const bucket = inferUploadTarget(path);
    if (!bucket) {
      return null;
    }

    const pathKey = formatPath(path);
    setUploadingPath(pathKey);
    setStatus(adminLocale === "ar" ? `جارٍ رفع الوسائط إلى حاوية ${bucket}...` : `Uploading media to ${bucket} bucket...`);

    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, fileName: file.name, dataUrl }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null) as { error?: string; details?: string } | null;
        const message = errorPayload?.details || errorPayload?.error || `Failed upload: ${response.status}`;
        throw new Error(message);
      }

      const result = (await response.json()) as { url: string };
      return result.url;
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Upload failed.";
      setStatus(adminLocale === "ar" ? `فشل رفع الصورة: ${message}` : `Upload failed: ${message}`);
      return null;
    } finally {
      setUploadingPath(null);
    }
  };

  const uploadByBucket = async (bucket: "Services" | "Partners" | "Gallery", file: File, uploadKey: string): Promise<string | null> => {
    setUploadingPath(uploadKey);
    setStatus(adminLocale === "ar" ? `جارٍ رفع الوسائط إلى حاوية ${bucket}...` : `Uploading media to ${bucket} bucket...`);

    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, fileName: file.name, dataUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed upload: ${response.status}`);
      }

      const result = (await response.json()) as { url: string };
      setStatus(adminLocale === "ar" ? "تم رفع الوسائط بنجاح." : "Media uploaded successfully.");
      return result.url;
    } catch (error) {
      console.error(error);
      setStatus(adminLocale === "ar" ? "فشل رفع الوسائط." : "Upload failed.");
      return null;
    } finally {
      setUploadingPath(null);
    }
  };

  const handleUpload = async (path: Path, file: File) => {
    const url = await uploadAndGetUrl(path, file);
    if (!url) {
      return;
    }

    handleChange(path, url);
    setStatus(adminLocale === "ar" ? "تم رفع الوسائط وتحديث الرابط." : "Upload complete. URL updated.");
  };

  const setServices = (services: ServicePackage[]) => {
    handleChange(["services", "packages"], services as unknown as JsonValue);
  };

  const setGallery = (items: GalleryItem[]) => {
    handleChange(["gallery", "items"], items as unknown as JsonValue);
  };

  const setPartners = (logos: PartnerLogo[]) => {
    handleChange(["partners", "logos"], logos as unknown as JsonValue);
  };

  const setReviews = (reviews: ReviewItem[]) => {
    handleChange(["reviews", "list"], reviews as unknown as JsonValue);
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  const syncServiceSharedField = (index: number, field: "price" | "featured", value: string | boolean) => {
    setData((current) => {
      const arServices = getLocaleServices(current, "ar").map((service, i) => (i === index ? { ...service, [field]: value } : service));
      const enServices = getLocaleServices(current, "en").map((service, i) => (i === index ? { ...service, [field]: value } : service));
      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["services", "packages"], arServices as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["services", "packages"], enServices as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });
  };

  const syncPartnerSharedField = (index: number, value: string) => {
    setData((current) => {
      const arPartners = getLocalePartners(current, "ar").map((partner, i) => (i === index ? { ...partner, src: value } : partner));
      const enPartners = getLocalePartners(current, "en").map((partner, i) => (i === index ? { ...partner, src: value } : partner));
      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["partners", "logos"], arPartners as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["partners", "logos"], enPartners as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });
  };

  const syncGallerySharedField = (
    index: number,
    field: "src" | "type" | "fileName" | "thumbnail",
    value: string,
  ) => {
    setData((current) => {
      const applyField = (item: GalleryItem) => {
        if (field === "type") {
          return { ...item, type: value as GalleryMediaType };
        }
        return { ...item, [field]: value };
      };

      const arItems = getLocaleGalleryItems(current, "ar").map((item, i) => (i === index ? applyField(item) : item));
      const enItems = getLocaleGalleryItems(current, "en").map((item, i) => (i === index ? applyField(item) : item));
      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["gallery", "items"], arItems as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["gallery", "items"], enItems as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });
  };

  const addServiceItemBilingual = (serviceIndex: number) => {
    const draft = newItemDraftByService[serviceIndex];
    if (!draft?.ar?.trim() || !draft?.en?.trim()) {
      setStatus(adminLocale === "ar" ? "أدخل عنصر الخدمة بالعربية والإنجليزية." : "Please enter the service item in AR and EN.");
      return;
    }

    setData((current) => {
      const arServices = getLocaleServices(current, "ar").map((service, i) =>
        i === serviceIndex ? { ...service, items: [...(service.items || []), draft.ar.trim()] } : service
      );
      const enServices = getLocaleServices(current, "en").map((service, i) =>
        i === serviceIndex ? { ...service, items: [...(service.items || []), draft.en.trim()] } : service
      );

      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["services", "packages"], arServices as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["services", "packages"], enServices as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });

    setNewItemDraftByService((current) => ({
      ...current,
      [serviceIndex]: { ar: "", en: "", open: false },
    }));
  };

  const getLocaleServices = (source: BilingualContent, locale: Locale): ServicePackage[] => {
    const raw = source[locale] as unknown as Record<string, any>;
    const packages = raw?.services?.packages;
    if (Array.isArray(packages) && packages.length > 0) {
      return packages.map(normalizeServicePackage);
    }

    if (Array.isArray(raw?.services?.cards) && raw.services.cards.length > 0) {
      return mapLegacyCardsToPackages(raw.services.cards);
    }

    return [];
  };

  const getLocaleGalleryItems = (source: BilingualContent, locale: Locale): GalleryItem[] => {
    const raw = source[locale] as unknown as Record<string, any>;
    const items = raw?.gallery?.items;
    if (!Array.isArray(items)) {
      return [];
    }

    return (items as GalleryItem[]).map((item) => {
      const decodedFileName = item?.fileName?.trim() || getFileNameFromSrc(item?.src || "");
      return {
        src: item?.src || "",
        fileName: decodedFileName,
        type: item?.type === "video" ? "video" : "image",
        title: item?.title || "",
        description: item?.description || "",
        thumbnail: item?.thumbnail || "",
      };
    });
  };

  const getLocalePartners = (source: BilingualContent, locale: Locale): PartnerLogo[] => {
    const raw = source[locale] as unknown as Record<string, any>;
    const logos = raw?.partners?.logos;
    if (Array.isArray(logos) && logos.length > 0) {
      return logos as PartnerLogo[];
    }
    return deepClone(DEFAULT_PARTNER_LOGOS);
  };

  const updateBothLocalesPath = (path: Path, arValue: JsonValue, enValue: JsonValue) => {
    setData((current) => {
      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, path, arValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, path, enValue) as unknown as BilingualContent["en"];
      return next;
    });
  };

  const addServiceBilingual = () => {
    if (!newServiceDraft.titleAr.trim() || !newServiceDraft.titleEn.trim()) {
      setStatus(adminLocale === "ar" ? "أدخل اسم الباقة بالعربية والإنجليزية." : "Please fill package title in AR and EN.");
      return;
    }

    setData((current) => {
      const arServices = getLocaleServices(current, "ar");
      const enServices = getLocaleServices(current, "en");

      const arCard: ServicePackage = {
        title: newServiceDraft.titleAr.trim(),
        price: newServiceDraft.price.trim(),
        featured: newServiceDraft.featured,
        items: newServiceDraft.firstItemAr.trim() ? [newServiceDraft.firstItemAr.trim()] : [],
        whatsappMessage: newServiceDraft.whatsappAr.trim(),
      };

      const enCard: ServicePackage = {
        title: newServiceDraft.titleEn.trim(),
        price: newServiceDraft.price.trim(),
        featured: newServiceDraft.featured,
        items: newServiceDraft.firstItemEn.trim() ? [newServiceDraft.firstItemEn.trim()] : [],
        whatsappMessage: newServiceDraft.whatsappEn.trim(),
      };

      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["services", "packages"], [...arServices, arCard] as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["services", "packages"], [...enServices, enCard] as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });

    setNewServiceDraft(EMPTY_NEW_SERVICE);
    setShowNewServiceForm(false);
  };

  const addGalleryBilingual = () => {
    if (!newGalleryDraft.src.trim() || !newGalleryDraft.titleAr.trim() || !newGalleryDraft.titleEn.trim()) {
      setStatus(adminLocale === "ar" ? "أدخل رابط الوسائط والعنوان بالعربية والإنجليزية." : "Please fill media URL and both AR/EN titles.");
      return;
    }

    setData((current) => {
      const arItems = getLocaleGalleryItems(current, "ar");
      const enItems = getLocaleGalleryItems(current, "en");
      const inferredFileName = getFileNameFromSrc(newGalleryDraft.src.trim());
      const fileName = newGalleryDraft.fileName.trim() || inferredFileName;

      const arItem: GalleryItem = {
        src: newGalleryDraft.src.trim(),
        fileName,
        type: newGalleryDraft.type,
        title: newGalleryDraft.titleAr.trim(),
        description: newGalleryDraft.descriptionAr.trim(),
        thumbnail: newGalleryDraft.thumbnail.trim(),
      };

      const enItem: GalleryItem = {
        src: newGalleryDraft.src.trim(),
        fileName,
        type: newGalleryDraft.type,
        title: newGalleryDraft.titleEn.trim(),
        description: newGalleryDraft.descriptionEn.trim(),
        thumbnail: newGalleryDraft.thumbnail.trim(),
      };

      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["gallery", "items"], [...arItems, arItem] as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["gallery", "items"], [...enItems, enItem] as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });

    setNewGalleryDraft(EMPTY_NEW_GALLERY);
    setShowNewGalleryForm(false);
  };

  const syncGalleryFromPublicFolder = async () => {
    setIsSyncingGallery(true);
    setStatus(text.quick.syncingGallery);

    try {
      const response = await fetch(`/api/admin/gallery-files?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load gallery files: ${response.status}`);
      }

      const payload = (await response.json()) as {
        files: Array<{ fileName: string; src: string; type: GalleryMediaType; title: string }>;
      };

      const files = Array.isArray(payload.files) ? payload.files : [];
      const arItems: GalleryItem[] = files.map((file) => ({
        src: file.src,
        fileName: file.fileName,
        type: file.type,
        title: file.title,
        description: file.type === "video" ? "عرض فيديو من تنفيذاتنا في المناسبات." : "لقطة حقيقية من أحد أعمالنا في الضيافة الملكية.",
        thumbnail: "",
      }));
      const enItems: GalleryItem[] = files.map((file) => ({
        src: file.src,
        fileName: file.fileName,
        type: file.type,
        title: file.title,
        description: file.type === "video" ? "Video highlight from one of our event setups." : "A real capture from one of our premium hospitality executions.",
        thumbnail: "",
      }));

      updateBothLocalesPath(["gallery", "items"], arItems as unknown as JsonValue, enItems as unknown as JsonValue);
      setStatus(
        adminLocale === "ar"
          ? `تمت مزامنة ${files.length} ملف من public/Gallery. احفظ لنشر التغييرات.`
          : `Synced ${files.length} files from public/Gallery. Save to publish changes.`,
      );
    } catch (error) {
      console.error(error);
      setStatus(adminLocale === "ar" ? "فشلت مزامنة ملفات المعرض." : "Failed to sync gallery files.");
    } finally {
      setIsSyncingGallery(false);
    }
  };

  const addPartnerBilingual = () => {
    if (!newPartnerDraft.altAr.trim() || !newPartnerDraft.altEn.trim()) {
      setStatus(adminLocale === "ar" ? "أدخل اسم الشريك بالعربية والإنجليزية." : "Please fill partner name in AR and EN.");
      return;
    }

    setData((current) => {
      const arPartners = getLocalePartners(current, "ar");
      const enPartners = getLocalePartners(current, "en");

      const arLogo: PartnerLogo = { src: newPartnerDraft.src.trim(), alt: newPartnerDraft.altAr.trim() };
      const enLogo: PartnerLogo = { src: newPartnerDraft.src.trim(), alt: newPartnerDraft.altEn.trim() };

      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["partners", "logos"], [...arPartners, arLogo] as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["partners", "logos"], [...enPartners, enLogo] as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });

    setNewPartnerDraft(EMPTY_NEW_PARTNER);
    setShowNewPartnerForm(false);
  };

  useEffect(() => {
    void loadContent();
  }, []);

  const renderSection = () => {
    if (activeSection === "overview") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-darkGreen">{text.sectionLabels.overview}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{text.overviewCards.services}</p><p className="mt-1 text-2xl font-black text-darkGreen">{quickServices.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{text.overviewCards.gallery}</p><p className="mt-1 text-2xl font-black text-darkGreen">{quickGallery.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{text.overviewCards.partners}</p><p className="mt-1 text-2xl font-black text-darkGreen">{quickPartners.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{text.overviewCards.reviews}</p><p className="mt-1 text-2xl font-black text-darkGreen">{quickReviews.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{text.overviewCards.keys}</p><p className="mt-1 text-2xl font-black text-darkGreen">{topLevelKeysCount}</p></div>
          </div>
        </section>
      );
    }

    if (activeSection === "services") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-darkGreen">{text.sectionLabels.services}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {adminLocale === "ar"
              ? "حرّر باقات الخدمات المعروضة في الصفحة الرئيسية. هذه الحقول مرتبطة مباشرة بقسم الباقات الظاهر للعميل."
              : "Edit the package cards shown on the website. These fields map directly to the live Services section."}
          </p>

          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <button
              type="button"
              onClick={() => setShowNewServiceForm((value) => !value)}
              className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen"
            >
              {text.quick.addService}
            </button>
            {showNewServiceForm && (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input value={newServiceDraft.titleAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, titleAr: e.target.value }))} placeholder="title AR" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newServiceDraft.titleEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, titleEn: e.target.value }))} placeholder="title EN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newServiceDraft.price} onChange={(e) => setNewServiceDraft((d) => ({ ...d, price: e.target.value }))} placeholder="price (shared)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={newServiceDraft.featured}
                    onChange={(event) => setNewServiceDraft((draft) => ({ ...draft, featured: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  {adminLocale === "ar" ? "باقة مميزة" : "Featured package"}
                </label>
                <textarea value={newServiceDraft.whatsappAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, whatsappAr: e.target.value }))} placeholder="WhatsApp message AR" rows={2} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <textarea value={newServiceDraft.whatsappEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, whatsappEn: e.target.value }))} placeholder="WhatsApp message EN" rows={2} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newServiceDraft.firstItemAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, firstItemAr: e.target.value }))} placeholder="first item AR" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newServiceDraft.firstItemEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, firstItemEn: e.target.value }))} placeholder="first item EN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <div className="sm:col-span-2 flex gap-2">
                  <button type="button" onClick={addServiceBilingual} className="rounded-lg bg-darkGreen px-3 py-2 text-sm font-semibold text-white">{text.quick.addService}</button>
                  <button type="button" onClick={() => setShowNewServiceForm(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {quickServices.map((service, index) => (
              <div key={`${service.title || "package"}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500">#{index + 1}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setServices(moveItem(quickServices, index, index - 1))} disabled={index === 0} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.up}</button>
                    <button type="button" onClick={() => setServices(moveItem(quickServices, index, index + 1))} disabled={index === quickServices.length - 1} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.down}</button>
                    <button type="button" onClick={() => setServices(quickServices.filter((_, i) => i !== index))} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">{text.quick.delete}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input value={service.title || ""} onChange={(e) => setServices(quickServices.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))} placeholder="title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={service.price || ""} onChange={(e) => syncServiceSharedField(index, "price", e.target.value)} placeholder="price" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(service.featured)}
                      onChange={(event) => syncServiceSharedField(index, "featured", event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    {adminLocale === "ar" ? "باقة مميزة" : "Featured package"}
                  </label>
                </div>
                <textarea value={service.whatsappMessage || ""} onChange={(e) => setServices(quickServices.map((item, i) => (i === index ? { ...item, whatsappMessage: e.target.value } : item)))} rows={3} placeholder="WhatsApp message" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />

                <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-2">
                  <div className="text-xs font-semibold text-slate-500">{text.quick.items}</div>
                  {(service.items || []).map((item, itemIndex) => (
                    <div key={`service-item-${index}-${itemIndex}`} className="flex gap-2">
                      <input
                        value={item || ""}
                        onChange={(e) => setServices(quickServices.map((currentService, i) => {
                          if (i !== index) return currentService;
                          const nextItems = [...(currentService.items || [])];
                          nextItems[itemIndex] = e.target.value;
                          return { ...currentService, items: nextItems };
                        }))}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setServices(quickServices.map((currentService, i) => {
                          if (i !== index) return currentService;
                          return { ...currentService, items: (currentService.items || []).filter((_, j) => j !== itemIndex) };
                        }))}
                        className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                      >
                        {text.quick.delete}
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewItemDraftByService((current) => ({
                      ...current,
                      [index]: {
                        ar: current[index]?.ar ?? "",
                        en: current[index]?.en ?? "",
                        open: !current[index]?.open,
                      },
                    }))}
                    className="rounded border border-darkGreen/25 bg-darkGreen/5 px-2 py-1 text-xs font-semibold text-darkGreen"
                  >
                    {text.quick.addItem}
                  </button>
                  {newItemDraftByService[index]?.open && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        value={newItemDraftByService[index]?.ar ?? ""}
                        onChange={(e) => setNewItemDraftByService((current) => ({
                          ...current,
                          [index]: { ar: e.target.value, en: current[index]?.en ?? "", open: true },
                        }))}
                        placeholder="item AR"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={newItemDraftByService[index]?.en ?? ""}
                        onChange={(e) => setNewItemDraftByService((current) => ({
                          ...current,
                          [index]: { ar: current[index]?.ar ?? "", en: e.target.value, open: true },
                        }))}
                        placeholder="item EN"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={() => addServiceItemBilingual(index)} className="rounded border border-darkGreen/25 bg-darkGreen/5 px-2 py-1 text-xs font-semibold text-darkGreen">
                        {text.quick.addItem}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setShowNewServiceForm(true)} className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen">{text.quick.addService}</button>
          </div>
        </section>
      );
    }

    if (activeSection === "gallery") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-darkGreen">{text.sectionLabels.gallery}</h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNewGalleryForm((value) => !value)}
                className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen"
              >
                {text.quick.addGallery}
              </button>
              <button
                type="button"
                onClick={() => void syncGalleryFromPublicFolder()}
                disabled={isSyncingGallery}
                className="rounded-lg border border-darkGreen/25 bg-white px-3 py-2 text-sm font-semibold text-darkGreen disabled:opacity-50"
              >
                {isSyncingGallery ? text.quick.syncingGallery : text.quick.syncGallery}
              </button>
            </div>

            {showNewGalleryForm && (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex gap-2 sm:col-span-2">
                  <input
                    value={newGalleryDraft.src}
                    onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, src: event.target.value }))}
                    placeholder="media src (shared)"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <label className="cursor-pointer rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-xs font-semibold text-darkGreen">
                    {text.quick.upload}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const url = await uploadByBucket("Gallery", file, "new-gallery-src");
                          if (url) {
                            setNewGalleryDraft((draft) => ({
                              ...draft,
                              src: url,
                              fileName: draft.fileName || getFileNameFromSrc(url),
                              type: file.type.startsWith("video/") ? "video" : "image",
                            }));
                          }
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <input
                  value={newGalleryDraft.fileName}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, fileName: event.target.value }))}
                  placeholder="fileName (shared)"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <select
                  value={newGalleryDraft.type}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, type: event.target.value as GalleryMediaType }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="image">image</option>
                  <option value="video">video</option>
                </select>

                <input
                  value={newGalleryDraft.thumbnail}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, thumbnail: event.target.value }))}
                  placeholder="thumbnail src (optional, for video)"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                />

                <input
                  value={newGalleryDraft.titleAr}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, titleAr: event.target.value }))}
                  placeholder="title AR"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={newGalleryDraft.titleEn}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, titleEn: event.target.value }))}
                  placeholder="title EN"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <textarea
                  value={newGalleryDraft.descriptionAr}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, descriptionAr: event.target.value }))}
                  placeholder="description AR"
                  rows={2}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={newGalleryDraft.descriptionEn}
                  onChange={(event) => setNewGalleryDraft((draft) => ({ ...draft, descriptionEn: event.target.value }))}
                  placeholder="description EN"
                  rows={2}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <div className="sm:col-span-2 flex gap-2">
                  <button
                    type="button"
                    onClick={addGalleryBilingual}
                    className="rounded-lg bg-darkGreen px-3 py-2 text-sm font-semibold text-white"
                  >
                    {text.quick.addGallery}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewGalleryForm(false)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>

                {uploadingPath === "new-gallery-src" && (
                  <div className="sm:col-span-2 text-xs text-slate-500">Uploading gallery media...</div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {quickGallery.map((item, index) => (
              <div key={`${item.src}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500">#{index + 1}</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGallery(moveItem(quickGallery, index, index - 1))}
                      disabled={index === 0}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40"
                    >
                      {text.quick.up}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGallery(moveItem(quickGallery, index, index + 1))}
                      disabled={index === quickGallery.length - 1}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40"
                    >
                      {text.quick.down}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGallery(quickGallery.filter((_, i) => i !== index))}
                      className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                    >
                      {text.quick.delete}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    value={item.title || ""}
                    onChange={(event) =>
                      setGallery(quickGallery.map((entry, i) => (i === index ? { ...entry, title: event.target.value } : entry)))
                    }
                    placeholder="title"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <select
                    value={item.type || "image"}
                    onChange={(event) => syncGallerySharedField(index, "type", event.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="image">image</option>
                    <option value="video">video</option>
                  </select>
                </div>

                <textarea
                  value={item.description || ""}
                  onChange={(event) =>
                    setGallery(quickGallery.map((entry, i) => (i === index ? { ...entry, description: event.target.value } : entry)))
                  }
                  rows={2}
                  placeholder="description"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    value={item.fileName || ""}
                    onChange={(event) => syncGallerySharedField(index, "fileName", event.target.value)}
                    placeholder="fileName (shared)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={item.thumbnail || ""}
                    onChange={(event) => syncGallerySharedField(index, "thumbnail", event.target.value)}
                    placeholder="thumbnail src (optional)"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="mt-2 flex gap-2">
                  <input
                    value={item.src || ""}
                    onChange={(event) => {
                      const nextSrc = event.target.value;
                      syncGallerySharedField(index, "src", nextSrc);
                    }}
                    placeholder="src (shared)"
                    className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <label className="cursor-pointer rounded border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-xs font-semibold text-darkGreen">
                    {text.quick.upload}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const url = await uploadAndGetUrl(["gallery", "items", index, "src"], file);
                          if (url) {
                            syncGallerySharedField(index, "src", url);
                            syncGallerySharedField(index, "fileName", getFileNameFromSrc(url));
                            syncGallerySharedField(index, "type", file.type.startsWith("video/") ? "video" : "image");
                          }
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowNewGalleryForm(true)}
              className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen"
            >
              {text.quick.addGallery}
            </button>
          </div>
        </section>
      );
    }

    if (activeSection === "partners") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-darkGreen">{text.sectionLabels.partners}</h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <button
              type="button"
              onClick={() => setShowNewPartnerForm((value) => !value)}
              className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen"
            >
              {text.quick.addPartner}
            </button>
            {showNewPartnerForm && (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex gap-2">
                  <input value={newPartnerDraft.src} onChange={(e) => setNewPartnerDraft((d) => ({ ...d, src: e.target.value }))} placeholder="src (shared)" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <label className="cursor-pointer rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-xs font-semibold text-darkGreen">
                    {text.quick.upload}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const url = await uploadByBucket("Partners", file, "new-partner-logo");
                          if (url) {
                            setNewPartnerDraft((draft) => ({ ...draft, src: url }));
                          }
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div />
                <input value={newPartnerDraft.altAr} onChange={(e) => setNewPartnerDraft((d) => ({ ...d, altAr: e.target.value }))} placeholder="name AR" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newPartnerDraft.altEn} onChange={(e) => setNewPartnerDraft((d) => ({ ...d, altEn: e.target.value }))} placeholder="name EN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <div className="sm:col-span-2 flex gap-2">
                  <button type="button" onClick={addPartnerBilingual} className="rounded-lg bg-darkGreen px-3 py-2 text-sm font-semibold text-white">{text.quick.addPartner}</button>
                  <button type="button" onClick={() => setShowNewPartnerForm(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Cancel</button>
                </div>
                {uploadingPath === "new-partner-logo" && <div className="sm:col-span-2 text-xs text-slate-500">Uploading partner image...</div>}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {quickPartners.map((partner, index) => (
              <div key={`${partner.alt}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500">#{index + 1}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPartners(moveItem(quickPartners, index, index - 1))} disabled={index === 0} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.up}</button>
                    <button type="button" onClick={() => setPartners(moveItem(quickPartners, index, index + 1))} disabled={index === quickPartners.length - 1} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.down}</button>
                    <button type="button" onClick={() => setPartners(quickPartners.filter((_, i) => i !== index))} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">{text.quick.delete}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input value={partner.alt || ""} onChange={(e) => setPartners(quickPartners.map((item, i) => (i === index ? { ...item, alt: e.target.value } : item)))} placeholder="alt" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={partner.src || ""} onChange={(e) => syncPartnerSharedField(index, e.target.value)} placeholder="src" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="mt-2">
                  <label className="cursor-pointer rounded border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-xs font-semibold text-darkGreen">
                    {text.quick.upload}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const url = await uploadAndGetUrl(["partners", "logos", index, "src"], file);
                          if (url) {
                            syncPartnerSharedField(index, url);
                          }
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setShowNewPartnerForm(true)} className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen">{text.quick.addPartner}</button>
          </div>
        </section>
      );
    }

    if (activeSection === "reviews") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-darkGreen">{text.sectionLabels.reviews}</h2>
          <div className="mt-4 space-y-3">
            {quickReviews.map((review, index) => (
              <div key={`${review.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500">#{index + 1}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setReviews(moveItem(quickReviews, index, index - 1))} disabled={index === 0} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.up}</button>
                    <button type="button" onClick={() => setReviews(moveItem(quickReviews, index, index + 1))} disabled={index === quickReviews.length - 1} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.down}</button>
                    <button type="button" onClick={() => setReviews(quickReviews.filter((_, i) => i !== index))} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">{text.quick.delete}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input value={review.name || ""} onChange={(e) => setReviews(quickReviews.map((item, i) => (i === index ? { ...item, name: e.target.value } : item)))} placeholder="name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input type="number" min={1} max={5} value={review.rating ?? 5} onChange={(e) => setReviews(quickReviews.map((item, i) => (i === index ? { ...item, rating: Number(e.target.value) } : item)))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <textarea value={review.text || ""} onChange={(e) => setReviews(quickReviews.map((item, i) => (i === index ? { ...item, text: e.target.value } : item)))} rows={3} placeholder="text" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
            ))}
            <button type="button" onClick={() => setReviews([...(quickReviews || []), createEmptyReview()])} className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen">{text.quick.addReview}</button>
          </div>
        </section>
      );
    }

    if (activeSection === "search") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black text-darkGreen">{text.searchResults}</h2>
          <p className="mt-2 text-sm text-slate-500">{text.searchHint}</p>
          <div className="mt-4 space-y-2">
            {searchResults.length === 0 && <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">{text.noSearchResults}</div>}
            {searchResults.map((result, index) => (
              <div key={`${result.locale}-${result.path}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold uppercase text-darkGreen">{result.locale}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLocale(result.locale);
                      setActiveSection(getSectionFromResultPath(result.path));
                      setStatus(adminLocale === "ar" ? `تم فتح القسم المطابق لـ ${result.path}` : `Opened matching section for ${result.path}`);
                    }}
                    className="rounded border border-darkGreen/25 bg-darkGreen/5 px-2 py-1 text-xs font-semibold text-darkGreen"
                  >
                    {adminLocale === "ar" ? "فتح القسم" : "Open section"}
                  </button>
                </div>
                <div className="mt-1 text-xs text-slate-500">{result.path}</div>
                <div className="mt-1 text-sm text-slate-700">{result.value}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return null;
  };

  const uiDir = adminLocale === "ar" ? "rtl" : "ltr";

  return (
    <main className="min-h-screen bg-[#090C11] p-4 sm:p-6" dir={uiDir}>
      <div className="mx-auto max-w-[1440px] space-y-4">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#111723] to-[#161d2b] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">{text.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/80 sm:text-base">{text.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <div className="mb-1 text-white/70">{text.uiLanguage}</div>
                <div className="flex gap-1">
                  {(["ar", "en"] as Locale[]).map((locale) => (
                    <button key={locale} onClick={() => setAdminLocale(locale)} className={`rounded px-2 py-1 font-bold ${adminLocale === locale ? "bg-white text-darkGreen" : "bg-white/10 text-white"}`}>
                      {locale.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <div className="mb-1 text-white/70">{text.contentLanguage}</div>
                <div className="flex gap-1">
                  {(["ar", "en"] as Locale[]).map((locale) => (
                    <button key={locale} onClick={() => setActiveLocale(locale)} className={`rounded px-2 py-1 font-bold ${activeLocale === locale ? "bg-gold text-white" : "bg-white/10 text-white"}`}>
                      {locale.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={text.searchPlaceholder}
              className="min-w-[260px] flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-darkGreen"
            />
            <a
              href="/admin/blogs"
              className="rounded-xl border border-[#d0b071]/70 bg-[#fff6e1] px-4 py-2.5 text-sm font-semibold text-[#3b4d26]"
            >
              {adminLocale === "ar" ? "إدارة المدونة" : "Blog Manager"}
            </a>
            <button type="button" onClick={() => setActiveSection("search")} className="rounded-xl border border-darkGreen/25 bg-darkGreen/5 px-4 py-2.5 text-sm font-semibold text-darkGreen">
              {text.searchResults} ({searchResults.length})
            </button>
            <button type="button" onClick={loadContent} disabled={isLoading} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">
              {isLoading ? text.reloadLoading : text.reload}
            </button>
            <button type="button" onClick={saveContent} disabled={isSaving} className="rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-white hover:bg-gold-dark disabled:opacity-50">
              {isSaving ? text.saveLoading : text.save}
            </button>
            <button type="button" onClick={logout} disabled={isLoggingOut} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50">
              {isLoggingOut ? (adminLocale === "ar" ? "جارٍ تسجيل الخروج..." : "Signing out...") : (adminLocale === "ar" ? "تسجيل الخروج" : "Sign Out")}
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">{status || text.statusDefault}</p>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-darkGreen">{text.sidebarTitle}</h2>
            <div className="space-y-2">
              {(["overview", "services", "gallery", "partners", "reviews", "search"] as SectionKey[]).map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${activeSection === section ? "bg-darkGreen text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  {text.sectionLabels[section]}
                </button>
              ))}
            </div>
          </aside>

          <div>{renderSection()}</div>
        </div>
      </div>
    </main>
  );
}
