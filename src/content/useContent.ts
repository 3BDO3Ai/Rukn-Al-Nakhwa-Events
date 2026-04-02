"use client";

import { useEffect, useMemo, useState } from "react";
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
    return data;
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
}

export function announceContentUpdated(): void {
  invalidateContentCache();
  notifyContentUpdated();
}

export function useRawContent(): BilingualContent {
  const [content, setContent] = useState<BilingualContent>(() => {
    const now = Date.now();
    const isCacheValid = cachedContent && now - cacheTimestamp < CACHE_DURATION;
    if (isCacheValid) {
      return cachedContent as BilingualContent;
    }
    return fallbackContent as BilingualContent;
  });

  useEffect(() => {
    let mounted = true;

    const applyRemoteContent = async () => {
      const remote = await fetchRemoteContent();
      if (remote) {
        cachedContent = remote;
        cacheTimestamp = Date.now();
        if (mounted) {
          setContent(remote);
        }
        return;
      }

      cachedContent = fallbackContent as BilingualContent;
      cacheTimestamp = Date.now();
      if (mounted) {
        setContent(fallbackContent as BilingualContent);
      }
    };

    (async () => {
      const now = Date.now();
      const isCacheValid = cachedContent && now - cacheTimestamp < CACHE_DURATION;
      if (isCacheValid) {
        if (mounted) {
          setContent(cachedContent as BilingualContent);
        }
        return;
      }

      await applyRemoteContent();
    })();

    const onContentUpdated = () => {
      invalidateContentCache();
      void applyRemoteContent();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === CONTENT_VERSION_KEY) {
        onContentUpdated();
      }
    };

    window.addEventListener(CONTENT_UPDATED_EVENT, onContentUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener(CONTENT_UPDATED_EVENT, onContentUpdated);
      window.removeEventListener("storage", onStorage);
    };
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
