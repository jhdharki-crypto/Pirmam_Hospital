/* =============================================
   Pirmam Hospital - Header / Navigation Bar
   Includes: Logo placeholder, Navigation links, Dark/Light toggle
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
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =============================================
   NAVIGATION LINKS CONFIGURATION
   EDIT: Change the labels or add/remove links below
   href should match the section id in the page
   ============================================= */
const navLinks = [
  { href: "#home", label: "سەرەتا" },       // Home
  { href: "#departments", label: "بەشەکان" },   // Departments
  { href: "#gallery", label: "گەلەری" },     // Gallery
  { href: "#archive", label: "ئەرشیف" },      // Archive
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Use useSyncExternalStore to detect if component is mounted (client-side) */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

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

          {/* === LOGO PLACEHOLDER === 
              EDIT: Replace this div with your actual <Image /> or <img /> tag
              Example: <Image src="/your-logo.png" alt="Pirmam Hospital" width={140} height={40} /> */}
          <a href="#home" className="flex items-center gap-2 group">
            {/* Logo icon - replace with actual logo image */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-medical-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground animate-heartbeat" />
            </div>
            {/* Hospital name next to logo */}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-l from-primary to-medical-dark bg-clip-text text-transparent leading-tight">
                نەخۆشخانەی پیرەمام
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                Pirmam Hospital
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
