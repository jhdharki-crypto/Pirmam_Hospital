"use client";

import { create } from "zustand";
import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

/* Default values used as fallback when API is not available */
const defaultSettings: Record<string, string> = {
  heroTitle: "نەخۆشخانەی پیرمام",
  heroSubtitle: "خزمەتگوزاری تەندروستی بەرز و متمانەپێکراو",
  heroDescription: "ئێمە لە نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش بۆ خەڵکی کوردستان دەکەین. تەندروستی خەڵک ئەولویەتی ئێمەیە.",
  heroBadge: "خزمەتگوزاری تەندروستی لە کوردستان",
  stat1Value: "٢٠٠+",
  stat1Label: "پزیشکی شارەزا",
  stat2Value: "٥٠٠٠٠+",
  stat2Label: "نەخۆشی سەردەم",
  stat3Value: "٢٤/٧",
  stat3Label: "خزمەتگوزاری",
  stat4Value: "١٥+",
  stat4Label: "ساڵ ئەزموون",
  hospitalNameKu: "نەخۆشخانەی پیرمام",
  hospitalNameEn: "Pirmam Hospital",
  phone1: "+٩٦٤ ٧٥٠ ١٢٣ ٤٥٦٧",
  phone2: "+٩٦٤ ٧٧٠ ٩٨٧ ٦٥٤٣",
  email: "info@pirmam-hospital.com",
  addressKu: "شارەزانی پیرمام، هەولێر، هەرێمی کوردستان، عێراق",
  workingHours: "٢٤ کاتژمێر - ٧ ڕۆژ لە هەفتە",
  facebookUrl: "#",
  instagramUrl: "#",
  twitterUrl: "#",
  youtubeUrl: "#",
  footerDescription: "نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش دەکات.",
  deptSectionTitle: "بەشەکانی نەخۆشخانە",
  deptSectionDesc: "نەخۆشخانەی پیرمام بەشەکی تایبەت و شارەزای هەیە بۆ چارەسەری هەموو جۆرە نەخۆشیەک",
  gallerySectionTitle: "گەلەری وێنە",
  gallerySectionDesc: "وێنەیەکانی نەخۆشخانەی پیرمام - بینینی نزیک لە فەزا و کەرەستەکانی نەخۆشخانە",
  archiveSectionTitle: "ئەرشیف و هەواڵی نەخۆشخانە",
  archiveSectionDesc: "بەرنامە، تۆمارەکان، هەواڵ و بۆنیانەکانی نەخۆشخانەی پیرمام",
};

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
  image: string | null;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  color: string;
  order: number;
}

export interface ArchiveImage {
  id: string;
  url: string;
  order: number;
  archiveItemId: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  color: string;
  order: number;
  images: ArchiveImage[];
}

interface ContentState {
  settings: Record<string, string>;
  departments: Department[];
  galleryItems: GalleryItem[];
  archiveItems: ArchiveItem[];
  loaded: boolean;
  fetchContent: () => Promise<void>;
  getSetting: (key: string) => string;
}

export const useContentStore = create<ContentState>((set, get) => ({
  settings: defaultSettings,
  departments: [],
  galleryItems: [],
  archiveItems: [],
  loaded: false,

  fetchContent: async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const mergedSettings = { ...defaultSettings };
      if (data.settings) {
        Object.assign(mergedSettings, data.settings);
      }

      set({
        settings: mergedSettings,
        departments: data.departments || [],
        galleryItems: data.galleryItems || [],
        archiveItems: data.archiveItems || [],
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  getSetting: (key: string) => {
    const { settings } = get();
    return settings[key] || defaultSettings[key] || "";
  },
}));

/* Custom hook that auto-fetches on mount */
export function useContent() {
  const store = useContentStore();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!store.loaded) {
      store.fetchContent();
    }
  }, [store.loaded]);

  return { ...store, mounted };
}

/* Re-fetch helper for admin panel */
export function useRefetchContent() {
  const fetchContent = useContentStore((s) => s.fetchContent);
  const [fetching, setFetching] = useState(false);

  const refetch = useCallback(async () => {
    setFetching(true);
    await fetchContent();
    setFetching(false);
  }, [fetchContent]);

  return { refetch, fetching };
}
