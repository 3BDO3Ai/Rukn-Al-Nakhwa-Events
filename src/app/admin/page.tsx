"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { announceContentUpdated, BilingualContent } from "@/content/useContent";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type Path = Array<string | number>;
type Locale = "ar" | "en";
type LocaleRoot = Record<string, JsonValue>;
type SectionKey = "overview" | "services" | "partners" | "reviews" | "editor" | "search" | `section:${string}`;

type NewEntryKind = "string" | "number" | "boolean" | "object" | "array";

interface SearchResult {
  locale: Locale;
  path: string;
  value: string;
}

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  logoUrl: string;
  logoAlt: string;
  items: string[];
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

interface NewServiceDraft {
  id: string;
  logoUrl: string;
  logoAlt: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  firstItemAr: string;
  firstItemEn: string;
}

interface NewPartnerDraft {
  src: string;
  altAr: string;
  altEn: string;
}

const EMPTY_NEW_SERVICE: NewServiceDraft = {
  id: "",
  logoUrl: "",
  logoAlt: "",
  titleAr: "",
  titleEn: "",
  subtitleAr: "",
  subtitleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  firstItemAr: "",
  firstItemEn: "",
};

const EMPTY_NEW_PARTNER: NewPartnerDraft = {
  src: "",
  altAr: "",
  altEn: "",
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
    partners: string;
    reviews: string;
    keys: string;
  };
  quick: {
    addService: string;
    addPartner: string;
    addReview: string;
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
      partners: "Partners Manager",
      reviews: "Reviews Manager",
      editor: "Full JSON Editor",
      search: "Global Search",
    },
    overviewCards: {
      services: "Services",
      partners: "Partners",
      reviews: "Reviews",
      keys: "Top-level Keys",
    },
    quick: {
      addService: "Add service",
      addPartner: "Add partner",
      addReview: "Add review",
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
      partners: "إدارة الشركاء",
      reviews: "إدارة التقييمات",
      editor: "محرر JSON الكامل",
      search: "بحث شامل",
    },
    overviewCards: {
      services: "الخدمات",
      partners: "الشركاء",
      reviews: "التقييمات",
      keys: "المفاتيح الرئيسية",
    },
    quick: {
      addService: "إضافة خدمة",
      addPartner: "إضافة شريك",
      addReview: "إضافة تقييم",
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

function createEmptyServiceCard(): ServiceCard {
  return {
    id: `service-${Date.now()}`,
    title: "",
    subtitle: "",
    description: "",
    logoUrl: "",
    logoAlt: "",
    items: [""],
  };
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

function inferUploadTarget(path: Path): "Services" | "Partners" | null {
  if (path.length === 5 && path[1] === "services" && path[2] === "cards" && path[4] === "logoUrl") {
    return "Services";
  }
  if (path.length === 5 && path[1] === "partners" && path[2] === "logos" && path[4] === "src") {
    return "Partners";
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
    root.partners = root.partners && typeof root.partners === "object" ? root.partners : {};

    if (!Array.isArray(root.partners.logos) || root.partners.logos.length === 0) {
      root.partners.logos = deepClone(DEFAULT_PARTNER_LOGOS);
    }

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
            accept="image/*"
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
  const [status, setStatus] = useState<string>("");
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [showNewPartnerForm, setShowNewPartnerForm] = useState(false);
  const [newServiceDraft, setNewServiceDraft] = useState<NewServiceDraft>(EMPTY_NEW_SERVICE);
  const [newPartnerDraft, setNewPartnerDraft] = useState<NewPartnerDraft>(EMPTY_NEW_PARTNER);
  const [newItemDraftByService, setNewItemDraftByService] = useState<Record<number, { ar: string; en: string; open: boolean }>>({});

  const text = ADMIN_TEXTS[adminLocale];
  const sectionLabels = CONTENT_SECTION_LABELS[adminLocale];
  const root = useMemo<JsonValue>(() => data[activeLocale] ?? {}, [data, activeLocale]);
  const localeRoot = useMemo<LocaleRoot>(() => (isObject(root) ? (root as LocaleRoot) : {}), [root]);

  const quickServices = useMemo<ServiceCard[]>(() => {
    const cards = localeRoot?.services && isObject(localeRoot.services)
      ? (localeRoot.services as Record<string, JsonValue>).cards
      : null;
    return Array.isArray(cards) ? (cards as unknown as ServiceCard[]) : [];
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
  const dynamicSectionKeys = useMemo(() => {
    if (!isObject(root)) {
      return [];
    }

    const blocked = new Set(["services", "partners", "reviews"]);
    return Object.keys(root)
      .filter((key) => !blocked.has(key))
      .sort();
  }, [root]);

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
        throw new Error(`Failed to save: ${response.status}`);
      }

      announceContentUpdated();
      setStatus(adminLocale === "ar" ? "تم الحفظ والنشر بنجاح." : "Saved successfully. Site content updated.");
    } catch (error) {
      console.error(error);
      setStatus(adminLocale === "ar" ? "فشل حفظ المحتوى." : "Failed to save content.");
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
    setStatus(adminLocale === "ar" ? `جارٍ رفع الصورة إلى حاوية ${bucket}...` : `Uploading image to ${bucket} bucket...`);

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

  const uploadByBucket = async (bucket: "Services" | "Partners", file: File, uploadKey: string): Promise<string | null> => {
    setUploadingPath(uploadKey);
    setStatus(adminLocale === "ar" ? `جارٍ رفع الصورة إلى حاوية ${bucket}...` : `Uploading image to ${bucket} bucket...`);

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
      setStatus(adminLocale === "ar" ? "تم رفع الصورة بنجاح." : "Image uploaded successfully.");
      return result.url;
    } catch (error) {
      console.error(error);
      setStatus(adminLocale === "ar" ? "فشل رفع الصورة." : "Upload failed.");
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
    setStatus(adminLocale === "ar" ? "تم رفع الصورة وتحديث الرابط." : "Upload complete. URL updated.");
  };

  const setServices = (services: ServiceCard[]) => {
    handleChange(["services", "cards"], services as unknown as JsonValue);
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

  const syncServiceSharedField = (index: number, field: "logoUrl" | "id" | "logoAlt", value: string) => {
    setData((current) => {
      const arServices = getLocaleServices(current, "ar").map((service, i) => (i === index ? { ...service, [field]: value } : service));
      const enServices = getLocaleServices(current, "en").map((service, i) => (i === index ? { ...service, [field]: value } : service));
      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["services", "cards"], arServices as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["services", "cards"], enServices as unknown as JsonValue) as unknown as BilingualContent["en"];
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
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["services", "cards"], arServices as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["services", "cards"], enServices as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });

    setNewItemDraftByService((current) => ({
      ...current,
      [serviceIndex]: { ar: "", en: "", open: false },
    }));
  };

  const getLocaleServices = (source: BilingualContent, locale: Locale): ServiceCard[] => {
    const raw = source[locale] as unknown as Record<string, any>;
    const cards = raw?.services?.cards;
    return Array.isArray(cards) ? (cards as ServiceCard[]) : [];
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
    if (!newServiceDraft.id.trim() || !newServiceDraft.titleAr.trim() || !newServiceDraft.titleEn.trim()) {
      setStatus(adminLocale === "ar" ? "أدخل معرف الخدمة والعنوان بالعربية والإنجليزية." : "Please fill service id and both AR/EN titles.");
      return;
    }

    setData((current) => {
      const arServices = getLocaleServices(current, "ar");
      const enServices = getLocaleServices(current, "en");

      const arCard: ServiceCard = {
        id: newServiceDraft.id.trim(),
        title: newServiceDraft.titleAr.trim(),
        subtitle: newServiceDraft.subtitleAr.trim(),
        description: newServiceDraft.descriptionAr.trim(),
        logoUrl: newServiceDraft.logoUrl.trim(),
        logoAlt: newServiceDraft.logoAlt.trim(),
        items: newServiceDraft.firstItemAr.trim() ? [newServiceDraft.firstItemAr.trim()] : [],
      };

      const enCard: ServiceCard = {
        id: newServiceDraft.id.trim(),
        title: newServiceDraft.titleEn.trim(),
        subtitle: newServiceDraft.subtitleEn.trim(),
        description: newServiceDraft.descriptionEn.trim(),
        logoUrl: newServiceDraft.logoUrl.trim(),
        logoAlt: newServiceDraft.logoAlt.trim(),
        items: newServiceDraft.firstItemEn.trim() ? [newServiceDraft.firstItemEn.trim()] : [],
      };

      const next = deepClone(current);
      next.ar = setAtPath((next.ar ?? {}) as JsonValue, ["services", "cards"], [...arServices, arCard] as unknown as JsonValue) as unknown as BilingualContent["ar"];
      next.en = setAtPath((next.en ?? {}) as JsonValue, ["services", "cards"], [...enServices, enCard] as unknown as JsonValue) as unknown as BilingualContent["en"];
      return next;
    });

    setNewServiceDraft(EMPTY_NEW_SERVICE);
    setShowNewServiceForm(false);
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
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{text.overviewCards.services}</p><p className="mt-1 text-2xl font-black text-darkGreen">{quickServices.length}</p></div>
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
                <input value={newServiceDraft.id} onChange={(e) => setNewServiceDraft((d) => ({ ...d, id: e.target.value }))} placeholder="id (shared)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  <input value={newServiceDraft.logoUrl} onChange={(e) => setNewServiceDraft((d) => ({ ...d, logoUrl: e.target.value }))} placeholder="logoUrl (shared)" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <label className="cursor-pointer rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-xs font-semibold text-darkGreen">
                    {text.quick.upload}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const url = await uploadByBucket("Services", file, "new-service-logo");
                          if (url) {
                            setNewServiceDraft((draft) => ({ ...draft, logoUrl: url }));
                          }
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <input value={newServiceDraft.logoAlt} onChange={(e) => setNewServiceDraft((d) => ({ ...d, logoAlt: e.target.value }))} placeholder="logoAlt (shared)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <div className="sm:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input value={newServiceDraft.titleAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, titleAr: e.target.value }))} placeholder="title AR" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={newServiceDraft.titleEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, titleEn: e.target.value }))} placeholder="title EN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={newServiceDraft.subtitleAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, subtitleAr: e.target.value }))} placeholder="subtitle AR" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={newServiceDraft.subtitleEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, subtitleEn: e.target.value }))} placeholder="subtitle EN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <textarea value={newServiceDraft.descriptionAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, descriptionAr: e.target.value }))} placeholder="description AR" rows={2} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <textarea value={newServiceDraft.descriptionEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, descriptionEn: e.target.value }))} placeholder="description EN" rows={2} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newServiceDraft.firstItemAr} onChange={(e) => setNewServiceDraft((d) => ({ ...d, firstItemAr: e.target.value }))} placeholder="first item AR" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input value={newServiceDraft.firstItemEn} onChange={(e) => setNewServiceDraft((d) => ({ ...d, firstItemEn: e.target.value }))} placeholder="first item EN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <div className="sm:col-span-2 flex gap-2">
                  <button type="button" onClick={addServiceBilingual} className="rounded-lg bg-darkGreen px-3 py-2 text-sm font-semibold text-white">{text.quick.addService}</button>
                  <button type="button" onClick={() => setShowNewServiceForm(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Cancel</button>
                </div>
                {uploadingPath === "new-service-logo" && <div className="sm:col-span-2 text-xs text-slate-500">Uploading service image...</div>}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {quickServices.map((service, index) => (
              <div key={`${service.id}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-500">#{index + 1}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setServices(moveItem(quickServices, index, index - 1))} disabled={index === 0} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.up}</button>
                    <button type="button" onClick={() => setServices(moveItem(quickServices, index, index + 1))} disabled={index === quickServices.length - 1} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40">{text.quick.down}</button>
                    <button type="button" onClick={() => setServices(quickServices.filter((_, i) => i !== index))} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">{text.quick.delete}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input value={service.id || ""} onChange={(e) => syncServiceSharedField(index, "id", e.target.value)} placeholder="id" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={service.title || ""} onChange={(e) => setServices(quickServices.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))} placeholder="title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={service.subtitle || ""} onChange={(e) => setServices(quickServices.map((item, i) => (i === index ? { ...item, subtitle: e.target.value } : item)))} placeholder="subtitle" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input value={service.logoAlt || ""} onChange={(e) => syncServiceSharedField(index, "logoAlt", e.target.value)} placeholder="logoAlt" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <textarea value={service.description || ""} onChange={(e) => setServices(quickServices.map((item, i) => (i === index ? { ...item, description: e.target.value } : item)))} rows={3} placeholder="description" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />

                <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-white p-2">
                  <div className="text-xs font-semibold text-slate-500">{text.quick.items}</div>
                  {(service.items || []).map((item, itemIndex) => (
                    <div key={`${service.id}-item-${itemIndex}`} className="flex gap-2">
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

                <div className="mt-2 flex gap-2">
                  <input value={service.logoUrl || ""} onChange={(e) => syncServiceSharedField(index, "logoUrl", e.target.value)} placeholder="logoUrl" className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <label className="cursor-pointer rounded border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-xs font-semibold text-darkGreen">
                    {text.quick.upload}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const url = await uploadAndGetUrl(["services", "cards", index, "logoUrl"], file);
                          if (url) {
                            syncServiceSharedField(index, "logoUrl", url);
                          }
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setShowNewServiceForm(true)} className="rounded-lg border border-darkGreen/25 bg-darkGreen/5 px-3 py-2 text-sm font-semibold text-darkGreen">{text.quick.addService}</button>
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
                      setActiveSection("editor");
                      setStatus(adminLocale === "ar" ? `انتقال إلى ${result.locale}: ${result.path}` : `Jumped to ${result.locale}: ${result.path}`);
                    }}
                    className="rounded border border-darkGreen/25 bg-darkGreen/5 px-2 py-1 text-xs font-semibold text-darkGreen"
                  >
                    Open in editor
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

    if (activeSection.startsWith("section:")) {
      const sectionKey = activeSection.replace("section:", "");

      if (sectionKey === "services") {
        return (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-slate-600">Use the dedicated Services Manager from the sidebar.</p>
          </section>
        );
      }
      if (sectionKey === "partners") {
        return (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-slate-600">Use the dedicated Partners Manager from the sidebar.</p>
          </section>
        );
      }
      if (sectionKey === "reviews") {
        return (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-slate-600">Use the dedicated Reviews Manager from the sidebar.</p>
          </section>
        );
      }

      const sectionValue = (localeRoot?.[sectionKey] ?? {}) as JsonValue;
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-3 text-xl font-black text-darkGreen">{sectionKey}</h2>
          <NodeEditor
            path={[sectionKey]}
            value={sectionValue}
            onChange={handleChange}
            onDelete={handleDelete}
            onMove={handleMove}
            onAddToArray={handleAddToArray}
            onAddToObject={handleAddToObject}
            onUpload={handleUpload}
            uploadingPath={uploadingPath}
          />
        </section>
      );
    }

    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-3 text-xl font-black text-darkGreen">{text.sectionLabels.editor}</h2>
        <NodeEditor
          path={[]}
          value={root}
          onChange={handleChange}
          onDelete={handleDelete}
          onMove={handleMove}
          onAddToArray={handleAddToArray}
          onAddToObject={handleAddToObject}
          onUpload={handleUpload}
          uploadingPath={uploadingPath}
          isRoot
        />
      </section>
    );
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
              {(["overview", "services", "partners", "reviews", "editor", "search"] as SectionKey[]).map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${activeSection === section ? "bg-darkGreen text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  {text.sectionLabels[section]}
                </button>
              ))}

              <div className="mt-3 border-t border-slate-200 pt-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {adminLocale === "ar" ? "جميع أقسام المحتوى" : "All Content Sections"}
                </div>
                <div className="space-y-2">
                  {dynamicSectionKeys.map((key) => {
                    const section = `section:${key}` as SectionKey;
                    const displayName = sectionLabels[key] || key;
                    return (
                      <button
                        key={section}
                        type="button"
                        onClick={() => setActiveSection(section)}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${activeSection === section ? "bg-darkGreen text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                      >
                        {displayName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <div>{renderSection()}</div>
        </div>
      </div>
    </main>
  );
}
