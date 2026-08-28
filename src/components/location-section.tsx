/* =============================================
   Pirmam Hospital - Location Section
   Google Maps embed with admin-configurable link
   Content loaded from database via content store
   ============================================= */

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-store";

/** Convert a Google Maps URL to an embed URL */
function toEmbedUrl(mapLink: string): string | null {
  if (!mapLink) return null;

  // Already an embed URL
  if (mapLink.includes("google.com/maps/embed")) return mapLink;

  // Extract place from URL patterns:
  // https://www.google.com/maps/place/.../@lat,lng,z
  // https://www.google.com/maps?q=...
  // https://maps.google.com/?q=...
  // https://maps.app.goo.gl/...
  try {
    const url = new URL(mapLink);

    // If there's a query param 'q' or 'query', use that
    const query = url.searchParams.get("q") || url.searchParams.get("query");
    if (query) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`;
    }

    // If there's a place path: /maps/place/Name/@lat,lng
    const placeMatch = url.pathname.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeMatch[1])}`;
    }

    // Extract @lat,lng from URL
    const atMatch = url.pathname.match(/@([\d.-]+),([\d.-]+)/);
    if (atMatch) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${atMatch[1]},${atMatch[2]}`;
    }

    // If it's a short URL (maps.app.goo.gl), just embed the original URL as iframe src
    if (url.hostname.includes("maps.app.goo.gl")) {
      return null; // Can't embed short URLs, will show link instead
    }

    // Fallback: use the full URL as a search query
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapLink)}`;
  } catch {
    // Not a valid URL - treat as a place name search
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapLink)}`;
  }
}

export function LocationSection() {
  const { getSetting } = useContent();
  const mapLink = getSetting("mapLink");
  const addressKu = getSetting("addressKu");
  const sectionTitle = getSetting("locationSectionTitle") || "شوێنی نەخۆشخانەکەمان";
  const sectionDescription = getSetting("locationSectionDesc") || "نەخۆشخانەکەمان پێرمام داگماوە باشی نەخۆشخانەکەمان پێرمام";

  const embedUrl = useMemo(() => toEmbedUrl(mapLink), [mapLink]);

  // Don't render section if no map link is set
  if (!mapLink) return null;

  return (
    <section id="location" className="relative py-20 sm:py-28">
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

        {/* === MAP CONTAINER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass rounded-2xl overflow-hidden border border-border/50">
            {/* Address bar above map */}
            {addressKu && (
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 bg-primary/5 border-b border-border/50">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground font-medium">
                  {addressKu}
                </span>
              </div>
            )}

            {/* Map iframe or fallback link */}
            {embedUrl ? (
              <div className="relative w-full" style={{ paddingBottom: "45%" }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="شوێنی نەخۆشخانەی پیرمام"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Navigation className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">
                  نەخۆشخانەی پیرمام لەسەر نەخشەکە
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  بۆ بینینی شوێنی نەخۆشخانەکە لە Google Maps کلیک بکە
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    بینینی لە Google Maps
                  </a>
                </Button>
              </div>
            )}

            {/* "Get Directions" button */}
            <div className="px-4 sm:px-5 py-3 bg-primary/5 border-t border-border/50 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary hover:text-primary/80 text-xs gap-1.5"
              >
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  ڕێنماییەکان ببینە
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}