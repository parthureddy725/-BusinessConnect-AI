import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Contact = () => {
  const { showToast } = useUI();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !content.trim()) return;
    setLoading(true);

    try {
      await axios.post('/messages', {
        senderName: name,
        senderEmail: email,
        content: content
      });
      showToast('Inquiry message sent successfully!');
      
      // Clear forms
      setName('');
      setEmail('');
      setContent('');
    } catch (err) {
      showToast('Error sending inquiry message.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full animate-fade-in">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Get In Touch</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Have questions about integrations or budgets? Message our digital agents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-4 flex flex-col justify-between py-2 gap-8">
            <div className="flex flex-col gap-6 text-xs text-slate-600 dark:text-slate-400">
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Email Support</h4>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">support@businessconnect.ai</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Phone Line</h4>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">+1 (555) 019-2834</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Office Address</h4>
                  <p className="mt-1 font-semibold text-slate-700 dark:text-slate-300">San Francisco, California</p>
                </div>
              </div>

              {/* Direct WhatsApp Action Link */}
              <div className="mt-2">
                <a
                  href="https://wa.me/15550192834"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg transition-all transform active:scale-95"
                >
                  <MessageSquare size={16} /> Direct WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Premium Dark Visual Map Frame */}
            <div className="w-full h-44 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-900 overflow-hidden relative shadow-lg">
              {/* Fake grid network map visual */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 via-transparent to-transparent"></div>
              
              {/* Pulse node marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-primary-500 border-2 border-white relative z-10"></span>
                <span className="w-8 h-8 rounded-full bg-primary-500/30 border border-primary-500 absolute -top-2.5 animate-ping"></span>
                <span className="text-[8px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full mt-2 tracking-wide uppercase">HQ</span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <GlassCard className="lg:col-span-8 p-6 md:p-8 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Inquiry Message</label>
                <textarea
                  rows={5}
                  placeholder="How can we assist you with design system tokens or automation scripts today?"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs mt-2 font-semibold shadow-glow-primary"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
                <Send size={14} />
              </button>

            </form>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};

export default Contact;
