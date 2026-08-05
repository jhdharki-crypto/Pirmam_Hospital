/* =============================================
   Pirmam Hospital - Header / Navigation Bar
   Includes: Logo, Navigation links (from settings), Dark/Light toggle
   All labels are editable via the Admin Panel
   ============================================= */

"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-store";

/* Navigation link structure - labels come from database settings */
const navLinksConfig = [
  { href: "#home", settingKey: "navLabelHome", defaultLabel: "سەرەتا" },
  { href: "#departments", settingKey: "navLabelDepartments", defaultLabel: "بەشەکان" },
  { href: "#gallery", settingKey: "navLabelGallery", defaultLabel: "گەلەری" },
  { href: "#archive", settingKey: "navLabelArchive", defaultLabel: "ئەرشیف و هەواڵی نەخۆشخانە" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { settings, loaded } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Use useSyncExternalStore to detect if component is mounted (client-side) */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  /* Build nav links from settings - fallback to defaults */
  const navLinks = navLinksConfig.map((link) => ({
    href: link.href,
    label: settings[link.settingKey] || link.defaultLabel,
  }));

  /* Hospital name from settings */
  const hospitalNameKu = settings.hospitalNameKu || "نەخۆشخانەی پیرمام";
  const hospitalNameEn = settings.hospitalNameEn || "Pirmam Hospital";

  /* Track scroll position to add background blur on header */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* === HOSPITAL LOGO ===
              The logo image is at: public/logo.png
              To change the logo, replace the file at: public/logo.png */}
          <a href="#home" className="flex items-center gap-2 group">
            {/* EDIT: Change the logo image by replacing public/logo.png */}
            <Image
              src="/logo.png"
              alt="نەخۆشخانەی پیرمام - Pirmam Hospital Logo"
              width={44}
              height={44}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-lg group-hover:shadow-primary/30 transition-shadow"
              priority
            />
            {/* Hospital name next to logo - comes from settings */}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-l from-primary to-medical-dark bg-clip-text text-transparent leading-tight">
                {hospitalNameKu}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                {hospitalNameEn}
              </span>
            </div>
          </a>

          {/* === DESKTOP NAVIGATION === */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group rounded-lg"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-px h-0.5 bg-gradient-to-l from-primary to-medical-dark rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </a>
            ))}
          </nav>

          {/* === RIGHT SIDE: Theme Toggle + Mobile Menu === */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-primary/10"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full w-9 h-9 sm:w-10 sm:h-10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* === MOBILE NAVIGATION MENU === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
