import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import monogramColor from '../assets/sbms-monogram-color.png';

const BrandHeroVisual = () => {
  const shouldReduceMotion = useReducedMotion();

  // Floating animation for a gentle, premium breathing effect
  const floatingAnimation = shouldReduceMotion
    ? {}
    : {
        y: [-8, 8, -8],
        transition: {
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  // Ambient aura pulse
  const auraPulse = shouldReduceMotion
    ? {}
    : {
        opacity: [0.35, 0.65, 0.35],
        scale: [0.97, 1.05, 0.97],
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  // Subtle continuous shimmer / light sweep
  const shimmerSweep = shouldReduceMotion
    ? {}
    : {
        x: ['-120%', '150%'],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          repeatDelay: 2.5,
          ease: 'easeInOut',
        },
      };

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] mx-auto flex flex-col items-center justify-center py-4 select-none">
      
      {/* 1. Ambient Background Glows */}
      <motion.div
        animate={auraPulse}
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-600/15 to-cyan-300/20 blur-3xl pointer-events-none"
      />
      <div className="absolute w-64 h-64 rounded-full bg-sky-200/35 blur-2xl pointer-events-none" />

      {/* 2. Main Logo Emblem Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        <motion.div
          animate={floatingAnimation}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="group relative cursor-pointer flex flex-col items-center"
        >
          {/* Subtle Glass Backdrop Pedestal */}
          <div className="relative bg-white/70 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 border border-slate-200/70 shadow-[0_20px_50px_rgba(2,132,199,0.1)] group-hover:shadow-[0_25px_60px_rgba(2,132,199,0.18)] transition-all duration-500 overflow-hidden flex flex-col items-center">
            
            {/* Shimmer light sweep highlight */}
            {!shouldReduceMotion && (
              <motion.div
                animate={shimmerSweep}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none"
              />
            )}

            {/* Top subtle radial reflection */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

            {/* The Interlocked Geometric Monogram (SBMS) */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center p-2">
              <img
                src={monogramColor}
                alt="Sri Balaji Medi Systems Monogram"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(2,132,199,0.18)] group-hover:drop-shadow-[0_16px_28px_rgba(2,132,199,0.28)] transition-all duration-300"
                loading="eager"
              />
            </div>

            {/* Brand Identity Typography */}
            <div className="text-center mt-6 pt-4 border-t border-slate-100 w-full flex flex-col items-center">
              <h2 className="text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight leading-none group-hover:text-sky-600 transition-colors duration-300">
                SRI BALAJI
              </h2>
              <p className="text-sky-600 text-xs sm:text-sm font-black tracking-[0.3em] uppercase mt-1.5">
                MEDI SYSTEMS
              </p>
              
              {/* Refined Geometric Indicator */}
              <div className="flex items-center gap-2.5 w-32 my-3">
                <span className="h-px bg-slate-200 flex-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="h-px bg-slate-200 flex-1" />
              </div>

              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                Healthcare & Diagnostic Technologies
              </p>
            </div>

          </div>

          {/* Soft Ground Reflection Shadow */}
          <div className="w-48 sm:w-64 h-4 bg-sky-900/10 rounded-full blur-md mt-4 transition-all duration-500 group-hover:scale-90 group-hover:opacity-70" />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default BrandHeroVisual;
