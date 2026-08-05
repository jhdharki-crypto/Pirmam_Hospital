/* =============================================
   Pirmam Hospital - Medical Equipment Background Animation
   Floating SVG medical shapes that drift across the page.

   EDIT: You can adjust opacity, speed, and positions below.
   Each SVG block controls one floating shape.
   ============================================= */

"use client";

/*
   Each medical shape is defined here as an SVG path.
   They are rendered at very low opacity so they don't
   interfere with reading the website content.

   In light mode: opacity ~0.04-0.06
   In dark mode: opacity ~0.06-0.10 (slightly more visible)
*/

export function MedicalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">

      {/* ECG Heartbeat Line - top area */}
      <svg
        className="absolute top-[8%] right-[5%] w-64 h-16 opacity-[0.05] dark:opacity-[0.08]"
        viewBox="0 0 240 60"
        fill="none"
        style={{ animation: "med-hover 12s ease-in-out infinite" }}
      >
        <path
          d="M0 30 L60 30 L75 30 L85 10 L95 50 L105 5 L115 55 L125 30 L140 30 L160 30 L175 20 L185 40 L195 25 L205 35 L240 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          style={{
            strokeDasharray: "600",
            animation: "ecg-pulse 4s linear infinite",
          }}
        />
      </svg>

      {/* ECG Line 2 - middle left area */}
      <svg
        className="absolute top-[55%] left-[3%] w-48 h-12 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 240 60"
        fill="none"
        style={{ animation: "med-hover 15s ease-in-out infinite 3s" }}
      >
        <path
          d="M0 30 L50 30 L70 30 L80 12 L90 48 L100 8 L110 52 L120 30 L150 30 L180 30 L200 22 L215 38 L230 28 L240 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          style={{
            strokeDasharray: "600",
            animation: "ecg-pulse 5s linear infinite 1s",
          }}
        />
      </svg>

      {/* Medical Cross - top left floating */}
      <svg
        className="absolute top-[15%] left-[8%] w-10 h-10 opacity-[0.05] dark:opacity-[0.08]"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: "med-float-slow 18s ease-in-out infinite" }}
      >
        <path d="M16 6 H24 V16 H34 V24 H24 V34 H16 V24 H6 V16 H16 Z" className="fill-primary" />
      </svg>

      {/* Medical Cross 2 - bottom right floating */}
      <svg
        className="absolute bottom-[20%] right-[10%] w-8 h-8 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: "med-float-slow 22s ease-in-out infinite 5s" }}
      >
        <path d="M16 6 H24 V16 H34 V24 H24 V34 H16 V24 H6 V16 H16 Z" className="fill-primary" />
      </svg>

      {/* Pill Capsule drifting up from bottom-left */}
      <svg
        className="absolute bottom-0 left-[20%] w-12 h-6 opacity-[0.05] dark:opacity-[0.07]"
        viewBox="0 0 48 24"
        fill="none"
        style={{ animation: "med-drift-up 35s linear infinite 2s" }}
      >
        <rect x="2" y="2" width="20" height="20" rx="10" className="fill-primary" opacity="0.6" />
        <rect x="22" y="2" width="12" height="20" rx="0" className="fill-primary" opacity="0.4" />
        <rect x="34" y="2" width="12" height="20" rx="10" className="fill-primary" opacity="0.4" />
      </svg>

      {/* Pill 2 drifting down from top-right */}
      <svg
        className="absolute top-0 right-[25%] w-10 h-5 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 48 24"
        fill="none"
        style={{ animation: "med-drift-down 40s linear infinite 8s" }}
      >
        <rect x="2" y="2" width="20" height="20" rx="10" className="fill-primary" opacity="0.5" />
        <rect x="22" y="2" width="12" height="20" rx="0" className="fill-primary" opacity="0.35" />
        <rect x="34" y="2" width="12" height="20" rx="10" className="fill-primary" opacity="0.35" />
      </svg>

      {/* Syringe - right side gentle hover */}
      <svg
        className="absolute top-[35%] right-[4%] w-8 h-20 opacity-[0.05] dark:opacity-[0.07]"
        viewBox="0 0 32 80"
        fill="none"
        style={{ animation: "med-hover 16s ease-in-out infinite 2s" }}
      >
        <rect x="10" y="15" width="12" height="40" rx="2" className="stroke-primary" strokeWidth="1.5" fill="none" />
        <line x1="16" y1="0" x2="16" y2="18" className="stroke-primary" strokeWidth="1.5" />
        <rect x="12" y="0" width="8" height="5" rx="1" className="fill-primary" />
        <line x1="16" y1="55" x2="16" y2="75" className="stroke-primary" strokeWidth="1.5" />
        <line x1="10" y1="35" x2="22" y2="35" className="stroke-primary" strokeWidth="1" opacity="0.5" />
        <line x1="10" y1="25" x2="14" y2="25" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="30" x2="14" y2="30" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="40" x2="14" y2="40" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="45" x2="14" y2="45" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
      </svg>

      {/* Stethoscope - left side gentle float */}
      <svg
        className="absolute top-[25%] left-[3%] w-12 h-16 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 48 64"
        fill="none"
        style={{ animation: "med-float-slow 20s ease-in-out infinite 4s" }}
      >
        <circle cx="14" cy="4" r="3" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <circle cx="34" cy="4" r="3" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <path d="M14 7 L14 16 Q14 22 20 24 L24 25" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <path d="M34 7 L34 16 Q34 22 28 24 L24 25" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <line x1="24" y1="25" x2="24" y2="50" className="stroke-primary" strokeWidth="1.2" />
        <circle cx="24" cy="54" r="7" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <circle cx="24" cy="54" r="3" className="stroke-primary" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>

      {/* DNA Double Helix - center right slowly rotating */}
      <svg
        className="absolute top-[60%] right-[15%] w-8 h-24 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 32 96"
        fill="none"
        style={{ animation: "med-hover 25s ease-in-out infinite 1s" }}
      >
        <path d="M8 0 Q24 12 8 24 Q-8 36 8 48 Q24 60 8 72 Q-8 84 8 96" className="stroke-primary" strokeWidth="1.2" />
        <path d="M24 0 Q8 12 24 24 Q40 36 24 48 Q8 60 24 72 Q40 84 24 96" className="stroke-primary" strokeWidth="1.2" />
        <line x1="10" y1="6" x2="22" y2="6" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="18" x2="18" y2="18" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="30" x2="22" y2="30" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="42" x2="18" y2="42" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="54" x2="22" y2="54" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="66" x2="18" y2="66" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="78" x2="22" y2="78" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
        <line x1="14" y1="90" x2="18" y2="90" className="stroke-primary" strokeWidth="0.8" opacity="0.4" />
      </svg>

      {/* Heart with ECG line inside - bottom center pulsing */}
      <svg
        className="absolute bottom-[10%] left-[40%] w-14 h-14 opacity-[0.04] dark:opacity-[0.07]"
        viewBox="0 0 56 56"
        fill="none"
        style={{ animation: "med-pulse-soft 4s ease-in-out infinite" }}
      >
        <path d="M28 48 L6 28 C0 22 0 12 8 8 C14 5 22 5 28 12 C34 5 42 5 48 8 C56 12 56 22 50 28 Z" className="fill-primary" />
        <path d="M12 28 L20 28 L24 20 L28 36 L32 16 L36 32 L40 28 L44 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      </svg>

      {/* Blood Drop - drifting down from top center-right */}
      <svg
        className="absolute top-[5%] right-[40%] w-6 h-8 opacity-[0.05] dark:opacity-[0.07]"
        viewBox="0 0 24 32"
        fill="none"
        style={{ animation: "med-drift-down 30s linear infinite 5s" }}
      >
        <path d="M12 0 C12 0 0 16 0 22 C0 28 5.4 32 12 32 C18.6 32 24 28 24 22 C24 16 12 0 12 0 Z" className="fill-primary" />
      </svg>

      {/* Thermometer - left side lower floating */}
      <svg
        className="absolute bottom-[30%] left-[12%] w-5 h-16 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 20 64"
        fill="none"
        style={{ animation: "med-hover 18s ease-in-out infinite 7s" }}
      >
        <rect x="7" y="2" width="6" height="44" rx="3" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <circle cx="10" cy="54" r="8" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <rect x="9" y="18" width="2" height="28" className="fill-primary" opacity="0.5" />
        <circle cx="10" cy="54" r="5" className="fill-primary" opacity="0.5" />
        <line x1="13" y1="10" x2="16" y2="10" className="stroke-primary" strokeWidth="0.7" opacity="0.4" />
        <line x1="13" y1="18" x2="16" y2="18" className="stroke-primary" strokeWidth="0.7" opacity="0.4" />
        <line x1="13" y1="26" x2="16" y2="26" className="stroke-primary" strokeWidth="0.7" opacity="0.4" />
        <line x1="13" y1="34" x2="16" y2="34" className="stroke-primary" strokeWidth="0.7" opacity="0.4" />
      </svg>

      {/* Microscope - right-center gentle float */}
      <svg
        className="absolute top-[42%] left-[70%] w-10 h-14 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 40 56"
        fill="none"
        style={{ animation: "med-float-slow 22s ease-in-out infinite 3s" }}
      >
        <rect x="16" y="0" width="8" height="8" rx="2" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <rect x="18" y="8" width="4" height="16" className="stroke-primary" strokeWidth="1" fill="none" />
        <path d="M18 16 L8 16 L8 40" className="stroke-primary" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="4" y="36" width="20" height="3" rx="1" className="stroke-primary" strokeWidth="1" fill="none" />
        <rect x="17" y="24" width="6" height="6" rx="1" className="stroke-primary" strokeWidth="1" fill="none" />
        <rect x="2" y="48" width="24" height="4" rx="2" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <line x1="14" y1="40" x2="14" y2="48" className="stroke-primary" strokeWidth="1.2" />
      </svg>

      {/* Medical Shield with cross inside - center left */}
      <svg
        className="absolute top-[45%] left-[45%] w-10 h-12 opacity-[0.03] dark:opacity-[0.05]"
        viewBox="0 0 40 48"
        fill="none"
        style={{ animation: "med-hover 20s ease-in-out infinite 6s" }}
      >
        <path d="M20 2 L36 10 L36 24 C36 36 20 46 20 46 C20 46 4 36 4 24 L4 10 Z" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <line x1="20" y1="12" x2="20" y2="36" className="stroke-primary" strokeWidth="1.5" />
        <line x1="10" y1="24" x2="30" y2="24" className="stroke-primary" strokeWidth="1.5" />
      </svg>

      {/* Band-Aid - bottom left corner floating */}
      <svg
        className="absolute bottom-[15%] left-[30%] w-14 h-6 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 56 24"
        fill="none"
        style={{ animation: "med-float-slow 19s ease-in-out infinite 2s" }}
      >
        <rect x="2" y="4" width="52" height="16" rx="8" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <rect x="6" y="6" width="14" height="12" rx="4" className="fill-primary" opacity="0.3" />
        <rect x="36" y="6" width="14" height="12" rx="4" className="fill-primary" opacity="0.3" />
        <circle cx="24" cy="10" r="1.2" className="fill-primary" opacity="0.4" />
        <circle cx="28" cy="14" r="1.2" className="fill-primary" opacity="0.4" />
        <circle cx="24" cy="18" r="1.2" className="fill-primary" opacity="0.4" />
        <circle cx="32" cy="10" r="1.2" className="fill-primary" opacity="0.4" />
        <circle cx="28" cy="6" r="1.2" className="fill-primary" opacity="0.4" />
      </svg>

      {/* Pulse Oximeter Wave - bottom right */}
      <svg
        className="absolute bottom-[5%] right-[5%] w-56 h-10 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 220 40"
        fill="none"
        style={{ animation: "med-hover 14s ease-in-out infinite 1s" }}
      >
        <path
          d="M0 30 Q20 30 40 30 Q50 30 55 28 Q60 20 65 28 Q70 30 80 30 Q90 30 100 30 Q110 30 115 25 Q120 10 125 30 Q130 32 140 30 Q160 30 180 30 Q190 30 195 27 Q200 18 205 30 Q210 32 220 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-primary"
          style={{
            strokeDasharray: "400",
            animation: "ecg-pulse 6s linear infinite 2s",
          }}
        />
      </svg>

      {/* Small Heart drifting up from bottom right */}
      <svg
        className="absolute bottom-0 right-[35%] w-6 h-6 opacity-[0.04] dark:opacity-[0.06]"
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: "med-drift-up 45s linear infinite 12s" }}
      >
        <path d="M12 21 L3 13 C0 10 0 5 3 3 C5 1.5 9 1.5 12 5 C15 1.5 19 1.5 21 3 C24 5 24 10 21 13 Z" className="fill-primary" />
      </svg>

      {/* Small Medical Cross drifting down from top */}
      <svg
        className="absolute top-0 left-[55%] w-6 h-6 opacity-[0.03] dark:opacity-[0.05]"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: "med-drift-down 50s linear infinite 15s" }}
      >
        <path d="M16 6 H24 V16 H34 V24 H24 V34 H16 V24 H6 V16 H16 Z" className="fill-primary" />
      </svg>

      {/* Blood Pressure Cuff - center left floating */}
      <svg
        className="absolute top-[70%] left-[5%] w-10 h-10 opacity-[0.03] dark:opacity-[0.05]"
        viewBox="0 0 40 40"
        fill="none"
        style={{ animation: "med-hover 24s ease-in-out infinite 4s" }}
      >
        <path d="M8 8 Q8 2 20 2 Q32 2 32 8 L32 28 Q32 36 20 36 Q8 36 8 28 Z" className="stroke-primary" strokeWidth="1.2" fill="none" />
        <circle cx="20" cy="14" r="6" className="stroke-primary" strokeWidth="1" fill="none" opacity="0.5" />
        <line x1="20" y1="14" x2="23" y2="10" className="stroke-primary" strokeWidth="0.8" opacity="0.5" />
        <path d="M20 36 L20 40" className="stroke-primary" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}
