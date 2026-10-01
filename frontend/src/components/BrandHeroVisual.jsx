import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

const BrandHeroVisual = () => {
  const shouldReduceMotion = useReducedMotion();

  // Floating animation variant that respects accessibility preferences
  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: [-6, 6, -6],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  const orbitAnimation = shouldReduceMotion
    ? {}
    : {
        rotate: 360,
        transition: {
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        },
      };

  const reverseOrbitAnimation = shouldReduceMotion
    ? {}
    : {
        rotate: -360,
        transition: {
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        },
      };

  const glowPulse = shouldReduceMotion
    ? {}
    : {
        opacity: [0.35, 0.6, 0.35],
        scale: [0.98, 1.04, 0.98],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  return (
    <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[520px] mx-auto flex items-center justify-center py-6 select-none">
      
      {/* 1. Ambient Background Glows */}
      <motion.div
        animate={glowPulse}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-400/25 via-blue-500/20 to-teal-300/20 blur-3xl pointer-events-none"
      />
      <div className="absolute w-60 h-60 rounded-full bg-sky-200/40 blur-2xl pointer-events-none" />

      {/* 2. Concentric Orbit Rings (Technology & Precision Motif) */}
      <motion.div
        animate={orbitAnimation}
        className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-sky-300/50 pointer-events-none"
      >
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-sky-500/70 shadow-sm shadow-sky-400" />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal-400/70" />
      </motion.div>

      <motion.div
        animate={reverseOrbitAnimation}
        className="absolute w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] rounded-full border border-sky-200/60 pointer-events-none"
      >
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500/60 shadow-sm" />
      </motion.div>

      {/* 3. Main Brand Emblem Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className="relative z-10 w-full"
      >
        <motion.div
          animate={floatAnimation}
          className="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 sm:p-10 shadow-[0_20px_50px_rgba(2,132,199,0.12)] flex flex-col items-center text-center overflow-hidden transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(2,132,199,0.18)]"
        >
          {/* Subtle top light flare */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-52 h-52 bg-gradient-to-b from-sky-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Central Logo Crest */}
          <div className="relative mb-5 group">
            {/* Outer gradient glow ring */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-400 p-1 shadow-xl shadow-sky-600/25 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-[1.35rem] bg-gradient-to-br from-slate-900 via-sky-950 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden p-3">
                
                {/* Background tech grid lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:10px_10px] opacity-20" />

                {/* "SB" Brand Monogram */}
                <span className="text-white font-black text-3xl sm:text-4xl tracking-tighter drop-shadow-md select-none">
                  SB
                </span>

                {/* ECG / Cardiogram pulse wave SVG */}
                <svg
                  className="w-16 h-4 sm:w-20 sm:h-5 text-cyan-400 mt-1"
                  viewBox="0 0 100 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 0 10 L 25 10 L 32 3 L 42 17 L 50 2 L 58 14 L 66 10 L 100 10" />
                </svg>
              </div>
            </div>

            {/* Micro accent badge */}
            <div className="absolute -bottom-2 -right-2 bg-white text-sky-600 rounded-full p-1.5 shadow-md border border-sky-100">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Brand Name Typography */}
          <h2 className="text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
            SRI BALAJI
          </h2>
          <p className="text-sky-600 text-xs sm:text-sm font-black tracking-[0.25em] uppercase mt-1.5">
            MEDI SYSTEMS
          </p>

          {/* Clean Medical Divider */}
          <div className="flex items-center gap-2.5 w-36 my-3.5">
            <span className="h-px bg-slate-200 flex-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Core Subtitle */}
          <p className="text-slate-500 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
            Healthcare & Diagnostic Technologies
          </p>

          {/* 4. Satellite Floating Badges */}
          {/* Badge 1: Diagnostic Systems (Top-Right) */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [-4, 4, -4],
                    transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            className="hidden sm:flex absolute -top-3 -right-3 items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-100 shadow-md text-xs font-bold text-slate-800"
          >
            <span className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </span>
            <span>Diagnostic Systems</span>
          </motion.div>

          {/* Badge 2: Biomedical Engineering (Bottom-Left) */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [4, -4, 4],
                    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                  }
            }
            className="hidden sm:flex absolute -bottom-3 -left-3 items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-100 shadow-md text-xs font-bold text-slate-800"
          >
            <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span>Biomedical Care</span>
          </motion.div>

          {/* Badge 3: Genuine Spares (Bottom-Right) */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [-3, 3, -3],
                    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                  }
            }
            className="hidden sm:flex absolute -bottom-3 -right-3 items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-100 shadow-md text-xs font-bold text-slate-800"
          >
            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </span>
            <span>Certified Tech</span>
          </motion.div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default BrandHeroVisual;
