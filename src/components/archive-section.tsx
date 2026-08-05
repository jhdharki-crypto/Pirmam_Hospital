/* =============================================
   Pirmam Hospital - Archive Section
   Archive of events, achievements, and news
   Content loaded from database via content store
   ============================================= */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Award,
  Newspaper,
  GraduationCap,
  Building2,
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
                  {/* Image or color placeholder */}
                  {item.image ? (
                    <div className="sm:w-48 md:w-56 aspect-video sm:aspect-auto flex-shrink-0 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
