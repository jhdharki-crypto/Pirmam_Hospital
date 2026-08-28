/* =============================================
   Pirmam Hospital - Archive Section
   Archive of events, achievements, and news with multiple images
   Content loaded from database via content store
   With swipe carousel support for images
   ============================================= */

"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
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
  "\u062A\u06C6\u0645\u0627\u0631": Award,
  "\u0628\u06C6\u0646\u06CC\u0627\u0646\u06D5": Newspaper,
  "\u0641\u06CE\u0631\u0628\u0648\u0648\u0646": GraduationCap,
};

/* Swipe threshold in pixels */
const SWIPE_THRESHOLD = 50;

export function ArchiveSection() {
  const { archiveItems, getSetting } = useContent();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<{
    archiveId: string;
    imageIndex: number;
  } | null>(null);

  /* Swipeable carousel state per archive item */
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({});

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
    lightboxImages.length > 0
      ? lightboxImages[lightbox!.imageIndex]?.url
      : null;

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

  /* Lightbox swipe handler */
  const handleLightboxDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!lightbox) return;
    if (info.offset.x < -SWIPE_THRESHOLD) {
      lightboxNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      lightboxPrev();
    }
  };

  /* Carousel swipe handler factory */
  const handleCarouselDragEnd =
    (archiveId: string, totalImages: number) =>
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentIdx = carouselIndex[archiveId] || 0;
      if (info.offset.x < -SWIPE_THRESHOLD) {
        setCarouselIndex((prev) => ({
          ...prev,
          [archiveId]: Math.min(currentIdx + 1, totalImages - 1),
        }));
      } else if (info.offset.x > SWIPE_THRESHOLD) {
        setCarouselIndex((prev) => ({
          ...prev,
          [archiveId]: Math.max(currentIdx - 1, 0),
        }));
      }
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
            const currentCarouselIdx = carouselIndex[item.id] || 0;

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
                  {/* Thumbnail: swipeable on mobile */}
                  {hasImages ? (
                    <div className="sm:w-48 md:w-56 aspect-video sm:aspect-auto flex-shrink-0 relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentCarouselIdx}
                          src={item.images[currentCarouselIdx].url}
                          alt={item.title}
                          className="w-full h-full object-cover cursor-pointer"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.2 }}
                          drag={item.images.length > 1 ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.1}
                          onDragEnd={handleCarouselDragEnd(
                            item.id,
                            item.images.length
                          )}
                          onClick={() =>
                            setLightbox({
                              archiveId: item.id,
                              imageIndex: currentCarouselIdx,
                            })
                          }
                        />
                      </AnimatePresence>
                      {/* Image count + swipe dots on thumbnail */}
                      {item.images.length > 1 && (
                        <>
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <ZoomIn className="w-2.5 h-2.5" />
                            {item.images.length}
                          </div>
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            {item.images.slice(0, 5).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-200 ${
                                  i === currentCarouselIdx
                                    ? "bg-white w-3"
                                    : "bg-white/40"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCarouselIndex((prev) => ({
                                    ...prev,
                                    [item.id]: i,
                                  }));
                                }}
                              />
                            ))}
                          </div>
                        </>
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
                      <span className="text-xs text-muted-foreground">
                        {item.date}
                      </span>
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

                {/* === SWIPEABLE IMAGE CAROUSEL (expanded) === */}
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
                        <div className="relative">
                          {/* Main carousel image */}
                          <div className="overflow-hidden rounded-xl">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentCarouselIdx}
                                className="relative aspect-[4/3] sm:aspect-video w-full"
                                initial={{ opacity: 0, x: 80 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -80 }}
                                transition={{
                                  duration: 0.25,
                                  ease: "easeInOut",
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.15}
                                onDragEnd={handleCarouselDragEnd(
                                  item.id,
                                  item.images.length
                                )}
                                onClick={() =>
                                  setLightbox({
                                    archiveId: item.id,
                                    imageIndex: currentCarouselIdx,
                                  })
                                }
                                style={{ cursor: "grab" }}
                              >
                                <img
                                  src={
                                    item.images[currentCarouselIdx].url
                                  }
                                  alt={`${item.title} - ${currentCarouselIdx + 1}`}
                                  className="w-full h-full object-cover rounded-xl"
                                  draggable={false}
                                />
                                {/* Zoom overlay */}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                                  <ZoomIn className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                </div>
                                {/* Counter badge */}
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                                  {currentCarouselIdx + 1} /{" "}
                                  {item.images.length}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Navigation arrows */}
                          {item.images.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                                onClick={() => {
                                  const newIdx = Math.max(
                                    (carouselIndex[item.id] || 0) - 1,
                                    0
                                  );
                                  setCarouselIndex((prev) => ({
                                    ...prev,
                                    [item.id]: newIdx,
                                  }));
                                }}
                                disabled={currentCarouselIdx === 0}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                                onClick={() => {
                                  const newIdx = Math.min(
                                    (carouselIndex[item.id] || 0) + 1,
                                    item.images.length - 1
                                  );
                                  setCarouselIndex((prev) => ({
                                    ...prev,
                                    [item.id]: newIdx,
                                  }));
                                }}
                                disabled={
                                  currentCarouselIdx ===
                                  item.images.length - 1
                                }
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {/* Dot indicators */}
                          {item.images.length > 1 && (
                            <div className="flex justify-center gap-1.5 mt-3">
                              {item.images.map((_, i) => (
                                <button
                                  key={i}
                                  className={`h-2 rounded-full transition-all duration-200 ${
                                    i === currentCarouselIdx
                                      ? "bg-primary w-6"
                                      : "bg-primary/25 w-2 hover:bg-primary/40"
                                  }`}
                                  onClick={() =>
                                    setCarouselIndex((prev) => ({
                                      ...prev,
                                      [item.id]: i,
                                    }))
                                  }
                                />
                              ))}
                            </div>
                          )}

                          {/* Thumbnail strip */}
                          {item.images.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                              {item.images.map((img, i) => (
                                <button
                                  key={img.id}
                                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    i === currentCarouselIdx
                                      ? "border-primary ring-2 ring-primary/30"
                                      : "border-transparent opacity-60 hover:opacity-100"
                                  }`}
                                  onClick={() =>
                                    setCarouselIndex((prev) => ({
                                      ...prev,
                                      [item.id]: i,
                                    }))
                                  }
                                >
                                  <img
                                    src={img.url}
                                    alt={`${item.title} - ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
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

      {/* === LIGHTBOX MODAL WITH SWIPE === */}
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
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 bg-black/20 hover:bg-black/40 rounded-full"
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
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 bg-black/20 hover:bg-black/40 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Swipeable image */}
            <motion.div
              key={lightbox.imageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag={lightboxImages.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleLightboxDragEnd}
              className="max-w-4xl w-full cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxCurrentUrl}
                alt={lightboxItem?.title || ""}
                className="w-full rounded-2xl object-contain max-h-[75vh]"
                draggable={false}
              />
              {lightboxItem && (
                <p className="text-white/70 text-sm mt-4 text-center">
                  {lightboxItem.title}
                </p>
              )}
            </motion.div>

            {/* Lightbox dot indicators */}
            {lightboxImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {lightboxImages.map((_, i) => (
                  <button
                    key={i}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === lightbox.imageIndex
                        ? "bg-white w-6"
                        : "bg-white/30 w-2 hover:bg-white/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox((prev) =>
                        prev ? { ...prev, imageIndex: i } : null
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}