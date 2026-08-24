/* =============================================
   Pirmam Hospital - Gallery Section
   Photo gallery with swipe support
   Content loaded from database via content store
   ============================================= */

"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-store";

const SWIPE_THRESHOLD = 50;

export function GallerySection() {
  const { galleryItems, getSetting } = useContent();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const sectionTitle = getSetting("gallerySectionTitle");
  const sectionDescription = getSetting("gallerySectionDesc");

  const total = galleryItems.length;

  const prevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage - 1 + total) % total);
  };

  const nextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage + 1) % total);
  };

  /* Swipe handler for lightbox */
  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (selectedImage === null) return;
    if (info.offset.x < -SWIPE_THRESHOLD) {
      nextImage();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      prevImage();
    }
  };

  return (
    <section id="gallery" className="relative py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* === GALLERY GRID === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              {image.image ? (
                <img
                  src={image.image}
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${image.color} flex items-center justify-center`}
                >
                  <span className="text-white/60 text-sm font-medium">
                    {image.title}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-75">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs sm:text-sm font-medium">
                  {image.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === LIGHTBOX MODAL WITH SWIPE === */}
      <AnimatePresence>
        {selectedImage !== null && galleryItems[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 text-white hover:bg-white/10 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 right-4 text-white/70 text-sm z-10">
              {selectedImage + 1} / {total}
            </div>

            {/* Previous button */}
            {total > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 bg-black/20 hover:bg-black/40 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Next button */}
            {total > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 bg-black/20 hover:bg-black/40 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Swipeable image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag={total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="max-w-4xl w-full cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[selectedImage].image ? (
                <img
                  src={galleryItems[selectedImage].image!}
                  alt={galleryItems[selectedImage].title}
                  className="aspect-video w-full rounded-2xl object-cover"
                  draggable={false}
                />
              ) : (
                <div
                  className={`aspect-video rounded-2xl overflow-hidden bg-gradient-to-br ${galleryItems[selectedImage].color} flex items-center justify-center`}
                >
                  <span className="text-white/60 text-lg font-medium">
                    {galleryItems[selectedImage].title}
                  </span>
                </div>
              )}
              <p className="text-white/70 text-sm mt-4 text-center">
                {galleryItems[selectedImage].description ||
                  galleryItems[selectedImage].title}
              </p>
            </motion.div>

            {/* Dot indicators */}
            {total > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {galleryItems.map((_, i) => (
                  <button
                    key={i}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === selectedImage
                        ? "bg-white w-6"
                        : "bg-white/30 w-2 hover:bg-white/50"
                    }`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(i);
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
