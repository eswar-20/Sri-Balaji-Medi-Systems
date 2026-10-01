import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Activity, Truck, ArrowRight, Award, Zap, HardHat, CheckCircle2 } from 'lucide-react';
import BrandHeroVisual from '../components/BrandHeroVisual';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white via-sky-50/50 to-slate-50 overflow-hidden">
        
        {/* Subtle Background Accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold tracking-wider text-sky-700 uppercase shadow-sm">
              <Shield className="w-3.5 h-3.5 text-sky-600" /> ISO 9001:2015 Certified Healthcare Partner
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
              Advanced Medical <br />
              <span className="text-sky-600">
                Equipment & Care
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-lg">
              Sri Balaji Medi Systems supplies, calibrates, and maintains diagnostic imaging machinery, patient monitors, and genuine spare parts across India.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link to="/products" className="btn-primary flex items-center gap-2 text-sm shadow-md">
                Explore Equipment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/spare-parts" className="btn-secondary text-sm">
                Find Spare Parts
              </Link>
            </div>
          </motion.div>

          {/* Hero Right: Animated Brand Visual */}
          <div className="flex justify-center items-center w-full">
            <BrandHeroVisual />
          </div>

        </div>
      </section>

      {/* 2. Core Service Features Grid */}
      <section className="py-20 px-4 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-sky-600 text-xs font-bold uppercase tracking-widest">Medical Logistics & SLAs</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why Healthcare Providers Choose Sri Balaji</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:border-sky-300 hover:shadow-md transition-all duration-300 group text-left">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-6 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Quality Assurance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every ECG monitor, scanner, and ventilator undergoes rigorous electrical safety checks and medical calibration parameters before shipping.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:border-sky-300 hover:shadow-md transition-all duration-300 group text-left">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Priority Dispatch</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Critical care systems and essential spare parts are packed in shock-proof freight casings and dispatched via high-speed transit networks.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:border-sky-300 hover:shadow-md transition-all duration-300 group text-left">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Expert Engineers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our in-house field team features certified biomedical engineers qualified to install, diagnose, and maintain complex ICU machinery.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Annual Maintenance Contracts (AMC) Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-6">
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
              <Link to="/contact" className="btn-primary text-sm">
                Request AMC Contract Quote
              </Link>
            </div>
          </div>

          {/* AMC visual detail widget */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-md relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-100 to-transparent rounded-bl-3xl"></div>
            
            <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-600" /> Active SLA Guarantee
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Onsite SLA</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">Under 24 Hrs</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Priority Tech Support</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">24 Hours / 7 Days</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Part Delivery SLA</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">48 Hours Max</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Engineer Coverage</p>
                <p className="text-slate-900 text-xl font-extrabold mt-1">All Districts</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-emerald-800 text-xs font-medium">
                Emergency standby ICU equipment available under active Comprehensive maintenance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Trusted Partners & Brands Section */}
      <section className="py-16 px-4 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Trusted by Premier Healthcare Brands</p>
          
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {['GE Healthcare', 'Philips Medical', 'Siemens Healthineers', 'Mindray', 'Schiller AG', 'BPL Medical'].map((brand, idx) => (
              <span key={idx} className="text-slate-500 font-bold text-base sm:text-lg tracking-wider hover:text-sky-600 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Floating CTA Section */}
      <section className="py-16 px-4 bg-slate-900 text-white text-center relative">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Need diagnostic repairs or certified spare parts?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Search our comprehensive catalog of hospital equipment and replacement parts, or create a service request directly for onsite engineer support.
          </p>

          <div className="flex flex-wrap gap-3.5 justify-center pt-2">
            <Link to="/products" className="btn-primary flex items-center gap-2 text-sm">
              Browse Machinery <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/spare-parts" className="btn-secondary text-sm">
              Browse Parts Catalog
            </Link>
            <Link to="/contact" className="btn-secondary flex items-center gap-2 text-sm">
              <HardHat className="w-4 h-4 text-sky-600" /> Onsite Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

