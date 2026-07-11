import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2, Send, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0F2745] border-t border-white/[0.06] mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          
          {/* Brand and Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#1D9BF0] to-[#D4AF37] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-[#071A2F] font-black text-sm">SB</span>
              </div>
              <div>
                <span className="text-white font-extrabold text-lg tracking-tight leading-none">SRI BALAJI</span>
                <p className="text-[#D4AF37] text-[9px] uppercase font-bold tracking-widest mt-0.5">Medical Systems</p>
              </div>
            </div>
            <p className="text-[#C8D3E0] text-sm leading-relaxed max-w-sm">
              Supplying hospitals, diagnostics labs, and healthcare providers across India with premium, highly calibrated medical machinery, diagnostic systems, and genuine spare parts.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {[
                { icon: <Globe className="w-4 h-4" />, link: '#' },
                { icon: <Share2 className="w-4 h-4" />, link: '#' },
                { icon: <Send className="w-4 h-4" />, link: '#' }
              ].map((s, idx) => (
                <a 
                  key={idx} 
                  href={s.link} 
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 hover:text-[#1D9BF0] hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3.5 text-sm text-[#C8D3E0]">
              <li><Link to="/products" className="hover:text-white transition-colors">Medical Equipment</Link></li>
              <li><Link to="/spare-parts" className="hover:text-white transition-colors">Spare Parts</Link></li>
              <li><Link to="/services/request" className="hover:text-white transition-colors">Book Field Service</Link></li>
              <li><Link to="/services/amc" className="hover:text-white transition-colors">Annual Contracts (AMC)</Link></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-6">Business Hours</h3>
            <ul className="space-y-3 text-sm text-[#C8D3E0]">
              <li>Mon – Sat: <span className="text-white font-semibold">9:00 AM – 7:00 PM</span></li>
              <li>Sunday: <span className="text-white font-semibold">Emergencies Only</span></li>
              <li className="pt-2 text-xs text-[#1D9BF0] font-semibold">24/7 Remote Diagnostics Active</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-6">Contact Info</h3>
            <ul className="space-y-3.5 text-sm text-[#C8D3E0]">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
                <span>+91 94901 23456</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
                <span className="break-all">support@sribalaji.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
                <span>Hospital Road, Rajahmundry, Andhra Pradesh</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#C8D3E0] gap-4">
          <p className="flex items-center gap-1">
            © 2026 Sri Balaji Medi Systems. Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Healthcare Excellence.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-white transition-colors">Shipping & GST Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
