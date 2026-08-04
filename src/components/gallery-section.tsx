/* =============================================
   Pirmam Hospital - Gallery Section
   Photo gallery showcasing hospital facilities and events
   ============================================= */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =============================================
   GALLERY IMAGES CONFIGURATION
   EDIT: Replace the items below with your actual images
   Each item has:
   - src: Path to the image file (place images in /public/gallery/)
   - alt: Kurdish description shown as alt text and caption
   - title: Short title for the image
   ============================================= */
const galleryImages = [
  {
    src: "/gallery/placeholder-1.jpg",
    alt: "دەرەوەی نەخۆشخانەی پیرەمام",
    title: "دەرەوەی نەخۆشخانە",
    /* color: placeholder gradient color until real images are added */
    color: "from-teal-600/80 to-emerald-700/80",
  },
  {
    src: "/gallery/placeholder-2.jpg",
    alt: "سەردانی نەخۆشان لە نەخۆشخانە",
    title: "سەردانی نەخۆشان",
    color: "from-emerald-600/80 to-teal-700/80",
  },
  {
    src: "/gallery/placeholder-3.jpg",
    alt: "تاقیگەی پێشکەوتووی نەخۆشخانە",
    title: "تاقیگەی پێشکەوتوو",
    color: "from-cyan-600/80 to-teal-700/80",
  },
  {
    src: "/gallery/placeholder-4.jpg",
    alt: "ئۆپەراسیۆنخانەی نەخۆشخانەی پیرەمام",
    title: "ئۆپەراسیۆنخانە",
    color: "from-teal-700/80 to-cyan-600/80",
  },
  {
    src: "/gallery/placeholder-5.jpg",
    alt: "مەکینەی پشکنینی مەڕگە",
    title: "پشکنینی مەڕگە",
    color: "from-emerald-700/80 to-teal-600/80",
  },
  {
    src: "/gallery/placeholder-6.jpg",
    alt: "هۆڵی وەرگرتنی نەخۆشخانە",
    title: "هۆڵی وەرگرتن",
    color: "from-cyan-700/80 to-emerald-600/80",
  },
];

/* Section title and description */
const sectionTitle = "گەلەری وێنە";
const sectionDescription = "وێنەیەکانی نەخۆشخانەی پیرەمام - بینینی نزیک لە فەزا و کەرەستەکانی نەخۆشخانە";

export function GallerySection() {
  /* State for the lightbox modal */
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              {/* 
                Placeholder gradient background.
                EDIT: Replace this div with an actual <Image> component:
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
              */}
              <div className={`absolute inset-0 bg-gradient-to-br ${image.color} flex items-center justify-center`}>
                <span className="text-white/60 text-sm font-medium">{image.title}</span>
              </div>

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-75">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Title overlay at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs sm:text-sm font-medium">
                  {image.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === LIGHTBOX MODAL === */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 text-white hover:bg-white/10 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 
                Lightbox image display.
                EDIT: Replace this div with an actual <Image> component
              */}
              <div className={`aspect-video rounded-2xl overflow-hidden bg-gradient-to-br ${galleryImages[selectedImage].color} flex items-center justify-center`}>
                <span className="text-white/60 text-lg font-medium">
                  {galleryImages[selectedImage].title}
                </span>
              </div>
              <p className="text-white/70 text-sm mt-4 text-center">
                {galleryImages[selectedImage].alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
