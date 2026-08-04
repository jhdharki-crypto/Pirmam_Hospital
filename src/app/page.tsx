/* =============================================
   Pirmam Hospital - Main Page
   Assembles all sections: Header, Hero, Departments, Gallery, Archive, Footer
   =============================================

   HOW TO EDIT THIS WEBSITE:
   =========================
   1. HEADER: Edit src/components/header.tsx
      - Logo, navigation links, theme toggle
   
   2. HERO SECTION: Edit src/components/hero-section.tsx
      - Title, subtitle, description, stats
   
   3. DEPARTMENTS: Edit src/components/departments-section.tsx
      - Add/remove hospital departments
   
   4. GALLERY: Edit src/components/gallery-section.tsx
      - Add/remove photos (replace placeholders with real images)
   
   5. ARCHIVE: Edit src/components/archive-section.tsx
      - Add/remove archive items with images and descriptions
   
   6. FOOTER: Edit src/components/footer.tsx
      - Phone, email, address, social media links
   
   7. COLORS/THEME: Edit src/app/globals.css
      - Change medical color theme variables
   
   8. META/SEO: Edit src/app/layout.tsx
      - Page title, description, keywords

   9. BACKGROUND ANIMATION: Edit src/components/medical-background.tsx
      - Add/remove floating medical equipment shapes
   ============================================= */

import { Header } from "@/components/header";
import { MedicalBackground } from "@/components/medical-background";
import { HeroSection } from "@/components/hero-section";
import { DepartmentsSection } from "@/components/departments-section";
import { GallerySection } from "@/components/gallery-section";
import { ArchiveSection } from "@/components/archive-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    /* Main wrapper: min-h-screen + flex-col ensures sticky footer works */
    <div className="min-h-screen flex flex-col">
      {/* === FLOATING MEDICAL EQUIPMENT BACKGROUND ===
          Subtle animated SVG shapes (ECG, syringe, stethoscope, etc.)
          EDIT: src/components/medical-background.tsx */}
      <MedicalBackground />

      {/* Fixed navigation header */}
      <Header />

      {/* Main content area - grows to push footer down */}
      <main className="flex-1 relative z-10">
        {/* Home / Hero Section */}
        <HeroSection />

        {/* Hospital Departments Section */}
        <DepartmentsSection />

        {/* Photo Gallery Section */}
        <GallerySection />

        {/* Archive Section (events, news, achievements with descriptions) */}
        <ArchiveSection />
      </main>

      {/* Footer with contact info, social media, developer credit */}
      <Footer />
    </div>
  );
}
