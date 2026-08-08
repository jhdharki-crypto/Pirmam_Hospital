/* =============================================
   Pirmam Hospital - Footer
   Contact info, social media, location, developer credit
   Content loaded from database via content store
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
} from "lucide-react";
import Image from "next/image";
import { useContent } from "@/lib/content-store";

export function Footer() {
  const { getSetting } = useContent();

  const hospitalNameKu = getSetting("hospitalNameKu");
  const hospitalNameEn = getSetting("hospitalNameEn");
  const phone1 = getSetting("phone1");
  const phone2 = getSetting("phone2");
  const emailAddress = getSetting("email");
  const addressKu = getSetting("addressKu");
  const workingHours = getSetting("workingHours");
  const facebookUrl = getSetting("facebookUrl");
  const footerDescription = getSetting("footerDescription");

  const phoneNumbers = [phone1, phone2].filter(Boolean);

  const socialLinks = [
    { icon: Facebook, href: facebookUrl || "#", label: "فەیسبووک" },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-muted/30">
      <div className="h-px bg-gradient-to-l from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Column 1: Hospital Identity */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
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
              {footerDescription}
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm">پەیوەندیمان پێوەبکە</h3>
            <div className="space-y-3">
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
              {emailAddress && (
                <a
                  href={`mailto:${emailAddress}`}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span dir="ltr">{emailAddress}</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 3: Location & Hours */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm">شوێن و کات</h3>
            <div className="space-y-3">
              {addressKu && (
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{addressKu}</span>
                </div>
              )}
              {workingHours && (
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{workingHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Social Media */}
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

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="text-center sm:text-right">
              © {new Date().getFullYear()} {hospitalNameKu}. هەموو مافەکان پارێزراون. ئەم ماڵپەڕە تایبەتە بە نەخۆشخانەی پیرمام.
            </div>
            <div className="text-[10px] sm:text-[11px] opacity-60">
              Developed by Jihad Salah Azeez
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
