import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, Award, CheckCircle2, ArrowRight, Activity, Wrench } from 'lucide-react';
import BrandHeroVisual from '../components/BrandHeroVisual';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#252525] overflow-x-hidden font-sans select-auto">
      
      {/* ==================================================
          1. HERO SECTION
          ================================================== */}
      <section className="relative min-h-[86vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-20 border-b border-[#E5E1DA]">
        
        {/* Subtle neutral ambient shadow */}
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-neutral-200/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center relative z-10">
          
          {/* Hero Left: Corporate Identity & Headline */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Corporate Badge (Verified Non-Quantitative Brand Message) */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E1DA] text-xs font-bold tracking-wider text-[#252525] uppercase shadow-sm">
              <Shield className="w-3.5 h-3.5 text-[#77736E]" />
              <span>Healthcare Equipment & Engineering Support</span>
            </div>
            
            {/* Clean Executive Headline */}
            <div className="space-y-1.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#252525]">
                Precision Medical Technology.
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#77736E]">
                Built for Better Care.
              </h1>
            </div>

            {/* Corporate Description */}
            <p className="text-[#77736E] text-base sm:text-lg font-normal leading-relaxed max-w-xl">
              Sri Balaji Medi Systems supplies, calibrates, and maintains diagnostic imaging machinery, patient ICU monitors, and certified biomedical spare parts across India.
            </p>

            {/* Professional Neutral CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/products" 
                className="btn-primary flex items-center gap-2 text-sm px-6 py-3.5"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contact" 
                className="btn-secondary text-sm px-6 py-3.5"
              >
                Contact Us
              </Link>
            </div>

          </div>

          {/* Hero Right: Large SBMS Monogram Emblem */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <BrandHeroVisual />
          </div>

        </div>
      </section>

      {/* ==================================================
          2. CORE CAPABILITY PILLARS
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto text-center space-y-14">
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <p className="text-[#77736E] text-xs font-bold uppercase tracking-widest">
              Biomedical Engineering & Support
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
              Why Healthcare Providers Partner With Sri Balaji
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-[#FCFBF8] border border-[#E5E1DA] p-8 rounded-2xl hover:border-[#252525] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-[#F7F5F0] rounded-xl flex items-center justify-center text-[#252525] mb-6 border border-[#E5E1DA] shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-[#252525] font-bold text-lg mb-2.5">Quality Assurance</h3>
              <p className="text-[#77736E] text-sm leading-relaxed">
                Every diagnostic monitor, scanner, and critical care system undergoes electrical safety testing and parameter calibration before dispatch.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FCFBF8] border border-[#E5E1DA] p-8 rounded-2xl hover:border-[#252525] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-[#F7F5F0] rounded-xl flex items-center justify-center text-[#252525] mb-6 border border-[#E5E1DA] shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-[#252525] font-bold text-lg mb-2.5">Priority Dispatch</h3>
              <p className="text-[#77736E] text-sm leading-relaxed">
                Critical care systems and essential spare parts are packed in protective freight casings and dispatched via verified logistics routes.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FCFBF8] border border-[#E5E1DA] p-8 rounded-2xl hover:border-[#252525] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-[#F7F5F0] rounded-xl flex items-center justify-center text-[#252525] mb-6 border border-[#E5E1DA] shadow-sm">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-[#252525] font-bold text-lg mb-2.5">Expert Engineers</h3>
              <p className="text-[#77736E] text-sm leading-relaxed">
                Our in-house technical team features qualified biomedical engineers ready to install, diagnose, and maintain hospital machinery.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          3. HOSPITAL AMC & MAINTENANCE OVERVIEW
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F5F0] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E5E1DA] text-xs font-bold tracking-wider text-[#252525] uppercase shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#77736E]" /> Support Contracts
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#252525] leading-tight">
              Hospital AMC & Comprehensive Maintenance Contracts
            </h2>
            <p className="text-[#77736E] text-sm sm:text-base leading-relaxed">
              Downtime in medical equipment can disrupt vital hospital operations. Sri Balaji Medi Systems offers Annual Maintenance Contracts (AMC) that provide scheduled preventative inspections, calibration checks, and emergency onsite technician support.
            </p>
            
            <div className="space-y-3 pt-2">
              {[
                'Standard preventative calibration inspections',
                'Emergency onsite troubleshooting and technical diagnostics',
                'Biomedical spare part replacements and module servicing',
                'Equipment performance and safety verification logs'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-[#3A3836]">
                  <CheckCircle2 className="w-4 h-4 text-[#252525] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link 
                to="/contact" 
                className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3.5"
              >
                Request AMC Contract Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* AMC Service Details Panel */}
          <div className="bg-white border border-[#E5E1DA] p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <h3 className="text-[#252525] font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#252525]" /> Service Level Commitment
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FCFBF8] border border-[#E5E1DA]">
                <p className="text-xs text-[#77736E] font-bold uppercase tracking-wider">Technical Support</p>
                <p className="text-[#252525] text-xl font-extrabold mt-1.5">24 / 7 Response</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FCFBF8] border border-[#E5E1DA]">
                <p className="text-xs text-[#77736E] font-bold uppercase tracking-wider">Testing Standard</p>
                <p className="text-[#252525] text-xl font-extrabold mt-1.5">Diagnostic Grade</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FCFBF8] border border-[#E5E1DA]">
                <p className="text-xs text-[#77736E] font-bold uppercase tracking-wider">Replacement Parts</p>
                <p className="text-[#252525] text-xl font-extrabold mt-1.5">Tested & Verified</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FCFBF8] border border-[#E5E1DA]">
                <p className="text-xs text-[#77736E] font-bold uppercase tracking-wider">Field Coverage</p>
                <p className="text-[#252525] text-xl font-extrabold mt-1.5">Onsite Support</p>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E5E1DA] flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#252525] shrink-0" />
              <p className="text-[#3A3836] text-xs font-semibold">
                Emergency standby medical machinery available under active Comprehensive maintenance agreements.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          4. BOTTOM CONTACT CALLOUT
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FCFBF8] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
            Need diagnostic repairs or biomedical spare parts?
          </h2>
          <p className="text-[#77736E] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Search our comprehensive inventory of hospital equipment and replacement modules, or create a service request directly for onsite biomedical engineer support.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-3">
            <Link 
              to="/products" 
              className="btn-primary flex items-center gap-2 text-sm px-6 py-3.5"
            >
              Browse Equipment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/spare-parts" 
              className="btn-secondary text-sm px-6 py-3.5"
            >
              Browse Spare Parts
            </Link>
            <Link 
              to="/contact" 
              className="btn-secondary flex items-center gap-2 text-sm px-6 py-3.5"
            >
              <Wrench className="w-4 h-4 text-[#77736E]" /> Onsite Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
