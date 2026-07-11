import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Star, Shield, Activity, Truck, ArrowRight, Award, Zap, HardHat } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#071A2F] text-white overflow-x-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-[#071A2F] via-[#0F2745] to-[#071A2F] overflow-hidden">
        
        {/* Animated Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D9BF0]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D9BF0]/10 border border-[#1D9BF0]/20 text-xs font-bold tracking-wider text-[#1D9BF0] uppercase">
              <Shield className="w-3.5 h-3.5" /> ISO 9001:2015 Certified Healthcare Partner
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Next-Gen Medical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9BF0] via-white to-[#D4AF37]">
                Equipment & Care
              </span>
            </h1>

            <p className="text-[#C8D3E0] text-lg sm:text-xl font-light leading-relaxed max-w-lg">
              Sri Balaji Medi Systems supplies, calibrates, and maintains diagnostic imaging machinery, patient monitors, and genuine spare parts across India.
            </p>

            {/* Quick Stats Grid inside Hero */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10 max-w-md">
              <div>
                <p className="text-[#D4AF37] text-2xl font-black">28+</p>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mt-1">Years Active</p>
              </div>
              <div>
                <p className="text-[#1D9BF0] text-2xl font-black">1.2K+</p>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mt-1">Hospitals Fed</p>
              </div>
              <div>
                <p className="text-emerald-400 text-2xl font-black">99.8%</p>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mt-1">SLA Uptime</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/products" className="btn-primary flex items-center gap-2">
                Explore Equipment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/spare-parts" className="btn-secondary">
                Find Spare Parts
              </Link>
            </div>
          </motion.div>

          {/* Hero Right Banner Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Visual Glassmorphic Shield Card */}
            <div className="relative overflow-hidden bg-gradient-to-tr from-[#142F52]/60 to-[#0F2745]/40 p-8 sm:p-10 rounded-3xl border border-white/[0.08] shadow-2xl backdrop-blur-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1D9BF0]/20 to-transparent rounded-bl-3xl"></div>
              
              <h2 className="text-[#D4AF37] font-black text-xl tracking-tight mb-6">Direct Hotline Support</h2>
              
              <div className="space-y-6">
                
                {/* Support Block 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-[#1D9BF0]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Tele-Support Phone</p>
                    <p className="text-white font-extrabold text-lg mt-0.5">+91 99480 73090</p>
                  </div>
                </div>

                {/* Support Block 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-[#D4AF37]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Direct Business Email</p>
                    <p className="text-white font-extrabold text-sm mt-0.5 break-all">sribalajimedisystemsofficial@gmail.com</p>
                  </div>
                </div>

                {/* Support Block 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Central HQ & Diagnostics</p>
                    <p className="text-white font-extrabold text-sm mt-0.5">Rajahmundry, Andhra Pradesh, India</p>
                  </div>
                </div>

              </div>

              {/* Verified Badge */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-[#C8D3E0]">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />)}
                </div>
                <span>Rated 4.9/5 by 180+ Medical Institutions</span>
              </div>
            </div>
            
            {/* Ambient gold card background shadow */}
            <div className="absolute -inset-0.5 bg-[#D4AF37]/10 rounded-3xl blur-xl pointer-events-none -z-10"></div>
          </motion.div>

        </div>
      </section>

      {/* 2. Core Service Features Grid */}
      <section className="py-20 px-4 bg-[#071A2F] border-t border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Medical Logistics & SLAs</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Why Healthcare Providers Choose Sri Balaji</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#142F52]/20 border border-white/[0.06] p-8 rounded-2xl hover:border-[#1D9BF0]/30 hover:bg-[#142F52]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#1D9BF0]/10 border border-[#1D9BF0]/20 rounded-xl flex items-center justify-center text-[#1D9BF0] mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-lg mb-3">Premium Quality Assurance</h3>
              <p className="text-[#C8D3E0] text-sm leading-relaxed">
                Every ECG monitor, scanner, and ventilator undergoes rigorous electrical safety checks and medical calibration parameters before shipping.
              </p>
            </div>

            <div className="bg-[#142F52]/20 border border-white/[0.06] p-8 rounded-2xl hover:border-[#D4AF37]/30 hover:bg-[#142F52]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37] mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-lg mb-3">Priority Hospital Dispatch</h3>
              <p className="text-[#C8D3E0] text-sm leading-relaxed">
                Critical care systems and essential spare parts are packed in shock-proof freight casings and dispatched via high-speed transit networks.
              </p>
            </div>

            <div className="bg-[#142F52]/20 border border-white/[0.06] p-8 rounded-2xl hover:border-emerald-500/30 hover:bg-[#142F52]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-lg mb-3">Expert Service Engineers</h3>
              <p className="text-[#C8D3E0] text-sm leading-relaxed">
                Our in-house field team features highly skilled electronics engineers qualified to install, diagnose, and repair complex ICU machinery.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Annual Maintenance Contracts (AMC) Section */}
      <section className="py-20 px-4 bg-[#0F2745]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
              <Award className="w-3.5 h-3.5" /> Maintenance & Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Hospital AMC & Comprehensive Maintenance Contracts
            </h2>
            <p className="text-[#C8D3E0] text-sm leading-relaxed">
              Downtime in medical equipment can cost lives and trigger operating losses. Sri Balaji offers pre-negotiated Annual Maintenance Contracts (AMC) that guarantee scheduled preventative checks, sensor safety checks, and emergency onsite technician dispatches.
            </p>
            
            <div className="space-y-3 pt-2">
              {[
                'Standard preventative calibration inspections',
                'Emergency onsite troubleshooting in Andhra Pradesh',
                'Discounted pricing on certified spare part replacements',
                'Complimentary telemetry diagnostics analysis logs'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-[#C8D3E0]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0]"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/contact" className="btn-secondary text-sm">
                Request AMC Contract Quote
              </Link>
            </div>
          </div>

          {/* AMC visual detail widget */}
          <div className="bg-[#142F52]/40 border border-white/[0.08] p-8 rounded-3xl space-y-6 shadow-xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-3xl"></div>
            
            <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37]" /> Active SLA Guarantee
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Onsite SLA</p>
                <p className="text-white text-xl font-extrabold mt-1">Under 24 Hrs</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Priority Tech Support</p>
                <p className="text-white text-xl font-extrabold mt-1">24 Hours / 7 Days</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Part Delivery SLA</p>
                <p className="text-white text-xl font-extrabold mt-1">48 Hours Max</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Engineer Coverage</p>
                <p className="text-white text-xl font-extrabold mt-1">All Districts</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-emerald-300 text-xs font-semibold">
                Emergency standby ICU equipment available under active Comprehensive maintenance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Trusted Partners & Brands Section */}
      <section className="py-16 px-4 bg-[#071A2F] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Trusted by Premier Healthcare Brands</p>
          
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['GE Healthcare', 'Philips Medical', 'Siemens Healthineers', 'Mindray', 'Schiller AG', 'BPL Medical'].map((brand, idx) => (
              <span key={idx} className="text-white font-extrabold text-lg sm:text-xl tracking-wider hover:opacity-100 transition-opacity cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Floating CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#0F2745] via-[#142F52] to-[#071A2F] border-t border-white/[0.06] text-center relative">
        <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Need urgent diagnostic repairs or a quick spare part?
          </h2>
          <p className="text-[#C8D3E0] max-w-2xl mx-auto text-base">
            Search our comprehensive, type-segregated catalog of medical equipment and replacement parts, or create a service request directly for onsite engineer support.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Browse Machinery <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/spare-parts" className="btn-secondary">
              Browse Parts Catalog
            </Link>
            <Link to="/contact" className="btn-secondary flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#D4AF37]" /> Onsite Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
