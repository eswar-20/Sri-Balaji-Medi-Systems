import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Activity, Cpu, Stethoscope, Wrench, CheckCircle2 } from 'lucide-react';

const bentoItems = [
  {
    id: 'diagnostic-imaging',
    title: 'Diagnostic Imaging & Ultrasound',
    tagline: 'High-precision Sonography & Imaging',
    category: 'Imaging Equipment',
    link: '/products?category=Diagnostic%20Equipment',
    image: '/images/all-products/scan.webp',
    icon: Stethoscope,
    badge: 'Flagship Calibration',
    specs: ['Color Doppler Telemetry', 'Multi-frequency Probes', 'Digital DICOM Export'],
    colSpan: 'lg:col-span-7',
    gradient: 'from-sky-500/10 via-cyan-400/5 to-transparent',
    accentColor: '#0284c7',
  },
  {
    id: 'patient-monitoring',
    title: 'ICU & Patient Monitoring Systems',
    tagline: 'Continuous Vitals & Arrhythmia Alarms',
    category: 'Patient Monitors',
    link: '/products?category=Monitoring%20Systems',
    image: '/images/all-products/monitor.jpeg',
    icon: Activity,
    badge: 'Critical Care SLA',
    specs: ['Multi-Parameter Telemetry', 'Dual-NIBP Circuitry', '12.1" Crisp TFT Display'],
    colSpan: 'lg:col-span-5',
    gradient: 'from-teal-500/10 via-emerald-400/5 to-transparent',
    accentColor: '#0d9488',
  },
  {
    id: 'cardiology-ecg',
    title: '12-Channel Cardiology ECG Systems',
    tagline: 'Digital Diagnostic Electrocardiographs',
    category: 'ECG Machines',
    link: '/products?category=Diagnostic%20Equipment',
    image: '/images/all-products/bpl-108t-ecg-machine.png',
    icon: Cpu,
    badge: 'Certified Medical Grade',
    specs: ['Simultaneous 12-Lead Acquisition', 'High-speed Thermal Print', 'Built-in Pacemaker Filter'],
    colSpan: 'lg:col-span-5',
    gradient: 'from-blue-500/10 via-indigo-400/5 to-transparent',
    accentColor: '#2563eb',
  },
  {
    id: 'spare-parts-sensors',
    title: 'Genuine Biomedical Spare Parts & Probes',
    tagline: 'OEM Sensors, Cuffs, Probes & Batteries',
    category: 'Spare Parts',
    link: '/spare-parts',
    image: '/images/all-products/spo2.jpg',
    icon: Wrench,
    badge: 'Immediate Dispatch',
    specs: ['SpO2 Reusable Finger Probes', 'Lithium Backup Packs', 'NIBP Antimicrobial Cuffs'],
    colSpan: 'lg:col-span-7',
    gradient: 'from-cyan-500/10 via-sky-400/5 to-transparent',
    accentColor: '#0891b2',
  },
];

const BentoDiscoveryGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200 relative overflow-hidden">
      
      {/* Background Precision Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0284c7 1px, transparent 1px),
            linear-gradient(to bottom, #0284c7 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>02 // CLINICAL CATALOGUE DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered Diagnostic Systems & Components
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore calibrated hospital machinery, diagnostic monitors, and factory-certified biomedical replacement modules.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors group self-start md:self-auto"
          >
            <span>View Complete Inventory</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Asymmetric Bento Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {bentoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28, scale: shouldReduceMotion ? 1 : 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`${item.colSpan} group relative rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden hover:border-sky-300 hover:shadow-[0_16px_40px_-10px_rgba(2,132,199,0.12)] transition-all duration-400 flex flex-col justify-between`}
              >
                {/* Background Ambient Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Card Top Information */}
                <div className="p-6 sm:p-8 relative z-10">
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-[11px] font-bold tracking-wide text-slate-700 shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-sky-600" />
                      {item.badge}
                    </span>

                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-sky-600 group-hover:border-sky-300 transition-all duration-300 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                    {item.tagline}
                  </p>

                  {/* Bullet Specs */}
                  <div className="mt-4 space-y-2">
                    {item.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Bottom Showcase Image */}
                <div className="relative px-6 pb-6 sm:px-8 sm:pb-8 pt-2 flex items-center justify-center overflow-hidden z-10">
                  
                  {/* Subtle pedestal circle */}
                  <div className="absolute bottom-4 inset-x-12 h-20 bg-gradient-to-t from-sky-200/40 via-cyan-100/20 to-transparent rounded-full blur-xl pointer-events-none" />

                  <div className="relative w-full max-h-48 sm:max-h-56 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-44 sm:max-h-52 w-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] group-hover:scale-105 group-hover:drop-shadow-[0_16px_28px_rgba(2,132,199,0.18)] transition-all duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Full Card Link overlay */}
                <Link
                  to={item.link}
                  aria-label={`Explore ${item.title}`}
                  className="absolute inset-0 z-20"
                />

                {/* Bottom Cyan Accent Line on Hover */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default BentoDiscoveryGrid;
