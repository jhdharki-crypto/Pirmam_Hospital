/* =============================================
   Pirmam Hospital - Premium Animated Background
   Multi-layered: gradient orbs, dot grid, light rays, pulse elements
   Designed to impress — inspired by Stripe/Linear/Vercel aesthetics
   ============================================= */

"use client";

export function MedicalBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* ====== LAYER 1: Animated Gradient Orbs ====== */}
      {/* Large soft blurred color circles that slowly drift around */}

      {/* Primary teal orb - top right */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12] dark:opacity-[0.15]"
        style={{
          top: "-10%",
          right: "-8%",
          background: "radial-gradient(circle, oklch(0.65 0.14 172 / 0.6) 0%, oklch(0.65 0.14 172 / 0) 70%)",
          filter: "blur(80px)",
          willChange: "transform",
          animation: "orb-drift-1 25s ease-in-out infinite",
        }}
      />

      {/* Secondary emerald orb - bottom left */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.10] dark:opacity-[0.13]"
        style={{
          bottom: "-5%",
          left: "-5%",
          background: "radial-gradient(circle, oklch(0.60 0.12 160 / 0.5) 0%, oklch(0.60 0.12 160 / 0) 70%)",
          filter: "blur(70px)",
          willChange: "transform",
          animation: "orb-drift-2 30s ease-in-out infinite",
        }}
      />

      {/* Tertiary glow orb - center */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06] dark:opacity-[0.10]"
        style={{
          top: "35%",
          left: "40%",
          background: "radial-gradient(circle, oklch(0.70 0.15 172 / 0.4) 0%, oklch(0.70 0.15 172 / 0) 70%)",
          filter: "blur(90px)",
          willChange: "transform",
          animation: "orb-drift-3 35s ease-in-out infinite",
        }}
      />

      {/* Small accent orb - top left */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-[0.08] dark:opacity-[0.10]"
        style={{
          top: "5%",
          left: "15%",
          background: "radial-gradient(circle, oklch(0.55 0.16 180 / 0.4) 0%, oklch(0.55 0.16 180 / 0) 70%)",
          filter: "blur(60px)",
          willChange: "transform",
          animation: "orb-drift-4 28s ease-in-out infinite 5s",
        }}
      />

      {/* Small warm accent orb - bottom right */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-[0.05] dark:opacity-[0.07]"
        style={{
          bottom: "15%",
          right: "10%",
          background: "radial-gradient(circle, oklch(0.72 0.12 165 / 0.3) 0%, oklch(0.72 0.12 165 / 0) 70%)",
          filter: "blur(80px)",
          willChange: "transform",
          animation: "orb-drift-5 32s ease-in-out infinite 8s",
        }}
      />

      {/* ====== LAYER 2: Subtle Dot Grid Pattern ====== */}
      <div
        className="absolute inset-0 opacity-[0.3] dark:opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.50 0.08 172 / 0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* ====== LAYER 3: Animated Light Rays ====== */}
      {/* Sweeping diagonal light beams */}

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "0.04", willChange: "transform", animation: "light-sweep 20s ease-in-out infinite" }}
      >
        <div
          className="absolute w-[200%] h-[2px] origin-left"
          style={{
            top: "25%",
            left: "-20%",
            background: "linear-gradient(90deg, transparent 0%, oklch(0.65 0.14 172 / 0.8) 30%, transparent 60%)",
            transform: "rotate(-15deg)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "0.03", willChange: "transform", animation: "light-sweep 25s ease-in-out infinite 7s" }}
      >
        <div
          className="absolute w-[200%] h-[2px] origin-left"
          style={{
            top: "60%",
            left: "-20%",
            background: "linear-gradient(90deg, transparent 0%, oklch(0.60 0.12 160 / 0.8) 30%, transparent 60%)",
            transform: "rotate(-10deg)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "0.035", willChange: "transform", animation: "light-sweep-reverse 22s ease-in-out infinite 3s" }}
      >
        <div
          className="absolute w-[200%] h-[2px] origin-left"
          style={{
            top: "45%",
            left: "-20%",
            background: "linear-gradient(90deg, transparent 0%, oklch(0.68 0.15 172 / 0.7) 25%, transparent 55%)",
            transform: "rotate(-20deg)",
          }}
        />
      </div>

      {/* ====== LAYER 4: Pulsing Medical Signature ====== */}
      {/* A subtle pulsing DNA/double helix pattern - very faint */}

      <svg
        className="absolute top-[10%] right-[6%] w-40 opacity-[0.06] dark:opacity-[0.09]"
        viewBox="0 0 100 200"
        fill="none"
        style={{ willChange: "transform, opacity", animation: "dna-rotate 20s linear infinite" }}
      >
        <path d="M30 0 Q70 25 30 50 Q-10 75 30 100 Q70 125 30 150 Q-10 175 30 200" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <path d="M70 0 Q30 25 70 50 Q110 75 70 100 Q30 125 70 150 Q110 175 70 200" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        {/* Connecting rungs */}
        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((y, i) => {
          const x1 = i % 2 === 0 ? 35 : 65;
          const x2 = i % 2 === 0 ? 65 : 35;
          return (
            <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.4" />
          );
        })}
      </svg>

      {/* Pulsing medical cross - subtle signature */}
      <svg
        className="absolute bottom-[20%] right-[15%] w-16 h-16 opacity-[0.06] dark:opacity-[0.09]"
        viewBox="0 0 64 64"
        fill="none"
        style={{ willChange: "transform, opacity", animation: "cross-pulse 6s ease-in-out infinite" }}
      >
        <path d="M24 8 H40 V24 H56 V40 H40 V56 H24 V40 H8 V24 H24 Z" className="fill-primary" />
      </svg>

      {/* ECG heartbeat line - animated across */}
      <svg
        className="absolute bottom-[8%] left-[5%] w-[300px] sm:w-[500px] opacity-[0.08] dark:opacity-[0.12]"
        viewBox="0 0 500 60"
        fill="none"
        style={{ willChange: "opacity" }}
      >
        <path
          d="M0 30 L80 30 L100 30 L115 10 L125 50 L135 5 L145 55 L155 30 L180 30 L200 30 L220 25 L230 35 L250 20 L260 40 L280 28 L300 30 L500 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          style={{
            strokeDasharray: "800",
            animation: "ecg-draw 6s linear infinite",
          }}
        />
      </svg>

      {/* Second ECG line - top */}
      <svg
        className="absolute top-[6%] left-[30%] w-[200px] sm:w-[350px] opacity-[0.05] dark:opacity-[0.08]"
        viewBox="0 0 500 60"
        fill="none"
      >
        <path
          d="M0 30 L120 30 L140 30 L155 12 L165 48 L175 8 L185 52 L195 30 L220 30 L250 30 L270 22 L285 38 L300 25 L320 35 L350 30 L500 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          style={{
            strokeDasharray: "700",
            animation: "ecg-draw 8s linear infinite 2s",
          }}
        />
      </svg>

      {/* ====== LAYER 5: Floating Micro Particles ====== */}
      {/* Tiny glowing dots that drift slowly */}

      {/* Particle group 1 - top area */}
      <div className="absolute top-[15%] left-[25%] w-1 h-1 rounded-full bg-primary/20 dark:bg-primary/30" style={{ animation: "particle-float 15s ease-in-out infinite" }} />
      <div className="absolute top-[20%] left-[60%] w-1.5 h-1.5 rounded-full bg-primary/15 dark:bg-primary/25" style={{ animation: "particle-float 18s ease-in-out infinite 3s" }} />
      <div className="absolute top-[30%] left-[45%] w-1 h-1 rounded-full bg-primary/20 dark:bg-primary/30" style={{ animation: "particle-float 20s ease-in-out infinite 7s" }} />
      <div className="absolute top-[12%] left-[80%] w-1 h-1 rounded-full bg-primary/15 dark:bg-primary/20" style={{ animation: "particle-float 16s ease-in-out infinite 10s" }} />

      {/* Particle group 2 - middle area */}
      <div className="absolute top-[50%] left-[10%] w-1.5 h-1.5 rounded-full bg-primary/15 dark:bg-primary/25" style={{ animation: "particle-float 17s ease-in-out infinite 2s" }} />
      <div className="absolute top-[55%] left-[75%] w-1 h-1 rounded-full bg-primary/20 dark:bg-primary/30" style={{ animation: "particle-float 22s ease-in-out infinite 5s" }} />
      <div className="absolute top-[65%] left-[35%] w-1 h-1 rounded-full bg-primary/10 dark:bg-primary/20" style={{ animation: "particle-float 19s ease-in-out infinite 9s" }} />
      <div className="absolute top-[45%] left-[90%] w-1.5 h-1.5 rounded-full bg-primary/15 dark:bg-primary/20" style={{ animation: "particle-float 21s ease-in-out infinite 12s" }} />

      {/* Particle group 3 - bottom area */}
      <div className="absolute top-[75%] left-[20%] w-1 h-1 rounded-full bg-primary/15 dark:bg-primary/25" style={{ animation: "particle-float 16s ease-in-out infinite 4s" }} />
      <div className="absolute top-[85%] left-[55%] w-1.5 h-1.5 rounded-full bg-primary/10 dark:bg-primary/20" style={{ animation: "particle-float 23s ease-in-out infinite 8s" }} />
      <div className="absolute top-[80%] left-[85%] w-1 h-1 rounded-full bg-primary/15 dark:bg-primary/25" style={{ animation: "particle-float 18s ease-in-out infinite 1s" }} />
      <div className="absolute top-[90%] left-[40%] w-1 h-1 rounded-full bg-primary/10 dark:bg-primary/15" style={{ animation: "particle-float 20s ease-in-out infinite 11s" }} />

      {/* ====== LAYER 6: Vignette Edge Gradient ====== */}
      {/* Subtle darkening at edges for depth */}
      <div
        className="absolute inset-0 dark:opacity-100 opacity-0"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, oklch(0 0 0 / 0.06) 100%)",
        }}
      />
    </div>
  );
}
