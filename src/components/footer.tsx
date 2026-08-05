/* =============================================
   Pirmam Hospital - Footer
   Contact info, social media, location, developer credit
   ============================================= */

"use client";

import {
  Phone,
  MapPin,
  Mail,
  Clock,
} from "lucide-react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";

/* =============================================
   FOOTER CONTACT INFORMATION CONFIGURATION
   EDIT: Update all the information below with
   the hospital's actual details
   ============================================= */

/* Hospital name */
const hospitalNameKu = "نەخۆشخانەی پیرمام";
const hospitalNameEn = "Pirmam Hospital";

/* Phone numbers - EDIT with real numbers */
const phoneNumbers = [
  "+٩٦٤ ٧٥٠ ١٢٣ ٤٥٦٧",   // EDIT: Replace with hospital phone 1
  "+٩٦٤ ٧٧٠ ٩٨٧ ٦٥٤٣",   // EDIT: Replace with hospital phone 2
];

/* Email address - EDIT with real email */
const emailAddress = "info@pirmam-hospital.com";

/* Address - EDIT with real address */
const addressKu = "شارەزانی پیرمام، هەولێر، هەرێمی کوردستان، عێراق";

/* Working hours - EDIT with real hours */
const workingHours = "٢٤ کاتژمێر - ٧ ڕۆژ لە هەفتە";

/* =============================================
   SOCIAL MEDIA LINKS CONFIGURATION
   EDIT: Replace the "#" with actual social media URLs
   Each item has:
   - icon: Lucide icon component
   - href: URL to the social media page
   - label: Accessible label for screen readers
   ============================================= */
const socialLinks = [
  {
    icon: Facebook,
    href: "#",  // EDIT: Replace with real Facebook URL
    label: "فەیسبووک",
  },
  {
    icon: Instagram,
    href: "#",  // EDIT: Replace with real Instagram URL
    label: "ئینستاگرام",
  },
  {
    icon: Twitter,
    href: "#",  // EDIT: Replace with real Twitter/X URL
    label: "تویتەر",
  },
  {
    icon: Youtube,
    href: "#",  // EDIT: Replace with real YouTube URL
    label: "یوتیووب",
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-muted/30">
      {/* === DECORATIVE TOP LINE === */}
      <div className="h-px bg-gradient-to-l from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* === COLUMN 1: Hospital Identity === */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* EDIT: Change the logo image by replacing public/logo.png */}
              <Image
                src="/logo.png"
                alt="نەخۆشخانەی پیرمام Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-contain"
              />
              <div>
                <div className="font-bold text-foreground">{hospitalNameKu}</div>
                <div className="text-xs text-muted-foreground">{hospitalNameEn}</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
              نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش دەکات.
            </p>
          </div>

          {/* === COLUMN 2: Contact Information === */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm">پەیوەندیمان پێوەبکە</h3>
            <div className="space-y-3">
              {/* Phone numbers */}
              {phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span dir="ltr">{phone}</span>
                </a>
              ))}
              {/* Email */}
              <a
                href={`mailto:${emailAddress}`}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span dir="ltr">{emailAddress}</span>
              </a>
            </div>
          </div>

          {/* === COLUMN 3: Location & Hours === */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm">شوێن و کات</h3>
            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{addressKu}</span>
              </div>
              {/* Working hours */}
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{workingHours}</span>
              </div>
            </div>
          </div>

          {/* === COLUMN 4: Social Media === */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm">تۆڕە کۆمەڵایەتیەکان</h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary hover:text-primary-foreground transition-all duration-200 group"
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM BAR ===
           Copyright notice, developer credit, and branding protection */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            {/* Copyright & branding protection */}
            <div className="text-center sm:text-right">
              © {new Date().getFullYear()} {hospitalNameKu}. هەموو مافەکان پارێزراون. ئەم ماڵپەڕە تایبەتە بە نەخۆشخانەی پیرمام.
            </div>

            {/* Developer credit - small font as requested */}
            <div className="text-[10px] sm:text-[11px] opacity-60">
              Developed by Jihad Salah Azeez
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
