import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import { Shield, Activity, Truck, ArrowRight, Award, Zap, HardHat, CheckCircle2 } from 'lucide-react';
import ClinicalAuroraBackground from '../components/ClinicalAuroraBackground';
import BrandHeroVisual from '../components/BrandHeroVisual';
import BentoDiscoveryGrid from '../components/BentoDiscoveryGrid';

const HomePage = () => {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // 1. Smooth Mouse Parallax for Desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms (subtle 2-8px shifts)
  const auroraX = useTransform(smoothMouseX, [-300, 300], [-8, 8]);
  const auroraY = useTransform(smoothMouseY, [-300, 300], [-8, 8]);
  const pedestalX = useTransform(smoothMouseX, [-300, 300], [-4, 4]);
  const pedestalY = useTransform(smoothMouseY, [-300, 300], [-4, 4]);
  const contentX = useTransform(smoothMouseX, [-300, 300], [2, -2]);
  const contentY = useTransform(smoothMouseY, [-300, 300], [2, -2]);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 2. Scroll Animation for Hero (gentle fade and lift without hijacking scroll)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.98]);
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.8], [0, -40]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans select-auto">
      
      {/* ==================================================
          1. HERO SECTION: "SBMS CLINICAL AURORA"
          ================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden border-b border-slate-200/80"
      >
        {/* PHASE 1: Clinical Aurora Background */}
        <ClinicalAuroraBackground mouseX={auroraX} mouseY={auroraY} />

        {/* Hero Interactive Container */}
        <motion.div
          style={{
            opacity: shouldReduceMotion ? 1 : heroOpacity,
            scale: shouldReduceMotion ? 1 : heroScale,
            y: shouldReduceMotion ? 0 : heroTranslateY,
          }}
          className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10"
        >
          
          {/* Hero Left: Headline, Staggered Reveal, Supporting text, CTAs */}
          <motion.div 
            style={{
              x: shouldReduceMotion ? 0 : contentX,
              y: shouldReduceMotion ? 0 : contentY,
            }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            
            {/* Top Verification Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-sky-200 text-xs font-bold tracking-wider text-sky-800 uppercase shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>ISO 9001:2015 Certified Biomedical Partner</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.div>
            
            {/* PHASE 5: Headline Reveal with Blur-to-Sharp Transition */}
            <div className="space-y-1">
              <motion.h1 
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900"
              >
                PRECISION EQUIPMENT.
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600"
              >
                BUILT FOR BETTER CARE.
              </motion.h1>
            </div>

            {/* PHASE 6: Supporting Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-xl"
            >
              Sri Balaji Medi Systems supplies, calibrates, and maintains diagnostic imaging machinery, patient ICU monitors, and factory-certified spare parts across India.
            </motion.p>

            {/* PHASE 6: CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 pt-3"
            >
              <Link 
                to="/products" 
                className="btn-primary flex items-center gap-2 text-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                Explore Equipment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/spare-parts" 
                className="btn-secondary text-sm hover:border-sky-300 transition-all duration-300"
              >
                Find Spare Parts
              </Link>
              <Link 
                to="/contact" 
                className="btn-secondary flex items-center gap-2 text-sm hover:border-sky-300 transition-all duration-300"
              >
                <HardHat className="w-4 h-4 text-sky-600" /> Onsite Service
              </Link>
            </motion.div>

          </motion.div>

          {/* Hero Right: PHASE 2, 3, 4, 7 SBMS CLINICAL AURORA MONOGRAM VISUAL */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <BrandHeroVisual mouseX={pedestalX} mouseY={pedestalY} />
          </div>

        </motion.div>
      </section>

      {/* ==================================================
          2. ASYMMETRIC BENTO PRODUCT DISCOVERY GRID
          ================================================== */}
      <BentoDiscoveryGrid />

      {/* ==================================================
          3. CORE SERVICE FEATURES GRID
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 max-w-2xl mx-auto"
          >
            <h2 className="text-sky-600 text-xs font-bold uppercase tracking-widest">Medical Logistics & SLAs</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why Healthcare Providers Choose Sri Balaji</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-slate-200/90 p-8 rounded-3xl hover:border-sky-300 hover:shadow-md transition-all duration-300 group text-left"
            >
              <div className="w-12 h-12 bg-sky-100/80 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Quality Assurance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every ECG monitor, scanner, and ventilator undergoes rigorous electrical safety checks and medical calibration parameters before shipping.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-slate-200/90 p-8 rounded-3xl hover:border-sky-300 hover:shadow-md transition-all duration-300 group text-left"
            >
              <div className="w-12 h-12 bg-teal-100/80 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Priority Dispatch</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Critical care systems and essential spare parts are packed in shock-proof freight casings and dispatched via high-speed transit networks.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-slate-200/90 p-8 rounded-3xl hover:border-sky-300 hover:shadow-md transition-all duration-300 group text-left"
            >
              <div className="w-12 h-12 bg-emerald-100/80 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Expert Engineers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our in-house field team features certified biomedical engineers qualified to install, diagnose, and maintain complex ICU machinery.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==================================================
          4. ANNUAL MAINTENANCE CONTRACTS (AMC) SECTION
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold tracking-wider text-teal-700 uppercase">
              <Award className="w-3.5 h-3.5" /> Maintenance & Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Hospital AMC & Comprehensive Maintenance Contracts
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Downtime in medical equipment can cost lives and trigger operating losses. Sri Balaji offers pre-negotiated Annual Maintenance Contracts (AMC) that guarantee scheduled preventative checks, sensor safety checks, and emergency onsite technician dispatches.
            </p>
            
            <div className="space-y-3 pt-2">
              {[
                'Standard preventative calibration inspections',
                'Emergency onsite troubleshooting in Andhra Pradesh',
                'Discounted pricing on certified spare part replacements',
                'Complimentary telemetry diagnostics analysis logs'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link to="/contact" className="btn-primary text-sm shadow-md">
                Request AMC Contract Quote
              </Link>
            </div>
          </motion.div>

          {/* AMC visual detail widget */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/60 to-transparent rounded-bl-full pointer-events-none" />
            
            <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-600" /> Active SLA Guarantee
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Onsite SLA</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">Under 24 Hrs</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Priority Tech Support</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">24 Hours / 7 Days</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Part Delivery SLA</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">48 Hours Max</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Engineer Coverage</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">All Districts</p>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-emerald-800 text-xs font-medium">
                Emergency standby ICU equipment available under active Comprehensive maintenance.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ==================================================
          5. TRUSTED HEALTHCARE BRANDS SECTION
          ================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center space-y-8"
        >
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Calibrated Systems Compatible With Global Medical Manufacturers
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {['GE Healthcare', 'Philips Medical', 'Siemens Healthineers', 'Mindray', 'Schiller AG', 'BPL Medical'].map((brand, idx) => (
              <span key={idx} className="text-slate-500 font-bold text-base sm:text-lg tracking-wider hover:text-sky-600 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================================================
          6. FLOATING BOTTOM CTA SECTION
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white text-center relative overflow-hidden">
        {/* Ambient Dark Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-6 relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Need diagnostic repairs or certified spare parts?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Search our comprehensive catalog of hospital equipment and replacement parts, or create a service request directly for onsite biomedical engineer support.
          </p>

          <div className="flex flex-wrap gap-3.5 justify-center pt-3">
            <Link to="/products" className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-sky-950/50">
              Browse Machinery <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/spare-parts" className="btn-secondary text-sm">
              Browse Parts Catalog
            </Link>
            <Link to="/contact" className="btn-secondary flex items-center gap-2 text-sm">
              <HardHat className="w-4 h-4 text-sky-600" /> Onsite Request
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default HomePage;
