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
const REMOTE_CONTENT_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/Content/content.json`
  : "/api/admin/content";

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

export function invalidateContentCache(): void {
  cachedContent = null;
  cacheTimestamp = 0;
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

    (async () => {
      const now = Date.now();
      const isCacheValid = cachedContent && now - cacheTimestamp < CACHE_DURATION;
      if (isCacheValid) {
        if (mounted) {
          setContent(cachedContent as BilingualContent);
        }
        return;
      }

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
    })();

    return () => {
      mounted = false;
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
