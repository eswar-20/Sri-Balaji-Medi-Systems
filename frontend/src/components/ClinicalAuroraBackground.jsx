import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ClinicalAuroraBackground = ({ mouseX, mouseY }) => {
  const shouldReduceMotion = useReducedMotion();

  // Subtle aurora floating animations
  const auroraPrimaryAnim = shouldReduceMotion
    ? {}
    : {
        scale: [1, 1.08, 0.96, 1],
        opacity: [0.35, 0.5, 0.38, 0.35],
        x: ['-2%', '3%', '-1%', '-2%'],
        y: ['-2%', '2%', '-3%', '-2%'],
        transition: {
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  const auroraSecondaryAnim = shouldReduceMotion
    ? {}
    : {
        scale: [0.95, 1.06, 1, 0.95],
        opacity: [0.2, 0.35, 0.22, 0.2],
        x: ['2%', '-3%', '1%', '2%'],
        y: ['3%', '-2%', '1%', '3%'],
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/90" />

      {/* 2. Clinical Aurora Glowing Orbs */}
      {/* Primary Cyan/Sky Glow (Center-Right behind emblem) */}
      <motion.div
        style={{
          x: mouseX ? mouseX : 0,
          y: mouseY ? mouseY : 0,
        }}
        className="absolute top-[-10%] right-[-5%] lg:right-[5%] w-[520px] h-[520px] lg:w-[680px] lg:h-[680px] rounded-full"
      >
        <motion.div
          animate={auroraPrimaryAnim}
          className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400/25 via-cyan-300/30 to-teal-200/20 blur-[110px]"
        />
      </motion.div>

      {/* Secondary Mint/Teal Glow (Left under headline) */}
      <motion.div
        style={{
          x: mouseX ? mouseX : 0,
          y: mouseY ? mouseY : 0,
        }}
        className="absolute top-[20%] left-[-10%] lg:left-[-2%] w-[420px] h-[420px] lg:w-[580px] lg:h-[580px] rounded-full"
      >
        <motion.div
          animate={auroraSecondaryAnim}
          className="w-full h-full rounded-full bg-gradient-to-br from-teal-300/20 via-sky-300/20 to-blue-400/15 blur-[120px]"
        />
      </motion.div>

      {/* Tertiary Soft Center Focus Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-200/15 via-cyan-100/25 to-sky-200/15 rounded-full blur-[90px]" />

      {/* 3. Subtle Clinical Precision Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0284c7 1px, transparent 1px),
            linear-gradient(to bottom, #0284c7 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 4. Precision Crosshair Markers */}
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="crosshair-pattern" width="240" height="240" patternUnits="userSpaceOnUse">
            {/* Corner crosshairs */}
            <path d="M 0 10 L 0 0 L 10 0" fill="none" stroke="#0284c7" strokeWidth="1" />
            <path d="M 240 10 L 240 0 L 230 0" fill="none" stroke="#0284c7" strokeWidth="1" />
            <path d="M 0 230 L 0 240 L 10 240" fill="none" stroke="#0284c7" strokeWidth="1" />
            <path d="M 240 230 L 240 240 L 230 240" fill="none" stroke="#0284c7" strokeWidth="1" />
            {/* Center cross mark */}
            <circle cx="120" cy="120" r="1.5" fill="#0284c7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crosshair-pattern)" />
      </svg>

      {/* 5. Vignette Bottom Blend to next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent" />
    </div>
  );
};

export default ClinicalAuroraBackground;
