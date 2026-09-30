import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2, Send, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          
          {/* Brand and Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-sky-400 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">SB</span>
              </div>
              <div>
                <span className="text-white font-extrabold text-lg tracking-tight leading-none">SRI BALAJI</span>
                <p className="text-sky-400 text-[9px] uppercase font-bold tracking-widest mt-0.5">Medical Systems</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Supplying hospitals, diagnostics labs, and healthcare providers across India with certified medical machinery, diagnostic systems, and genuine spare parts.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              {[
                { icon: <Globe className="w-4 h-4" />, link: '#' },
                { icon: <Share2 className="w-4 h-4" />, link: '#' },
                { icon: <Send className="w-4 h-4" />, link: '#' }
              ].map((s, idx) => (
                <a 
                  key={idx} 
                  href={s.link} 
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:bg-slate-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-sky-400 transition-colors">Medical Equipment</Link></li>
              <li><Link to="/spare-parts" className="hover:text-sky-400 transition-colors">Spare Parts</Link></li>
              <li><Link to="/services/my-requests" className="hover:text-sky-400 transition-colors">Service Requests</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Annual Contracts (AMC)</Link></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Business Hours</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Mon – Sat: <span className="text-white font-medium">9:00 AM – 7:00 PM</span></li>
              <li>Sunday: <span className="text-white font-medium">Emergencies Only</span></li>
              <li className="pt-2 text-xs text-sky-400 font-semibold">24/7 Remote Diagnostics Support</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Contact Info</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>+91 99480 73090</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="break-all">sribalajimedisystemsofficial@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Hospital Road, Rajahmundry, Andhra Pradesh</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            © 2026 Sri Balaji Medi Systems. Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Healthcare Excellence.
          </p>
          <div className="flex space-x-6">
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Shipping Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

