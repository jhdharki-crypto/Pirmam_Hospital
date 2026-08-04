/* =============================================
   Pirmam Hospital - Archive Section
   Archive of events, achievements, and news with images and descriptions
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* =============================================
   ARCHIVE ITEMS CONFIGURATION
   EDIT: Add, remove, or modify archive items below
   Each item has:
   - id: Unique identifier
   - date: Date string shown in Kurdish
   - category: Type of archive item (event, achievement, news)
   - title: Title in Kurdish
   - description: Full description in Kurdish (can be long)
   - image: Placeholder color gradient until real images added
   - icon: Icon component for the category
   ============================================= */
const archiveItems = [
  {
    id: 1,
    date: "٢٠٢٥/٠١/١٥",
    category: "تۆمار",
    categoryIcon: Award,
    title: "نەخۆشخانەی پیرەمام خەڵاتی باشترین نەخۆشخانەی کوردستانی وەرگرت",
    description:
      "لە ئاهەنگی ساڵانەی تەندروستی کوردستان، نەخۆشخانەی پیرەمام خەڵاتی باشترین نەخۆشخانەی ساڵی وەرگرت. ئەم خەڵاتە بەهۆی خزمەتگوزاری بێنظیری تەندروستی و تیمی شارەزای پزیشکی دابەنرا. ئێمە بە شانازییەوە ئەم سەرکەوتنە پێشکەشی خەڵکی کوردستان دەکەین.",
    image: "from-amber-600/70 to-orange-700/70",
  },
  {
    id: 2,
    date: "٢٠٢٤/١٢/٠١",
    category: "بۆنیانە",
    categoryIcon: Newspaper,
    title: "کەمپەینی تەندروستی بەخۆڕایی بۆ هاوڵاتیان",
    description:
      "نەخۆشخانەی پیرەمام کەمپەینێکی تەندروستی بەخۆڕایی بۆ هاوڵاتیان ئەنجام دا. لەم کەمپەینەدا پشکنینی تەواوی تەندروستی بە بێبەها بۆ زیاتر لە ١٠٠٠ هاوڵاتی ئەنجامدرا. ئەم چالاکییە بەشێک بوو لە ئەرکی کۆمەڵایەتی نەخۆشخانەکە بۆ کۆمەڵگا.",
    image: "from-emerald-600/70 to-teal-700/70",
  },
  {
    id: 3,
    date: "٢٠٢٤/١٠/٢٠",
    category: "فێربوون",
    categoryIcon: GraduationCap,
    title: "سمیناری نێودەوڵەتی پزیشکی لە نەخۆشخانەی پیرەمام",
    description:
      "سمینارێکی نێودەوڵەتی لە بوارەکانی پزیشکی سەرەتایی و نەشتەرگەری لە نەخۆشخانەی پیرەمام بەڕێوەچوو. زیاتر لە ٥٠ پزیشکی شارەزا لە وڵاتانی جیاواز بەشداریان کرد. سمینارەکە لەلایەن مامۆستایان و پسپۆڕانی نێودەوڵەتیەوە ئەنجامدرا.",
    image: "from-cyan-600/70 to-blue-700/70",
  },
  {
    id: 4,
    date: "٢٠٢٤/٠٨/٠٥",
    category: "تۆمار",
    categoryIcon: Building2,
    title: "کراندنەوەی باڵەخانەی نوێی نەخۆشخانە",
    description:
      "باڵەخانەی نوێی نەخۆشخانەی پیرەمام کە لەگەڵ کەرەستەی پێشکەوتووی تەندروستی ئامادەکراوە، بە فەرمی کرایەوە. ئەم باڵەخانەیە لەگەڵ ١٢٠ جێی نەخۆش و ٤ ژووری نەشتەرگەری و تاقیگەی پێشکەوتوو خزمەتگوزاری تەندروستی باشتر پێشکەش دەکات.",
    image: "from-teal-600/70 to-emerald-700/70",
  },
];

/* Section title and description */
const sectionTitle = "ئەرشیف";
const sectionDescription = "بەرنامە، تۆمارەکان و بۆنیانەکانی نەخۆشخانەی پیرەمام";

export function ArchiveSection() {
  /* Track which archive items are expanded to show full description */
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  /* Toggle expand/collapse for an archive item */
  const toggleExpand = (id: number) => {
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
            const Icon = item.categoryIcon;

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
                  {/* Image placeholder
                      EDIT: Replace this div with an actual <Image> component:
                      <Image src={item.imageSrc} alt={item.title} width={200} height={200} className="object-cover" /> */}
                  <div
                    className={`sm:w-48 md:w-56 aspect-video sm:aspect-auto bg-gradient-to-br ${item.image} flex-shrink-0 flex items-center justify-center relative`}
                  >
                    <Icon className="w-10 h-10 text-white/40" />
                    {/* Category badge on the image */}
                    <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Content area */}
                  <div className="flex-1 p-4 sm:p-6">
                    {/* Date and title */}
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 leading-relaxed">
                      {item.title}
                    </h3>

                    {/* Description with expand/collapse */}
                    <div className="relative">
                      <p
                        className={`text-xs sm:text-sm text-muted-foreground leading-relaxed ${
                          !isExpanded ? "line-clamp-2" : ""
                        }`}
                      >
                        {item.description}
                      </p>

                      {/* Expand/collapse button */}
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
