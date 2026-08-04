/* =============================================
   Pirmam Hospital - Hero / Home Section
   The main landing section with hospital intro
   ============================================= */

"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

/* =============================================
   HERO CONTENT CONFIGURATION
   EDIT: Change the text, descriptions, and stats below
   ============================================= */

/* Main heading text */
const heroTitle = "نەخۆشخانەی پیرەمام";
/* Subtitle / tagline */
const heroSubtitle = "خزمەتگوزاری تەندروستی بەرز و متمانەپێکراو";
/* Main description paragraph */
const heroDescription =
  "ئێمە لە نەخۆشخانەی پیرەمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش بۆ خەڵکی کوردستان دەکەین. تەندروستی خەڵک ئەولویەتی ئێمەیە.";

/* Quick stats shown below the hero text */
const heroStats = [
  { icon: Users, value: "٢٠٠+", label: "پزیشکی شارەزا" },       // 200+ Expert Doctors
  { icon: HeartPulse, value: "٥٠٠٠٠+", label: "نەخۆشی سەردەم" },  // 50000+ Patients Treated
  { icon: ShieldCheck, value: "٢٤/٧", label: "خزمەتگوزاری" },      // 24/7 Service
  { icon: Clock, value: "١٥+", label: "ساڵ ئەزموون" },          // 15+ Years Experience
];

/* Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* === ANIMATED BACKGROUND EFFECTS === 
          Creates floating medical-themed gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large gradient orb - top right */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-primary/20 to-medical-dark/10 rounded-full blur-3xl animate-pulse-glow" />
        {/* Medium gradient orb - bottom left */}
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tr from-medical/15 to-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        {/* Small accent orb - center */}
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-bl from-medical-glow/10 to-transparent rounded-full blur-2xl animate-float" />
        {/* Grid pattern overlay for medical/tech feel */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* === MAIN HERO CONTENT === */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Hospital badge/tag */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary border border-primary/20">
            <HeartPulse className="w-3.5 h-3.5" />
            خزمەتگوزاری تەندروستی لە کوردستان
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-4 sm:mb-6"
        >
          <span className="bg-gradient-to-l from-foreground via-foreground to-primary bg-clip-text text-transparent">
            {heroTitle}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-primary font-semibold mb-4 sm:mb-6"
        >
          {heroSubtitle}
        </motion.p>

        {/* Description paragraph */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
        >
          {heroDescription}
        </motion.p>

        {/* Quick stats row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          {heroStats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-3 sm:p-4 hover:bg-primary/5 transition-colors group"
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* === BOTTOM FADE EFFECT === 
          Smooth transition into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
