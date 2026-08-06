/* =============================================
   Pirmam Hospital - Premium Static Background
   Beautiful gradient mesh with medical SVG watermarks
   Zero animation — pure visual impact through composition
   ============================================= */

"use client";

import { useTheme } from "next-themes";

export function MedicalBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* ====== LAYER 1: Gradient Mesh ====== */}
      {/* Overlapping radial gradients that create a beautiful mesh effect */}
      <div className="absolute inset-0" style={{
        background: isDark
          ? `
            radial-gradient(ellipse 80% 60% at 15% 10%, oklch(0.30 0.10 172 / 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 85% 15%, oklch(0.28 0.08 165 / 0.20) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 50% 50%, oklch(0.25 0.06 172 / 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 90% 60% at 80% 80%, oklch(0.22 0.09 178 / 0.18) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 10% 85%, oklch(0.32 0.11 160 / 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 60% 30%, oklch(0.26 0.07 175 / 0.10) 0%, transparent 55%)
          `
          : `
            radial-gradient(ellipse 80% 60% at 15% 10%, oklch(0.82 0.06 172 / 0.30) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 85% 15%, oklch(0.85 0.05 165 / 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 50% 50%, oklch(0.88 0.04 172 / 0.18) 0%, transparent 70%),
            radial-gradient(ellipse 90% 60% at 80% 80%, oklch(0.80 0.07 178 / 0.22) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 10% 85%, oklch(0.78 0.06 160 / 0.20) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 60% 30%, oklch(0.90 0.03 175 / 0.15) 0%, transparent 55%)
          `
      }} />

      {/* ====== LAYER 2: Dot Grid Pattern ====== */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, oklch(0.45 0.06 172 / 0.25) 1px, transparent 1px)"
            : "radial-gradient(circle, oklch(0.55 0.06 172 / 0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* ====== LAYER 3: Medical SVG Watermarks ====== */}
      {/* Static decorative medical elements placed artistically around the edges */}

      {/* DNA Double Helix - top right corner */}
      <svg
        className="absolute top-[4%] right-[3%] w-44 opacity-[0.05] dark:opacity-[0.08]"
        viewBox="0 0 100 220"
        fill="none"
      >
        <path
          d="M25 0 Q65 28 25 55 Q-15 82 25 110 Q65 138 25 165 Q-15 192 25 220"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
        <path
          d="M75 0 Q35 28 75 55 Q115 82 75 110 Q35 138 75 165 Q115 192 75 220"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
        {[15, 38, 60, 82, 105, 128, 150, 172, 195].map((y, i) => {
          const x1 = i % 2 === 0 ? 32 : 68;
          const x2 = i % 2 === 0 ? 68 : 32;
          return (
            <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.5" />
          );
        })}
      </svg>

      {/* Medical Cross - bottom right */}
      <svg
        className="absolute bottom-[12%] right-[6%] w-20 h-20 opacity-[0.04] dark:opacity-[0.07]"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path d="M24 6 H40 V24 H58 V40 H40 V58 H24 V40 H6 V24 H24 Z" className="fill-primary" />
      </svg>

      {/* Small Medical Cross - top left */}
      <svg
        className="absolute top-[8%] left-[5%] w-12 h-12 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path d="M24 6 H40 V24 H58 V40 H40 V58 H24 V40 H6 V24 H24 Z" className="fill-primary" />
      </svg>

      {/* ECG Heartbeat Line - bottom left area */}
      <svg
        className="absolute bottom-[6%] left-[4%] w-[280px] sm:w-[420px] opacity-[0.06] dark:opacity-[0.09]"
        viewBox="0 0 500 60"
        fill="none"
      >
        <path
          d="M0 30 L90 30 L110 30 L125 8 L135 52 L145 4 L155 56 L165 30 L190 30 L210 30 L230 24 L242 36 L260 18 L275 42 L295 27 L320 30 L500 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>

      {/* Second ECG Line - top center */}
      <svg
        className="absolute top-[5%] left-[35%] w-[200px] sm:w-[320px] opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 500 60"
        fill="none"
      >
        <path
          d="M0 30 L130 30 L150 30 L165 14 L175 46 L185 9 L195 51 L205 30 L240 30 L270 30 L290 22 L305 38 L325 26 L340 36 L365 30 L500 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>

      {/* Stethoscope shape - bottom center right */}
      <svg
        className="absolute bottom-[25%] right-[12%] w-16 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 64 80"
        fill="none"
      >
        {/* Earpiece */}
        <circle cx="16" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" className="text-primary" />
        <circle cx="48" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" className="text-primary" />
        {/* Tubing */}
        <path d="M16 13 Q16 30 32 35 Q48 40 48 55" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        {/* Chest piece */}
        <circle cx="48" cy="62" r="8" stroke="currentColor" strokeWidth="1.2" className="text-primary" />
        <circle cx="48" cy="62" r="3" className="fill-primary" opacity="0.3" />
      </svg>

      {/* Heartbeat icon - middle left */}
      <svg
        className="absolute top-[40%] left-[2%] w-14 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          className="fill-primary"
          opacity="0.6"
        />
      </svg>

      {/* Pill/Capsule shape - top center left */}
      <svg
        className="absolute top-[15%] left-[18%] w-10 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 40 20"
        fill="none"
      >
        <rect x="2" y="2" width="36" height="16" rx="8" className="fill-primary" opacity="0.4" />
        <line x1="20" y1="2" x2="20" y2="18" stroke="currentColor" strokeWidth="1" className="text-background" />
      </svg>

      {/* DNA Helix - bottom left corner (mirrored) */}
      <svg
        className="absolute bottom-[3%] left-[25%] w-32 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 100 180"
        fill="none"
      >
        <path
          d="M20 0 Q55 22 20 45 Q-15 68 20 90 Q55 112 20 135 Q-15 158 20 180"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-primary"
        />
        <path
          d="M80 0 Q45 22 80 45 Q115 68 80 90 Q45 112 80 135 Q115 158 80 180"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-primary"
        />
        {[18, 40, 62, 85, 108, 130, 155].map((y, i) => {
          const x1 = i % 2 === 0 ? 28 : 72;
          const x2 = i % 2 === 0 ? 72 : 28;
          return (
            <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="0.7" className="text-primary" opacity="0.4" />
          );
        })}
      </svg>

      {/* Molecular/cell structure - right side middle */}
      <svg
        className="absolute top-[55%] right-[3%] w-24 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1" className="text-primary" />
        <circle cx="50" cy="50" r="5" className="fill-primary" opacity="0.2" />
        {/* Connecting bonds */}
        <circle cx="50" cy="18" r="6" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
        <circle cx="82" cy="68" r="6" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
        <circle cx="18" cy="68" r="6" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
        <line x1="50" y1="38" x2="50" y2="24" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
        <line x1="60" y1="56" x2="76" y2="64" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
        <line x1="40" y1="56" x2="24" y2="64" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
      </svg>

      {/* Pulse wave ring - center */}
      <svg
        className="absolute top-[30%] left-[50%] -translate-x-1/2 w-64 opacity-[0.03] dark:opacity-[0.05]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" className="text-primary" opacity="0.3" />
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" className="text-primary" opacity="0.4" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" className="text-primary" opacity="0.5" />
        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" className="text-primary" opacity="0.6" />
      </svg>

      {/* ====== LAYER 4: Decorative Geometric Lines ====== */}
      {/* Thin diagonal lines for a modern tech feel */}

      {/* Top-right diagonal accent line */}
      <div
        className="absolute top-0 right-[20%] w-px h-[35%] opacity-[0.04] dark:opacity-[0.06]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, oklch(0.55 0.08 172 / 0.8) 50%, transparent 100%)",
          transform: "rotate(15deg)",
          transformOrigin: "top right",
        }}
      />

      {/* Bottom-left diagonal accent line */}
      <div
        className="absolute bottom-0 left-[15%] w-px h-[30%] opacity-[0.04] dark:opacity-[0.06]"
        style={{
          background: "linear-gradient(0deg, transparent 0%, oklch(0.55 0.08 172 / 0.8) 50%, transparent 100%)",
          transform: "rotate(-12deg)",
          transformOrigin: "bottom left",
        }}
      />

      {/* Horizontal accent line - subtle */}
      <div
        className="absolute top-[48%] left-0 right-0 h-px opacity-[0.03] dark:opacity-[0.04]"
        style={{
          background: "linear-gradient(90deg, transparent 5%, oklch(0.55 0.08 172 / 0.5) 30%, oklch(0.55 0.08 172 / 0.5) 70%, transparent 95%)",
        }}
      />

      {/* ====== LAYER 5: Vignette Edge Gradient ====== */}
      {/* Subtle darkening at edges for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, oklch(0 0 0 / 0.15) 100%)"
            : "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, oklch(0.98 0.002 160 / 0.4) 100%)",
        }}
      />

      {/* ====== LAYER 6: Subtle Noise Texture ====== */}
      {/* SVG noise filter for a premium feel - very subtle */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.03]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
