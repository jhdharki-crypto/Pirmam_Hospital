"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Settings,
  ImageIcon,
  Archive,
  Phone,
  Plus,
  Trash2,
  Upload,
  X,
  Save,
  Eye,
  ImagePlus,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Eye as EyeIcon,
  Stethoscope,
  Pill,
  Microscope,
  Syringe,
  ScanLine,
  Activity,
  Ear,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  PenSquare,
} from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useRefetchContent } from "@/lib/content-store";
import type { Department, GalleryItem, ArchiveItem, ArchiveImage } from "@/lib/content-store";

/* ============================
   CONSTANTS
   ============================ */

const DEPARTMENT_ICONS = [
  "HeartPulse",
  "Brain",
  "Bone",
  "Baby",
  "Eye",
  "Stethoscope",
  "Pill",
  "Microscope",
  "Syringe",
  "ScanLine",
  "Activity",
  "Ear",
] as const;

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Eye: EyeIcon,
  Stethoscope,
  Pill,
  Microscope,
  Syringe,
  ScanLine,
  Activity,
  Ear,
};

const ICON_LABELS: Record<string, string> = {
  HeartPulse: "دڵ",
  Brain: "مێشک",
  Bone: "ئێسک",
  Baby: "منداڵ",
  Eye: "چاو",
  Stethoscope: "ستێتۆسکۆپ",
  Pill: "دەرمان",
  Microscope: "میکرۆسکۆپ",
  Syringe: "دەزو",
  ScanLine: "سکان",
  Activity: "چالاک",
  Ear: "گوێ",
};

const PRESET_COLORS = [
  { label: "زەرد", value: "from-amber-600/70 to-orange-700/70" },
  { label: "سەوز", value: "from-teal-600/80 to-emerald-700/80" },
  { label: "شین", value: "from-sky-600/70 to-blue-700/80" },
  { label: "سور", value: "from-rose-600/70 to-red-700/80" },
  { label: "مۆر", value: "from-purple-600/70 to-violet-700/80" },
  { label: "پەمۆ", value: "from-pink-600/70 to-fuchsia-700/80" },
  { label: "خۆڵی", value: "from-yellow-600/70 to-amber-700/80" },
  { label: "سەوزی تۆخ", value: "from-green-600/70 to-lime-700/80" },
];

/* ============================
   MAIN COMPONENT
   ============================ */

export function AdminPanel() {
  const { refetch } = useRefetchContent();

  /* Panel state */
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [adminPassword, setAdminPassword] = useState("pirmam2025");

  /* Tab state */
  const [activeTab, setActiveTab] = useState("hero");

  /* Data state */
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);

  /* Loading state */
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* File input ref maps - each item gets its own input so uploads go to the right place */
  const deptFileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const galFileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  /* Separate ref map for archive multi-image uploads, keyed by archive item index */
  const arcMultiFileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  /* ============================
     PASSWORD & AUTH
     ============================ */

  const fetchAdminPassword = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.adminPassword) {
          setAdminPassword(data.adminPassword);
        }
      }
    } catch {
      /* Use default password */
    }
  }, []);

  /* ============================
     DATA FETCHING
     ============================ */

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە بارکردنی داتا");
    }
    setLoading(false);
  }, []);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/departments");
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە بارکردنی بەشەکان");
    }
    setLoading(false);
  }, []);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data);
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە بارکردنی گەلەری");
    }
    setLoading(false);
  }, []);

  const fetchArchive = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/archive");
      if (res.ok) {
        const data = await res.json();
        setArchiveItems(data);
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە بارکردنی ئەرشیف و هەواڵ");
    }
    setLoading(false);
  }, []);

  /* Fetch data for a given tab */
  const fetchTabData = useCallback(
    (tab: string) => {
      switch (tab) {
        case "hero":
        case "contact":
          fetchSettings();
          break;
        case "departments":
          fetchDepartments();
          break;
        case "gallery":
          fetchGallery();
          break;
        case "archive":
          fetchArchive();
          break;
      }
    },
    [fetchSettings, fetchDepartments, fetchGallery, fetchArchive]
  );

  /* Handle sheet open - fetch password if not authenticated */
  async function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && !authenticated) {
      await fetchAdminPassword();
    }
    if (isOpen && authenticated) {
      fetchTabData(activeTab);
    }
  }

  /* Handle tab change - fetch data for the new tab */
  function handleTabChange(tab: string) {
    setActiveTab(tab);
    fetchTabData(tab);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await fetchAdminPassword();
      /* Small delay to ensure password is loaded */
      setTimeout(() => {
        if (passwordInput === adminPassword) {
          setAuthenticated(true);
          setPasswordInput("");
          toast.success("بە سەرکەوتوویی چوویتەژوورەوە");
          fetchTabData(activeTab);
        } else {
          toast.error("وشەی نهێنی هەڵەیە");
        }
        setPasswordLoading(false);
      }, 200);
    } catch {
      if (passwordInput === adminPassword) {
        setAuthenticated(true);
        setPasswordInput("");
        toast.success("بە سەرکەوتوویی چوویتەژوورەوە");
        fetchTabData(activeTab);
      } else {
        toast.error("وشەی نهێنی هەڵەیە");
      }
      setPasswordLoading(false);
    }
  }

  /* ============================
     SAVE HANDLERS
     ============================ */

  async function saveSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        toast.success("زانیاریەکان بە سەرکەوتوویی تۆمارکران");
        await refetch();
      } else {
        toast.error("هەڵەیەک ڕوویدا لە تۆمارکردن");
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە تۆمارکردن");
    }
    setSaving(false);
  }

  async function saveDepartments() {
    setSaving(true);
    try {
      /* Sync all departments */
      for (const dept of departments) {
        if (dept.id.startsWith("new-")) {
          await fetch("/api/admin/departments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: dept.name,
              description: dept.description,
              iconName: dept.iconName,
              image: dept.image,
              order: dept.order,
            }),
          });
        } else {
          await fetch("/api/admin/departments", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dept),
          });
        }
      }
      toast.success("بەشەکان بە سەرکەوتوویی تۆمارکران");
      await refetch();
      await fetchDepartments();
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە تۆمارکردن");
    }
    setSaving(false);
  }

  async function saveGallery() {
    setSaving(true);
    try {
      for (const item of galleryItems) {
        if (item.id.startsWith("new-")) {
          await fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: item.title,
              description: item.description,
              image: item.image,
              color: item.color,
              order: item.order,
            }),
          });
        } else {
          await fetch("/api/admin/gallery", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
        }
      }
      toast.success("گەلەری بە سەرکەوتوویی تۆمارکرا");
      await refetch();
      await fetchGallery();
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە تۆمارکردن");
    }
    setSaving(false);
  }

  async function saveArchive() {
    setSaving(true);
    try {
      for (const item of archiveItems) {
        if (item.id.startsWith("new-")) {
          await fetch("/api/admin/archive", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: item.title,
              description: item.description,
              date: item.date,
              category: item.category,
              color: item.color,
              order: item.order,
            }),
          });
        } else {
          /* Send only the archive item fields (not the images array) */
          await fetch("/api/admin/archive", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: item.id,
              title: item.title,
              description: item.description,
              date: item.date,
              category: item.category,
              color: item.color,
              order: item.order,
            }),
          });
        }
      }
      toast.success("ئەرشیف و هەواڵ بە سەرکەوتوویی تۆمارکرا");
      await refetch();
      await fetchArchive();
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە تۆمارکردن");
    }
    setSaving(false);
  }

  /* ============================
     DELETE HANDLERS
     ============================ */

  async function deleteDepartment(id: string) {
    try {
      const res = await fetch(`/api/admin/departments?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDepartments((prev) => prev.filter((d) => d.id !== id));
        toast.success("بەشەکە سڕایەوە");
        await refetch();
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە سڕینەوە");
    }
  }

  async function deleteGalleryItem(id: string) {
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((g) => g.id !== id));
        toast.success("بابەتەکە سڕایەوە");
        await refetch();
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە سڕینەوە");
    }
  }

  async function deleteArchiveItem(id: string) {
    try {
      const res = await fetch(`/api/admin/archive?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setArchiveItems((prev) => prev.filter((a) => a.id !== id));
        toast.success("بابەتەکە سڕایەوە");
        await refetch();
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە سڕینەوە");
    }
  }

  /* ============================
     IMAGE UPLOAD
     ============================ */

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "department" | "gallery",
    index: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", type === "department" ? "departments" : type);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url;

        /* Update local state first for instant preview */
        if (type === "department") {
          const item = departments[index];
          setDepartments((prev) =>
            prev.map((d, i) => (i === index ? { ...d, image: url } : d))
          );
          /* Auto-save to database so image persists */
          if (item && !item.id.startsWith("new-")) {
            await fetch("/api/admin/departments", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...item, image: url }),
            });
          }
        } else if (type === "gallery") {
          const item = galleryItems[index];
          setGalleryItems((prev) =>
            prev.map((g, i) => (i === index ? { ...g, image: url } : g))
          );
          /* Auto-save to database */
          if (item && !item.id.startsWith("new-")) {
            await fetch("/api/admin/gallery", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...item, image: url }),
            });
          }
        }

        /* Refresh public-facing site content */
        await refetch();
        toast.success("وێنەکە بارکرا و تۆمارکرا");
      } else {
        toast.error("هەڵەیەک ڕوویدا لە بارکردنی وێنە");
      }
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە بارکردنی وێنە");
    }

    /* Reset file input */
    e.target.value = "";
  }

  function triggerUpload(type: "department" | "gallery", index: number) {
    /* Use a short timeout to ensure the file input is mounted before clicking */
    setTimeout(() => {
      const refMap =
        type === "department"
          ? deptFileRefs
          : galFileRefs;
      refMap.current[index]?.click();
    }, 50);
  }

  /* Hidden file input - each item gets its own unique input element
     so that clicking upload on item #1 always uploads to item #1 */
  function getRefCallback(
    type: "department" | "gallery",
    index: number
  ) {
    const refMap =
      type === "department"
        ? deptFileRefs
        : galFileRefs;
    return (el: HTMLInputElement | null) => {
      refMap.current[index] = el;
    };
  }

  const hiddenFileInput = (
    type: "department" | "gallery",
    index: number
  ) => {
    return (
      <input
        key={`${type}-${index}`}
        ref={getRefCallback(type, index)}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageUpload(e, type, index)}
      />
    );
  };

  /* ============================
     HELPER: Update setting
     ============================ */

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  /* ============================
     PASSWORD SCREEN
     ============================ */

  function renderPasswordScreen() {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              پانێلی بەڕێوەبەر
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              تکایە وشەی نهێنی بنووسە بۆ چوونەژوورەوە
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-gray-700 dark:text-gray-300">
                وشەی نهێنی
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="وشەی نهێنی..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="text-right"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              disabled={passwordLoading || !passwordInput}
            >
              {passwordLoading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <ChevronLeft className="w-4 h-4 ml-2" />
              )}
              چوونەژوورەوە
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  /* ============================
     HERO TAB
     ============================ */

  function renderHeroTab() {
    if (loading) {
      return <LoadingSpinner />;
    }

    const stats = [
      { valueKey: "stat1Value", labelKey: "stat1Label" },
      { valueKey: "stat2Value", labelKey: "stat2Label" },
      { valueKey: "stat3Value", labelKey: "stat3Label" },
      { valueKey: "stat4Value", labelKey: "stat4Label" },
    ];

    return (
      <ScrollArea className="h-[calc(100vh-16rem)] px-1">
        <div className="space-y-6 pb-4">
          {/* Section titles */}
          <SettingsField
            label="ناونیشانی سەرەکی"
            value={settings.heroTitle || ""}
            onChange={(v) => updateSetting("heroTitle", v)}
          />
          <SettingsField
            label="ناوی ژێرەوە"
            value={settings.heroSubtitle || ""}
            onChange={(v) => updateSetting("heroSubtitle", v)}
          />
          <SettingsField
            label="پێناسە"
            value={settings.heroDescription || ""}
            onChange={(v) => updateSetting("heroDescription", v)}
            multiline
          />
          <SettingsField
            label="بەجگی سەرەوە"
            value={settings.heroBadge || ""}
            onChange={(v) => updateSetting("heroBadge", v)}
          />

          <Separator />

          {/* Hospital name (shown next to logo in header) */}
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Settings className="w-4 h-4 text-teal-600" />
            ناوی نەخۆشخانە (لەسەر هێدەر)
          </h3>
          <SettingsField
            label="ناوی کوردی"
            value={settings.hospitalNameKu || ""}
            onChange={(v) => updateSetting("hospitalNameKu", v)}
          />
          <SettingsField
            label="ناوی ئینگلیزی"
            value={settings.hospitalNameEn || ""}
            onChange={(v) => updateSetting("hospitalNameEn", v)}
          />

          <Separator />

          {/* Navigation link labels */}
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-teal-600" />
            لینکەکانی هێدەر
          </h3>
          <SettingsField
            label="سەرەتا"
            value={settings.navLabelHome || ""}
            onChange={(v) => updateSetting("navLabelHome", v)}
          />
          <SettingsField
            label="بەشەکان"
            value={settings.navLabelDepartments || ""}
            onChange={(v) => updateSetting("navLabelDepartments", v)}
          />
          <SettingsField
            label="گەلەری"
            value={settings.navLabelGallery || ""}
            onChange={(v) => updateSetting("navLabelGallery", v)}
          />
          <SettingsField
            label="ئەرشیف و هەواڵ"
            value={settings.navLabelArchive || ""}
            onChange={(v) => updateSetting("navLabelArchive", v)}
          />

          <Separator />

          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            ئامارەکان
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="glass rounded-xl border border-white/20 dark:border-gray-700/30"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">بەها</Label>
                      <Input
                        value={settings[stat.valueKey] || ""}
                        onChange={(e) => updateSetting(stat.valueKey, e.target.value)}
                        className="text-center text-lg font-bold text-teal-700 dark:text-teal-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">ناو</Label>
                      <Input
                        value={settings[stat.labelKey] || ""}
                        onChange={(e) => updateSetting(stat.labelKey, e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section titles for departments, gallery, archive */}
          <Separator />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-teal-600" />
            ناوی بەشەکان
          </h3>
          <SettingsField
            label="ناوی بەشی نەخۆشخانەکان"
            value={settings.deptSectionTitle || ""}
            onChange={(v) => updateSetting("deptSectionTitle", v)}
          />
          <SettingsField
            label="پێناسەی بەشەکان"
            value={settings.deptSectionDesc || ""}
            onChange={(v) => updateSetting("deptSectionDesc", v)}
            multiline
          />

          <Separator />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-teal-600" />
            ناوی گەلەری
          </h3>
          <SettingsField
            label="ناوی بەشی گەلەری"
            value={settings.gallerySectionTitle || ""}
            onChange={(v) => updateSetting("gallerySectionTitle", v)}
          />
          <SettingsField
            label="پێناسەی گەلەری"
            value={settings.gallerySectionDesc || ""}
            onChange={(v) => updateSetting("gallerySectionDesc", v)}
            multiline
          />

          <Separator />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-teal-600" />
            ناوی ئەرشیف و هەواڵی نەخۆشخانە
          </h3>
          <SettingsField
            label="ناوی بەشی ئەرشیف و هەواڵ"
            value={settings.archiveSectionTitle || ""}
            onChange={(v) => updateSetting("archiveSectionTitle", v)}
          />
          <SettingsField
            label="پێناسەی ئەرشیف و هەواڵ"
            value={settings.archiveSectionDesc || ""}
            onChange={(v) => updateSetting("archiveSectionDesc", v)}
            multiline
          />

          <div className="pt-4">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              پاشەکەوتکردن
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  /* ============================
     DEPARTMENTS TAB
     ============================ */

  function renderDepartmentsTab() {
    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <ScrollArea className="h-[calc(100vh-16rem)] px-1">
        <div className="space-y-4 pb-4">
          {departments.map((dept, idx) => {
            const IconComp = ICON_MAP[dept.iconName] || HeartPulse;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                          <IconComp className="w-4 h-4 text-teal-600" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{idx + 1}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {dept.image && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden ml-2">
                            <img
                              src={dept.image}
                              alt={dept.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>دڵنیای لە سڕینەوە؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                دەتەوێت بەشی &quot;{dept.name}&quot; بسڕیتەوە؟ ئەم کردارە ناگەڕێتەوە.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>نەخێر</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteDepartment(dept.id)}
                              >
                                بەڵێ، بسڕەوە
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">ناوی بەش</Label>
                      <Input
                        value={dept.name}
                        onChange={(e) =>
                          setDepartments((prev) =>
                            prev.map((d, i) =>
                              i === idx ? { ...d, name: e.target.value } : d
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">پێناسە</Label>
                      <Textarea
                        value={dept.description}
                        onChange={(e) =>
                          setDepartments((prev) =>
                            prev.map((d, i) =>
                              i === idx ? { ...d, description: e.target.value } : d
                            )
                          )
                        }
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">ئایکۆن</Label>
                        <Select
                          value={dept.iconName}
                          onValueChange={(v) =>
                            setDepartments((prev) =>
                              prev.map((d, i) =>
                                i === idx ? { ...d, iconName: v } : d
                              )
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENT_ICONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {ICON_LABELS[icon] || icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">ڕیزبەندی</Label>
                        <Input
                          type="number"
                          value={dept.order}
                          onChange={(e) =>
                            setDepartments((prev) =>
                              prev.map((d, i) =>
                                i === idx
                                  ? { ...d, order: parseInt(e.target.value) || 0 }
                                  : d
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerUpload("department", idx)}
                        className="text-xs flex-1"
                      >
                        <Upload className="w-3.5 h-3.5 ml-1" />
                        بارکردنی وێنە
                      </Button>
                      {dept.image && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDepartments((prev) =>
                              prev.map((d, i) =>
                                i === idx ? { ...d, image: null } : d
                              )
                            )
                          }
                          className="text-xs text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    {hiddenFileInput("department", idx)}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          <Button
            variant="dashed"
            onClick={() =>
              setDepartments((prev) => [
                ...prev,
                {
                  id: `new-${Date.now()}`,
                  name: "",
                  description: "",
                  iconName: "HeartPulse",
                  image: null,
                  order: prev.length,
                },
              ])
            }
            className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 hover:text-teal-600 hover:border-teal-500"
          >
            <Plus className="w-4 h-4 ml-2" />
            زیادکردنی بەشی نوێ
          </Button>

          <div className="pt-4">
            <Button
              onClick={saveDepartments}
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              پاشەکەوتکردن
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  /* ============================
     GALLERY TAB
     ============================ */

  function renderGalleryTab() {
    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <ScrollArea className="h-[calc(100vh-16rem)] px-1">
        <div className="space-y-4 pb-4">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-teal-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{idx + 1}
                      </Badge>
                      {item.image && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>دڵنیای لە سڕینەوە؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            دەتەوێت &quot;{item.title}&quot; بسڕیتەوە؟ ئەم کردارە ناگەڕێتەوە.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>نەخێر</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteGalleryItem(item.id)}
                          >
                            بەڵێ، بسڕەوە
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">ناونیشان</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setGalleryItems((prev) =>
                          prev.map((g, i) =>
                            i === idx ? { ...g, title: e.target.value } : g
                          )
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">پێناسە</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        setGalleryItems((prev) =>
                          prev.map((g, i) =>
                            i === idx ? { ...g, description: e.target.value } : g
                          )
                        )
                      }
                      rows={2}
                    />
                  </div>

                  {/* Color picker */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">ڕەنگ</Label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() =>
                            setGalleryItems((prev) =>
                              prev.map((g, i) =>
                                i === idx ? { ...g, color: c.value } : g
                              )
                            )
                          }
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.value} transition-all ${
                            item.color === c.value
                              ? "ring-2 ring-teal-500 ring-offset-2 scale-110"
                              : "hover:scale-105"
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">ڕیزبەندی</Label>
                      <Input
                        type="number"
                        value={item.order}
                        onChange={(e) =>
                          setGalleryItems((prev) =>
                            prev.map((g, i) =>
                              i === idx
                                ? { ...g, order: parseInt(e.target.value) || 0 }
                                : g
                            )
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerUpload("gallery", idx)}
                      className="text-xs flex-1"
                    >
                      <Upload className="w-3.5 h-3.5 ml-1" />
                      بارکردنی وێنە
                    </Button>
                    {item.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setGalleryItems((prev) =>
                            prev.map((g, i) =>
                              i === idx ? { ...g, image: null } : g
                            )
                          )
                        }
                        className="text-xs text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  {hiddenFileInput("gallery", idx)}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Button
            variant="dashed"
            onClick={() =>
              setGalleryItems((prev) => [
                ...prev,
                {
                  id: `new-${Date.now()}`,
                  title: "",
                  description: "",
                  image: null,
                  color: "from-teal-600/80 to-emerald-700/80",
                  order: prev.length,
                },
              ])
            }
            className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 hover:text-teal-600 hover:border-teal-500"
          >
            <Plus className="w-4 h-4 ml-2" />
            زیادکردنی بابەتی نوێ
          </Button>

          <div className="pt-4">
            <Button
              onClick={saveGallery}
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              پاشەکەوتکردن
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  /* ============================
     ARCHIVE TAB
     ============================ */

  /* Handle multi-image upload for an archive item */
  async function handleArchiveImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    archiveIdx: number
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const item = archiveItems[archiveIdx];
    if (!item) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "archive");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          const url = data.url;

          /* Save image to database via archive-images API */
          if (!item.id.startsWith("new-")) {
            await fetch("/api/admin/archive-images", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                archiveItemId: item.id,
                url,
                order: (item.images?.length || 0) + i,
              }),
            });
          }

          /* Update local state */
          const newImage: ArchiveImage = {
            id: `temp-${Date.now()}-${i}`,
            url,
            order: (item.images?.length || 0) + i,
            archiveItemId: item.id,
          };
          setArchiveItems((prev) =>
            prev.map((a, idx) =>
              idx === archiveIdx
                ? { ...a, images: [...(a.images || []), newImage] }
                : a
            )
          );
        }
      }

      await refetch();
      toast.success(
        files.length === 1
          ? "وێنەکە بارکرا و تۆمارکرا"
          : `${files.length} وێنە بارکران و تۆمارکران`
      );
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە بارکردنی وێنە");
    }

    e.target.value = "";
  }

  /* Delete a single image from an archive item */
  async function deleteArchiveImage(archiveIdx: number, imageId: string) {
    const item = archiveItems[archiveIdx];
    if (!item) return;

    try {
      /* Remove from database */
      if (!imageId.startsWith("temp-")) {
        await fetch(`/api/admin/archive-images?id=${imageId}`, {
          method: "DELETE",
        });
      }

      /* Update local state */
      setArchiveItems((prev) =>
        prev.map((a, idx) =>
          idx === archiveIdx
            ? { ...a, images: (a.images || []).filter((img) => img.id !== imageId) }
            : a
        )
      );

      await refetch();
      toast.success("وێنەکە سڕایەوە");
    } catch {
      toast.error("هەڵەیەک ڕوویدا لە سڕینەوە");
    }
  }

  function renderArchiveTab() {
    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <ScrollArea className="h-[calc(100vh-16rem)] px-1">
        <div className="space-y-4 pb-4">
          {archiveItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Archive className="w-4 h-4 text-amber-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{idx + 1}
                      </Badge>
                      {(item.images?.length || 0) > 0 && (
                        <Badge variant="secondary" className="text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                          {item.images.length} وێنە
                        </Badge>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>دڵنیای لە سڕینەوە؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            دەتەوێت &quot;{item.title}&quot; و هەموو وێنەکانی بسڕیتەوە؟ ئەم کردارە ناگەڕێتەوە.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>نەخێر</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteArchiveItem(item.id)}
                          >
                            بەڵێ، بسڕەوە
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">ناونیشان</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setArchiveItems((prev) =>
                          prev.map((a, i) =>
                            i === idx ? { ...a, title: e.target.value } : a
                          )
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">پێناسە</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        setArchiveItems((prev) =>
                          prev.map((a, i) =>
                            i === idx ? { ...a, description: e.target.value } : a
                          )
                        )
                      }
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">بەروار</Label>
                      <Input
                        value={item.date}
                        onChange={(e) =>
                          setArchiveItems((prev) =>
                            prev.map((a, i) =>
                              i === idx ? { ...a, date: e.target.value } : a
                            )
                          )
                        }
                        placeholder="٢٠٢٥/٠١/٠١"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500">جۆر</Label>
                      <Input
                        value={item.category}
                        onChange={(e) =>
                          setArchiveItems((prev) =>
                            prev.map((a, i) =>
                              i === idx ? { ...a, category: e.target.value } : a
                            )
                          )
                        }
                        placeholder="هەواڵ"
                      />
                    </div>
                  </div>

                  {/* Color picker */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">ڕەنگ</Label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() =>
                            setArchiveItems((prev) =>
                              prev.map((a, i) =>
                                i === idx ? { ...a, color: c.value } : a
                              )
                            )
                          }
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.value} transition-all ${
                            item.color === c.value
                              ? "ring-2 ring-teal-500 ring-offset-2 scale-110"
                              : "hover:scale-105"
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">ڕیزبەندی</Label>
                    <Input
                      type="number"
                      value={item.order}
                      onChange={(e) =>
                        setArchiveItems((prev) =>
                          prev.map((a, i) =>
                            i === idx
                              ? { ...a, order: parseInt(e.target.value) || 0 }
                              : a
                          )
                        )
                      }
                    />
                  </div>

                  {/* === MULTI-IMAGE SECTION === */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      وێنەکان
                    </Label>

                    {/* Existing images grid */}
                    {(item.images || []).length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {item.images.map((img, imgIdx) => (
                          <div
                            key={img.id}
                            className="relative aspect-[4/3] rounded-lg overflow-hidden group/img border border-gray-200 dark:border-gray-700"
                          >
                            <img
                              src={img.url}
                              alt={`وێنە ${imgIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Delete button overlay */}
                            <button
                              type="button"
                              onClick={() => deleteArchiveImage(idx, img.id)}
                              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600"
                              title="سڕینەوە"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {/* Image number badge */}
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded">
                              {imgIdx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload buttons */}
                    <div className="flex gap-2">
                      {/* Multi-image upload (accepts multiple files) */}
                      <input
                        key={`arc-multi-${idx}`}
                        ref={(el) => { arcMultiFileRefs.current[idx] = el; }}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleArchiveImageUpload(e, idx)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          arcMultiFileRefs.current[idx]?.click();
                        }}
                        className="text-xs flex-1"
                      >
                        <ImagePlus className="w-3.5 h-3.5 ml-1" />
                        بارکردنی وێنە (چەندین)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Button
            variant="dashed"
            onClick={() =>
              setArchiveItems((prev) => [
                ...prev,
                {
                  id: `new-${Date.now()}`,
                  title: "",
                  description: "",
                  date: "",
                  category: "",
                  color: "from-amber-600/70 to-orange-700/70",
                  order: prev.length,
                  images: [],
                },
              ])
            }
            className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 text-gray-500 hover:text-teal-600 hover:border-teal-500"
          >
            <Plus className="w-4 h-4 ml-2" />
            زیادکردنی بابەتی نوێ
          </Button>

          <div className="pt-4">
            <Button
              onClick={saveArchive}
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              پاشەکەوتکردن
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  /* ============================
     CONTACT TAB
     ============================ */

  function renderContactTab() {
    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <ScrollArea className="h-[calc(100vh-16rem)] px-1">
        <div className="space-y-6 pb-4">
          {/* Hospital Names */}
          <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-teal-600" />
                زانیاری نەخۆشخانە
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <SettingsField
                label="ناوی نەخۆشخانە (کوردی)"
                value={settings.hospitalNameKu || ""}
                onChange={(v) => updateSetting("hospitalNameKu", v)}
              />
              <SettingsField
                label="ناوی نەخۆشخانە (ئینگلیزی)"
                value={settings.hospitalNameEn || ""}
                onChange={(v) => updateSetting("hospitalNameEn", v)}
              />
            </CardContent>
          </Card>

          {/* Phone & Email */}
          <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600" />
                پەیوەندی
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <SettingsField
                label="ژمارەی تەلەفۆن ١"
                value={settings.phone1 || ""}
                onChange={(v) => updateSetting("phone1", v)}
              />
              <SettingsField
                label="ژمارەی تەلەفۆن ٢"
                value={settings.phone2 || ""}
                onChange={(v) => updateSetting("phone2", v)}
              />
              <SettingsField
                label="ئیمەیل"
                value={settings.email || ""}
                onChange={(v) => updateSetting("email", v)}
              />
              <SettingsField
                label="ناونیشان"
                value={settings.addressKu || ""}
                onChange={(v) => updateSetting("addressKu", v)}
              />
              <SettingsField
                label="کاتەکانی کارکردن"
                value={settings.workingHours || ""}
                onChange={(v) => updateSetting("workingHours", v)}
              />
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-600" />
                تۆڕە کۆمەڵایەتیەکان
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <SettingsField
                label="فەیسبووک"
                value={settings.facebookUrl || ""}
                onChange={(v) => updateSetting("facebookUrl", v)}
              />
              <SettingsField
                label="ئینستاگرام"
                value={settings.instagramUrl || ""}
                onChange={(v) => updateSetting("instagramUrl", v)}
              />
              <SettingsField
                label="تویتەر (X)"
                value={settings.twitterUrl || ""}
                onChange={(v) => updateSetting("twitterUrl", v)}
              />
              <SettingsField
                label="یوتیوب"
                value={settings.youtubeUrl || ""}
                onChange={(v) => updateSetting("youtubeUrl", v)}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="glass rounded-xl border border-white/20 dark:border-gray-700/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <PenSquare className="w-4 h-4 text-teal-600" />
                پێشەکی
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <SettingsField
                label="پێناسەی خوارەوە"
                value={settings.footerDescription || ""}
                onChange={(v) => updateSetting("footerDescription", v)}
                multiline
              />
            </CardContent>
          </Card>

          <div className="pt-4">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              پاشەکەوتکردن
            </Button>
          </div>
        </div>
      </ScrollArea>
    );
  }

  /* ============================
     RENDER
     ============================ */

  return (
    <>
      {/* Floating Admin Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <button
          onClick={() => setOpen(true)}
          className="group relative w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-600/40 hover:scale-110 flex items-center justify-center"
          aria-label="پانێلی بەڕێوەبەر"
        >
          <Settings className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />

          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-teal-600 animate-ping opacity-20" />
        </button>
      </motion.div>

      {/* Admin Panel Sheet */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="left"
          dir="rtl"
          className="w-[95vw] max-w-2xl sm:max-w-3xl p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30 overflow-hidden"
        >
          {!authenticated ? (
            renderPasswordScreen()
          ) : (
            <div className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="p-4 pb-0 shrink-0">
                <SheetTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  پانێلی بەڕێوەبەر
                </SheetTitle>
                <SheetDescription className="text-xs text-gray-500">
                  ئێرە دەتوانیت هەموو بابەتەکانی وێبسایت بەڕێوەبەری بکەیت
                </SheetDescription>
              </SheetHeader>

              {/* Tabs */}
              <div className="px-4 pt-3 shrink-0">
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="w-full h-auto flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <TabsTrigger
                      value="hero"
                      className="flex-1 min-w-0 text-xs py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      <HeartPulse className="w-3.5 h-3.5 ml-1 hidden sm:block" />
                      <span className="truncate">بەشە سەرەکی</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="departments"
                      className="flex-1 min-w-0 text-xs py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      <Stethoscope className="w-3.5 h-3.5 ml-1 hidden sm:block" />
                      <span className="truncate">بەشەکان</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="gallery"
                      className="flex-1 min-w-0 text-xs py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      <ImageIcon className="w-3.5 h-3.5 ml-1 hidden sm:block" />
                      <span className="truncate">گەلەری</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="archive"
                      className="flex-1 min-w-0 text-xs py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      <Archive className="w-3.5 h-3.5 ml-1 hidden sm:block" />
                      <span className="truncate">ئەرشیف و هەواڵ</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="contact"
                      className="flex-1 min-w-0 text-xs py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5 ml-1 hidden sm:block" />
                      <span className="truncate">پەیوەندی</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content */}
                  <div className="mt-4">
                    <TabsContent value="hero">
                      {renderHeroTab()}
                    </TabsContent>
                    <TabsContent value="departments">
                      {renderDepartmentsTab()}
                    </TabsContent>
                    <TabsContent value="gallery">
                      {renderGalleryTab()}
                    </TabsContent>
                    <TabsContent value="archive">
                      {renderArchiveTab()}
                    </TabsContent>
                    <TabsContent value="contact">
                      {renderContactTab()}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ============================
   SUB-COMPONENTS
   ============================ */

function SettingsField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-500 dark:text-gray-400">{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="resize-none"
        />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-sm text-gray-500">بارکردن...</p>
      </div>
    </div>
  );
}
