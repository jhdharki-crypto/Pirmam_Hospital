/* =============================================
   Pirmam Hospital - Archive Section
   Archive of events, achievements, and news with multiple images
   Content loaded from database via content store
   ============================================= */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Award,
  Newspaper,
  GraduationCap,
  Building2,
  X,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-store";

/* Category icon mapping */
const categoryIconMap: Record<string, LucideIcon> = {
  "تۆمار": Award,
  "بۆنیانە": Newspaper,
  "فێربوون": GraduationCap,
};

export function ArchiveSection() {
  const { archiveItems, getSetting } = useContent();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<{
    archiveId: string;
    imageIndex: number;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sectionTitle = getSetting("archiveSectionTitle");
  const sectionDescription = getSetting("archiveSectionDesc");

  /* Get the lightbox data */
  const lightboxItem = lightbox
    ? archiveItems.find((a) => a.id === lightbox.archiveId)
    : null;
  const lightboxImages = lightboxItem?.images || [];
  const lightboxCurrentUrl =
    lightboxImages.length > 0 ? lightboxImages[lightbox.imageIndex]?.url : null;

  const lightboxPrev = () => {
    if (!lightbox) return;
    const len = lightboxImages.length;
    setLightbox({
      ...lightbox,
      imageIndex: (lightbox.imageIndex - 1 + len) % len,
    });
  };

  const lightboxNext = () => {
    if (!lightbox) return;
    const len = lightboxImages.length;
    setLightbox({
      ...lightbox,
      imageIndex: (lightbox.imageIndex + 1) % len,
    });
  };

  return (
    <section id="archive" className="relative py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-l from-foreground to-primary bg-clip-text text-transparent">
              {sectionTitle}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {sectionDescription}
          </p>
          <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-l from-primary to-medical-dark" />
        </motion.div>

        {/* === ARCHIVE ITEMS LIST === */}
        <div className="space-y-6">
          {archiveItems.map((item, index) => {
            const isExpanded = expandedIds.has(item.id);
            const Icon = categoryIconMap[item.category] || Building2;
            const hasImages = item.images && item.images.length > 0;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail: first image or color placeholder */}
                  {hasImages ? (
                    <div
                      className="sm:w-48 md:w-56 aspect-video sm:aspect-auto flex-shrink-0 relative overflow-hidden cursor-pointer"
                      onClick={() =>
                        setLightbox({ archiveId: item.id, imageIndex: 0 })
                      }
                    >
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Show image count badge if multiple */}
                      {item.images.length > 1 && (
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <ZoomIn className="w-2.5 h-2.5" />
                          {item.images.length}
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  ) : (
                    <div
                      className={`sm:w-48 md:w-56 aspect-video sm:aspect-auto bg-gradient-to-br ${item.color} flex-shrink-0 flex items-center justify-center relative`}
                    >
                      <Icon className="w-10 h-10 text-white/40" />
                      <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  )}

                  {/* Content area */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 leading-relaxed">
                      {item.title}
                    </h3>

                    <div className="relative">
                      <p
                        className={`text-xs sm:text-sm text-muted-foreground leading-relaxed ${
                          !isExpanded ? "line-clamp-2" : ""
                        }`}
                      >
                        {item.description}
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(item.id)}
                        className="mt-2 text-primary hover:text-primary/80 text-xs gap-1 px-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            کەمکردنەوە
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            زیاتر بخوێنەوە
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* === IMAGE GALLERY GRID (shown when expanded and has images) === */}
                <AnimatePresence>
                  {isExpanded && hasImages && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                          {item.images.map((img, imgIdx) => (
                            <motion.div
                              key={img.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: imgIdx * 0.05 }}
                              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/img"
                              onClick={() =>
                                setLightbox({
                                  archiveId: item.id,
                                  imageIndex: imgIdx,
                                })
                              }
                            >
                              <img
                                src={img.url}
                                alt={`${item.title} - ${imgIdx + 1}`}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* === LIGHTBOX MODAL === */}
      <AnimatePresence>
        {lightbox && lightboxCurrentUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 text-white hover:bg-white/10 z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 right-4 text-white/70 text-sm z-10">
              {lightbox.imageIndex + 1} / {lightboxImages.length}
            </div>

            {/* Previous button */}
            {lightboxImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Next button */}
            {lightboxImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            <motion.div
              key={lightbox.imageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxCurrentUrl}
                alt={lightboxItem?.title || ""}
                className="w-full rounded-2xl object-contain max-h-[75vh]"
              />
              {lightboxItem && (
                <p className="text-white/70 text-sm mt-4 text-center">
                  {lightboxItem.title}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
