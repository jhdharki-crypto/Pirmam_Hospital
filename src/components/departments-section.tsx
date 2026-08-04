/* =============================================
   Pirmam Hospital - Departments Section
   Shows all hospital departments with icons
   ============================================= */

"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Eye,
  Stethoscope,
  Pill,
  Microscope,
  Syringe,
  ScanLine,
  Activity,
  Ear,
} from "lucide-react";

/* =============================================
   DEPARTMENTS CONFIGURATION
   EDIT: Add, remove, or modify departments below
   Each department has:
   - icon: A Lucide icon component
   - name: The department name in Kurdish
   - description: Brief description in Kurdish
   ============================================= */
const departments = [
  {
    icon: HeartPulse,
    name: "دڵ و مەڕگە",
    description: "چارەسەری نەخۆشیەکانی دڵ و خولانەوەی خوێن بە کەرەستەی پێشکەوتوو",
  },
  {
    icon: Brain,
    name: "دەمارۆکی",
    description: "پشکنین و چارەسەری نەخۆشیەکانی مێشک و سیستەمی دەمار",
  },
  {
    icon: Bone,
    name: "ئێسک و چەوری",
    description: "چارەسەری برین و نەخۆشیەکانی ئێسک و چەوری",
  },
  {
    icon: Baby,
    name: "منداڵان",
    description: "خزمەتگوزاری تەندروستی تایبەت بۆ منداڵان و ساوایان",
  },
  {
    icon: Eye,
    name: "چاو",
    description: "پشکنین و چارەسەری هەموو جۆرە نەخۆشیەکانی چاو",
  },
  {
    icon: Stethoscope,
    name: "ناوخۆیی",
    description: "پشکنین و چارەسەری نەخۆشیەکانی ئەندامە ناوخۆییەکان",
  },
  {
    icon: Pill,
    name: "دەرمانسازی",
    description: "دابینکردنی دەرمانی ستاندارد و ڕاوێژکاری دەرمانی",
  },
  {
    icon: Microscope,
    name: "تاقیگە",
    description: "تاقیگەی پێشکەوتوو بۆ هەموو جۆرە پشکنینەکان",
  },
  {
    icon: Syringe,
    name: "بەرگری",
    description: "وەرگرتنی بەرگری و چارەسەری خوێن",
  },
  {
    icon: ScanLine,
    name: "ڕادیۆلۆژی",
    description: "پشکنینی ئێکس ڕەی، سی تی سکان، و ئێم ئاڕ ئای",
  },
  {
    icon: Activity,
    name: "فریاکەوتن",
    description: "خزمەتگوزاری فریاکەوتنی خێرا بۆ هەموو کات",
  },
  {
    icon: Ear,
    name: "لوو و دەموچاو و قوڕگ",
    description: "چارەسەری نەخۆشیەکانی لوو، قوڕگ و دەموچاو",
  },
];

/* Section title and description */
const sectionTitle = "بەشەکانی نەخۆشخانە";
const sectionDescription = "نەخۆشخانەی پیرەمام بەشەکی تایبەت و شارەزای هەیە بۆ چارەسەری هەموو جۆرە نەخۆشیەک";

/* Animation for each card */
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function DepartmentsSection() {
  return (
    <section id="departments" className="relative py-20 sm:py-28">
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
          {/* Decorative line under title */}
          <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-l from-primary to-medical-dark" />
        </motion.div>

        {/* === DEPARTMENTS GRID === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
              className="group relative glass rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-default"
            >
              {/* Icon container with gradient background */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/15 to-medical-dark/10 flex items-center justify-center mb-4 group-hover:from-primary/25 group-hover:to-medical-dark/20 transition-colors">
                <dept.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform" />
              </div>

              {/* Department name */}
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {dept.name}
              </h3>

              {/* Department description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {dept.description}
              </p>

              {/* Subtle corner decoration on hover */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
