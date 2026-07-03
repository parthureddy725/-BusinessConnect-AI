import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';
import { useUI } from '../context/UIContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useUI();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed to newsletter successfully!');
    setEmail('');
  };

  return (
    <footer className="relative z-10 bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Block */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-glow-primary">
              <span className="font-extrabold text-lg">B</span>
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              BusinessConnect <span className="text-gradient">AI</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed mt-2">
            Accelerating digital transformations with modern web designs, high-converting portfolios, and custom AI automations.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Website">
              <Globe size={16} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Support Chat">
              <MessageSquare size={16} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Services</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li><Link to="/services" className="hover:text-white transition-colors">Web Development</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Mobile App Solutions</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">UI/UX Interface Design</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">AI Chatbot Automations</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Contact Us</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-secondary-400" />
              <span>info@businessconnect.ai</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-secondary-400" />
              <span>+1 (555) 019-2834</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="text-secondary-400" />
              <span>San Francisco, CA</span>
            </li>
            <li>
              <a
                href="https://wa.me/15550192834"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs transition-colors"
              >
                <MessageSquare size={14} /> Direct WhatsApp Chat
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Stay Informed</h4>
          <p className="text-sm leading-relaxed mb-4">
            Subscribe to receive our latest tech stacks updates, design trends, and AI updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-primary-500 w-full"
            />
            <button
              type="submit"
              className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
              aria-label="Subscribe"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} BusinessConnect AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
