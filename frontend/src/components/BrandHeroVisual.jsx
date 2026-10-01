import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import monogramColor from '../assets/sbms-monogram-color.png';
import { ShieldCheck, Cpu } from 'lucide-react';

const BrandHeroVisual = ({ mouseX, mouseY }) => {
  const shouldReduceMotion = useReducedMotion();

  // Floating pedestal levitation for smooth clinical presence
  const floatingAnimation = shouldReduceMotion
    ? {}
    : {
        y: [-4, 4, -4],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  // Ambient aura glow breathing behind pedestal
  const pedestalAuraAnim = shouldReduceMotion
    ? {}
    : {
        opacity: [0.35, 0.6, 0.35],
        scale: [0.98, 1.04, 0.98],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  // Subtle glass reflection sweep
  const shimmerSweep = shouldReduceMotion
    ? {}
    : {
        x: ['-130%', '160%'],
        transition: {
          duration: 5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        },
      };

  // Continuous signal sweep line
  const scanSweepAnim = shouldReduceMotion
    ? {}
    : {
        top: ['-10%', '110%'],
        opacity: [0, 0.8, 0],
        transition: {
          duration: 3.8,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        },
      };

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[530px] mx-auto flex flex-col items-center justify-center py-4 select-none">
      
      {/* 1. Ambient Background Halo Glows */}
      <motion.div
        animate={pedestalAuraAnim}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-400/25 via-cyan-300/25 to-teal-300/20 blur-3xl pointer-events-none"
      />
      <div className="absolute w-60 h-60 rounded-full bg-sky-200/30 blur-2xl pointer-events-none" />

      {/* 2. Main Pedestal Container with Parallax Response */}
      <motion.div
        style={{
          x: mouseX ? mouseX : 0,
          y: mouseY ? mouseY : 0,
        }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        <motion.div
          animate={floatingAnimation}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="group relative cursor-default flex flex-col items-center w-full"
        >
          {/* Outer Glass Card Pedestal */}
          <div className="relative w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-7 sm:p-9 border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(2,132,199,0.15)] group-hover:shadow-[0_25px_70px_-12px_rgba(2,132,199,0.22)] transition-all duration-500 overflow-hidden flex flex-col items-center">
            
            {/* Shimmer Light Reflection Sweep */}
            {!shouldReduceMotion && (
              <motion.div
                animate={shimmerSweep}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-22deg] pointer-events-none z-20"
              />
            )}

            {/* Subtle Scanning Laser Line */}
            {!shouldReduceMotion && (
              <motion.div
                animate={scanSweepAnim}
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
            )}

            {/* PHASE 4: Precision Technical Corner Framing Markers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute inset-3 pointer-events-none"
            >
              {/* Top-Left Bracket */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-sky-400/50 rounded-tl" />
              {/* Top-Right Bracket */}
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-sky-400/50 rounded-tr" />
              {/* Bottom-Left Bracket */}
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-sky-400/50 rounded-bl" />
              {/* Bottom-Right Bracket */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-sky-400/50 rounded-br" />
            </motion.div>

            {/* Top Calibration Header Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center justify-between w-full px-2 mb-3 z-10"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>01 // PRECISION CALIBRATED</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-sky-600 font-semibold">
                <Cpu className="w-3 h-3" />
                <span>SBMS-BIO</span>
              </div>
            </motion.div>

            {/* PHASE 2 & 3: Monogram Reveal with Surrounding Clinical Signal SVG */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64 flex items-center justify-center p-2 my-1">
              
              {/* PHASE 3: Clinical Diagnostic Waveform Signal Line (SVG Path) */}
              <svg
                viewBox="0 0 260 260"
                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              >
                <defs>
                  <linearGradient id="clinicalSignalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                  <filter id="signalGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Subtle Outer Frame Geometry */}
                <circle
                  cx="130"
                  cy="130"
                  r="122"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  className="opacity-70"
                />

                {/* Clinical Signal Waveform Ring */}
                <motion.circle
                  cx="130"
                  cy="130"
                  r="122"
                  fill="none"
                  stroke="url(#clinicalSignalGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#signalGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: shouldReduceMotion ? 0.9 : [0.75, 1, 0.75],
                  }}
                  transition={{
                    pathLength: { duration: 1.4, delay: 0.3, ease: 'easeOut' },
                    opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                />

                {/* Micro Diagnostic Pulse Mark */}
                <motion.path
                  d="M 10 130 L 70 130 L 82 108 L 94 152 L 106 122 L 118 136 L 126 130 L 250 130"
                  fill="none"
                  stroke="url(#clinicalSignalGrad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1],
                    opacity: [0, 0.6, 0.25]
                  }}
                  transition={{
                    duration: 2.2,
                    delay: 0.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: 'easeInOut'
                  }}
                  className="opacity-40"
                />
              </svg>

              {/* Radial reflection behind monogram */}
              <div className="absolute inset-6 bg-gradient-to-tr from-sky-100/60 via-white to-cyan-50/50 rounded-full blur-sm -z-0" />

              {/* PHASE 2: The Interlocked Geometric Monogram Reveal (Smooth scale, blur-to-sharp, NO distortion) */}
              <motion.img
                src={monogramColor}
                alt="Sri Balaji Medi Systems Emblem"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 1.1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(2,132,199,0.2)] group-hover:drop-shadow-[0_18px_32px_rgba(2,132,199,0.3)] transition-all duration-300"
                loading="eager"
              />
            </div>

            {/* Brand Identity Typography */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-center mt-4 pt-4 border-t border-slate-100 w-full flex flex-col items-center z-10"
            >
              <h2 className="text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight leading-none group-hover:text-sky-600 transition-colors duration-300">
                SRI BALAJI
              </h2>
              <p className="text-sky-600 text-xs sm:text-sm font-black tracking-[0.3em] uppercase mt-1.5">
                MEDI SYSTEMS
              </p>
              
              {/* Technical Indicator Divider */}
              <div className="flex items-center gap-2.5 w-36 my-2.5">
                <span className="h-px bg-slate-200 flex-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                <span className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Sub-label */}
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>PRECISION MEDICAL SYSTEMS</span>
              </div>
            </motion.div>

          </div>

          {/* Soft Ground Pedestal Shadow */}
          <div className="w-48 sm:w-64 h-3 bg-sky-950/10 rounded-full blur-md mt-3 transition-all duration-500 group-hover:scale-95 group-hover:opacity-60" />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default BrandHeroVisual;
