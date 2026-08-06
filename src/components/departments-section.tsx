/* =============================================
   Pirmam Hospital - Departments Section
   Shows all hospital departments with icons and optional images
   Content is loaded from database via content store
   ============================================= */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
  /* --- New medical icons --- */
  BrainCircuit,
  ScanHeart,
  ScanEye,
  ScanFace,
  ScissorsLineDashed,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Bandage,
  Ambulance,
  Hospital,
  Siren,
  BedDouble,
  Dna,
  Droplets,
  Dumbbell,
  Footprints,
  Fingerprint,
  HandHeart,
  HandHelping,
  Waves,
  WavesLadder,
  Ribbon,
  ShieldCheck,
  FlaskConical,
  Beaker,
  ClipboardList,
  ClipboardCheck,
  GaugeCircle,
  Atom,
  Smile,
  Laugh,
  PillBottle,
  type LucideIcon,
} from "lucide-react";
import { useContent } from "@/lib/content-store";

/* Icon mapping from name string to component — comprehensive medical icon set */
const iconMap: Record<string, LucideIcon> = {
  /* Original 12 */
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
  /* Brain / Neuro */
  BrainCircuit,
  /* Cardiology / Heart */
  ScanHeart,
  /* Eye / Ophthalmology */
  ScanEye,
  /* Face / Maxillofacial */
  ScanFace,
  /* Surgery */
  ScissorsLineDashed,
  /* Fever / Internal */
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  /* First Aid */
  Bandage,
  /* Emergency */
  Ambulance,
  Hospital,
  Siren,
  /* Inpatient / ICU */
  BedDouble,
  /* Genetics */
  Dna,
  /* Kidney / Nephrology / Blood */
  Droplets,
  /* Physiotherapy / Rehab */
  Dumbbell,
  /* Podiatry / Feet */
  Footprints,
  /* Dermatology / Skin */
  Fingerprint,
  /* Hand / Plastic Surgery */
  HandHeart,
  /* Patient Care */
  HandHelping,
  /* Pulmonology / Respiratory */
  Waves,
  WavesLadder,
  /* Oncology / Cancer */
  Ribbon,
  /* Infection Control */
  ShieldCheck,
  /* Lab / Chemistry */
  FlaskConical,
  Beaker,
  /* Medical Records */
  ClipboardList,
  ClipboardCheck,
  /* ICU / Blood Pressure */
  GaugeCircle,
  /* Radiology */
  Atom,
  /* Dentistry */
  Smile,
  /* Psychiatry / Mental Health */
  Laugh,
  /* Pharmacy */
  PillBottle,
};

/* Animation for each card */
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function DepartmentsSection() {
  const { departments, getSetting } = useContent();

  const sectionTitle = getSetting("deptSectionTitle");
  const sectionDescription = getSetting("deptSectionDesc");

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
          <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-l from-primary to-medical-dark" />
        </motion.div>

        {/* === DEPARTMENTS GRID === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {departments.map((dept, index) => {
            const IconComp = iconMap[dept.iconName] || HeartPulse;

            return (
              <motion.div
                key={dept.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                className="group relative glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-default"
              >
                {/* Department image or icon */}
                {dept.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={dept.image}
                      alt={dept.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <h3 className="absolute bottom-3 right-4 text-white text-base sm:text-lg font-bold">
                      {dept.name}
                    </h3>
                  </div>
                ) : (
                  <div className="p-5 sm:p-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/15 to-medical-dark/10 flex items-center justify-center mb-4 group-hover:from-primary/25 group-hover:to-medical-dark/20 transition-colors">
                      <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                  </div>
                )}

                {/* Description */}
                <div className={dept.image ? "p-4 sm:p-5 pt-0" : "px-5 sm:px-6 pb-5 sm:pb-6 -mt-1"}>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                {/* Subtle corner decoration */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
