import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import monogramLogo from '../assets/sbms-monogram-color.png';

const BrandHeroVisual = () => {
  const shouldReduceMotion = useReducedMotion();

  // Single subtle highlight sweep across emblem on reveal only
  const lightSweep = shouldReduceMotion
    ? {}
    : {
        x: ['-120%', '160%'],
        transition: {
          duration: 1.2,
          delay: 0.7,
          ease: 'easeInOut',
        },
      };

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[460px] mx-auto flex flex-col items-center justify-center py-6 select-none">
      
      {/* Subtle neutral ambient shadow */}
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-neutral-200/40 blur-3xl pointer-events-none -z-10" />

      {/* Emblem Presentation */}
      <div className="relative w-full flex flex-col items-center">
        
        {/* Monogram Reveal Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center p-4 overflow-hidden rounded-3xl bg-white/60 backdrop-blur-[2px] border border-[#E5E1DA] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          
          {/* Subtle single light sweep highlight across the emblem */}
          {!shouldReduceMotion && (
            <motion.div
              animate={lightSweep}
              className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] pointer-events-none z-20"
            />
          )}

          {/* THE INTERLOCKED SBMS MONOGRAM EMBLEM */}
          <motion.img
            src={monogramLogo}
            alt="Sri Balaji Medi Systems Monogram Emblem"
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 1.3,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            loading="eager"
          />
        </div>

        {/* Clean Neutral Company Name & Subtitle (HTML/Text) */}
        <div className="text-center mt-6 flex flex-col items-center">
          <h2 className="text-[#252525] font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
            SRI BALAJI
          </h2>
          <p className="text-[#77736E] text-xs sm:text-sm font-bold tracking-[0.24em] uppercase mt-2">
            MEDI SYSTEMS
          </p>
          
          {/* Subtle Neutral Divider */}
          <div className="flex items-center gap-2 w-20 my-2.5">
            <span className="h-px bg-[#E5E1DA] flex-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#77736E]" />
            <span className="h-px bg-[#E5E1DA] flex-1" />
          </div>

          <p className="text-[#77736E] text-[11px] sm:text-xs font-medium tracking-wide">
            Precision Medical Equipment & Biomedical Support
          </p>
        </div>

      </div>

    </div>
  );
};

export default BrandHeroVisual;
