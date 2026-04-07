"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import fallbackContent from "./content.json";
import { useLanguage } from "./LanguageProvider";

export type SiteDictionary = Record<string, any>;

export interface BilingualContent {
  ar: SiteDictionary;
  en: SiteDictionary;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const REMOTE_CONTENT_URL = "/api/admin/content";
export const CONTENT_VERSION_KEY = "site-content-version";
export const CONTENT_UPDATED_EVENT = "site-content-updated";

let cachedContent: BilingualContent | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5000;
let pendingFetch: Promise<BilingualContent> | null = null;
let listenersAttached = false;

const subscribers = new Set<() => void>();

const contentStore = {
  value: fallbackContent as BilingualContent,
};

const emitStoreChange = () => {
  subscribers.forEach((listener) => listener());
};

const setStoreContent = (content: BilingualContent) => {
  contentStore.value = content;
  cachedContent = content;
  cacheTimestamp = Date.now();
  emitStoreChange();
};

function mergeBlogFallback(remote: BilingualContent): BilingualContent {
  const fallback = fallbackContent as BilingualContent;

  const applyForLocale = (locale: keyof BilingualContent): SiteDictionary => {
    const remoteLocale = (remote[locale] && typeof remote[locale] === "object") ? { ...remote[locale] } : {};
    const fallbackLocale = (fallback[locale] && typeof fallback[locale] === "object") ? fallback[locale] : {};

    const fallbackBlogs = (fallbackLocale.blogs && typeof fallbackLocale.blogs === "object")
      ? (fallbackLocale.blogs as Record<string, unknown>)
      : null;

    if (!fallbackBlogs) {
      return remoteLocale;
    }

    const remoteBlogs = (remoteLocale.blogs && typeof remoteLocale.blogs === "object")
      ? (remoteLocale.blogs as Record<string, unknown>)
      : null;

    if (!remoteBlogs) {
      return {
        ...remoteLocale,
        blogs: fallbackBlogs,
      };
    }

    const remotePosts = Array.isArray(remoteBlogs.posts) && remoteBlogs.posts.length > 0
      ? remoteBlogs.posts
      : fallbackBlogs.posts;

    return {
      ...remoteLocale,
      blogs: {
        ...fallbackBlogs,
        ...remoteBlogs,
        posts: remotePosts,
      },
    };
  };

  return {
    ar: applyForLocale("ar"),
    en: applyForLocale("en"),
  };
}

async function fetchRemoteContent(): Promise<BilingualContent | null> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${REMOTE_CONTENT_URL}?t=${timestamp}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Remote content fetch failed: ${response.status}`);
    }

    const data = (await response.json()) as BilingualContent;
    if (!data?.ar || !data?.en) {
      return null;
    }
    return mergeBlogFallback(data);
  } catch (error) {
    console.warn("Failed to fetch remote content.", error);
    return null;
  }
}

function notifyContentUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  const version = `${Date.now()}`;
  window.localStorage.setItem(CONTENT_VERSION_KEY, version);
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: version }));
}

export function invalidateContentCache(): void {
  cachedContent = null;
  cacheTimestamp = 0;
  pendingFetch = null;
}

export function announceContentUpdated(): void {
  invalidateContentCache();
  notifyContentUpdated();
}

const getSnapshot = () => contentStore.value;
const getServerSnapshot = () => fallbackContent as BilingualContent;

const subscribe = (listener: () => void) => {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
};

async function refreshContent(force = false): Promise<BilingualContent> {
  const now = Date.now();
  const isCacheValid = cachedContent && now - cacheTimestamp < CACHE_DURATION;

  if (!force && isCacheValid) {
    const valid = cachedContent as BilingualContent;
    if (contentStore.value !== valid) {
      contentStore.value = valid;
      emitStoreChange();
    }
    return valid;
  }

  if (pendingFetch) {
    return pendingFetch;
  }

  pendingFetch = (async () => {
    const remote = await fetchRemoteContent();
    const nextContent = remote ?? (fallbackContent as BilingualContent);
    setStoreContent(nextContent);
    return nextContent;
  })();

  try {
    return await pendingFetch;
  } finally {
    pendingFetch = null;
  }
}

function attachGlobalContentListeners() {
  if (listenersAttached || typeof window === "undefined") {
    return;
  }

  const onContentUpdated = () => {
    invalidateContentCache();
    void refreshContent(true);
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === CONTENT_VERSION_KEY) {
      onContentUpdated();
    }
  };

  window.addEventListener(CONTENT_UPDATED_EVENT, onContentUpdated);
  window.addEventListener("storage", onStorage);
  listenersAttached = true;
}

export function useRawContent(): BilingualContent {
  const content = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    attachGlobalContentListeners();
    void refreshContent();
  }, []);

  return content;
}

export function useContent() {
  const { locale, dir, setLocale, toggleLocale } = useLanguage();
  const raw = useRawContent();

  const dictionary = useMemo(() => raw[locale] ?? raw.ar, [locale, raw]);

  return {
    locale,
    dir,
    setLocale,
    toggleLocale,
    dictionary,
    raw,
  };
}
