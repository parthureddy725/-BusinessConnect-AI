import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { ArrowRight, Code, Cpu, Sparkles, CheckCircle2, ChevronRight, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';
import axios from 'axios';

// Animated Text Typer component
const TypingHeader = () => {
  const words = ["Web & Mobile Engineering", "Branded UI/UX Design", "Autonomous AI Agents"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index]);

  // Cursor blink
  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
      Scale Your Digital Identity <br className="hidden md:inline" />
      <span className="text-gradient">
        {words[index].substring(0, subIndex)}
      </span>
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} text-primary-500 font-normal ml-0.5`}>|</span>
    </h1>
  );
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch Services
    axios.get('/services')
      .then(res => setServices(res.data.slice(0, 3)))
      .catch(err => console.error(err));

    // Fetch Testimonials
    axios.get('/testimonials')
      .then(res => setTestimonials(res.data.slice(0, 2)))
      .catch(err => console.error(err));
  }, []);

  // Stats definition
  const stats = [
    { label: 'Successful Launches', value: '180+' },
    { label: 'Client Retention Rate', value: '98.5%' },
    { label: 'AI Agent Automations', value: '15k+' },
    { label: 'Customer Satisfaction Score', value: '4.9/5' }
  ];

  return (
    <div className="relative z-10 w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6">
        {/* Glow Spheres */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-3xl pointer-events-none animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-secondary-500/10 dark:bg-secondary-500/5 blur-3xl pointer-events-none animate-float-slow [animation-delay:2s]"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-500/20 shadow-sm">
              <Sparkles size={14} className="animate-spin" />
              <span>Next-Gen CX & Client Hub Platform</span>
            </div>
            
            <TypingHeader />

            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Establish a premium web presence, manage customer bookings, and track your active project milestones live in real-time. Powering agency transparency and business growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2">
              <Link to="/consultation" className="btn-primary py-3 px-6 text-sm font-semibold">
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="btn-secondary py-3 px-6 text-sm font-semibold">
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right Visual Column (Premium Glassmorphic Dashboard Preview) */}
          <div className="relative flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 rounded-3xl blur-2xl transform rotate-3 scale-95 pointer-events-none"></div>
            
            <GlassCard className="w-full max-w-[480px] p-6 border-white/30 dark:border-slate-800/60 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-slate-900/40">
              {/* App bar mock */}
              <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-850 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] bg-slate-100 dark:bg-slate-850 border border-slate-200/40 dark:border-slate-700/30 px-3 py-1 rounded-full text-slate-500">
                  client.businessconnect.ai
                </div>
              </div>

              {/* Inside Dashboard Content Mock */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Project Tracking</p>
                    <h4 className="text-base font-bold mt-0.5 text-slate-800 dark:text-white">Storefront Rebrand</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-500">
                    60% Completed
                  </span>
                </div>

                {/* Progress bar mock */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 w-[60%] rounded-full"></div>
                </div>

                {/* Active Milestones */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      <span className="font-medium">UI Wireframe Mockup</span>
                    </div>
                    <span className="text-[10px]">Approved</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10">
                    <div className="flex items-center gap-2">
                      <Code size={14} className="animate-pulse" />
                      <span className="font-medium">Database Integration</span>
                    </div>
                    <span className="text-[10px] animate-pulse">In Progress</span>
                  </div>
                </div>

                {/* Counter Metric Box */}
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="p-3.5 bg-slate-100/55 dark:bg-slate-850/50 border border-slate-200/30 dark:border-slate-700/30 rounded-2xl">
                    <p className="text-[10px] text-slate-500">Latest Invoice</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">$2,500</p>
                    <span className="text-[9px] text-rose-500 font-semibold block mt-0.5">Unpaid (Due Aug 1)</span>
                  </div>
                  <div className="p-3.5 bg-slate-100/55 dark:bg-slate-850/50 border border-slate-200/30 dark:border-slate-700/30 rounded-2xl">
                    <p className="text-[10px] text-slate-500">Live Support Chat</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-1.5 flex items-center gap-1">
                      <Cpu size={12} className="text-secondary-400 animate-spin" />
                      AI Assistant
                    </p>
                    <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">Connected</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS MILESTONES */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-850/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CORE SERVICES PREVIEW */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our High-Impact Services</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md mx-auto">
              Custom digital assets built for speed, responsiveness, and brand identity expansion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv) => (
              <GlassCard key={srv._id || srv.id} className="p-6 relative flex flex-col justify-between h-80 bg-white/70 dark:bg-slate-900/40">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-5 border border-primary-500/20">
                    {srv.name.includes('Web') ? <Code size={22} /> : srv.name.includes('AI') ? <Cpu size={22} /> : <Sparkles size={22} />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{srv.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate-3-lines">{srv.description}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{srv.pricing}</span>
                  <Link to="/services" className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1">
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 px-6 border-t border-slate-200/40 dark:border-slate-850/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Engineered For Dynamic Collaboration</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We resolve the black-box opacity issues of traditional agencies. Through our direct Customer Portal & Live Milestone Tracking dashboard, you monitor coding progress step-by-step.
            </p>

            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Milestone Progress Tracking</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Track code builds, wireframes, and completions transparently.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Interactive Support Agent</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Instant solutions, price answers, and scheduling coordinates.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Direct Invoicing & Document Hub</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Download files, preview agreements, and pay invoices instantly.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-6 text-center bg-white/70 dark:bg-slate-900/40">
              <BarChart3 className="text-primary-500 mx-auto mb-3" size={26} />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Metrics</h4>
              <p className="text-xs text-slate-500 mt-1">Analytics charts mapping project completions.</p>
            </GlassCard>
            <GlassCard className="p-6 text-center bg-white/70 dark:bg-slate-900/40 mt-6">
              <TrendingUp className="text-secondary-400 mx-auto mb-3" size={26} />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Conversion Optimization</h4>
              <p className="text-xs text-slate-500 mt-1">Sleek styling and minimal layout details driving conversion.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* SECTION 5: CUSTOMER REVIEWS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">What Our Clients Say</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
              Read verified testimonials from digital platform owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.length === 0 ? (
              <p className="text-xs text-slate-500 text-center col-span-2">Loading reviews...</p>
            ) : (
              testimonials.map((t) => (
                <GlassCard key={t._id || t.id} className="p-6 relative bg-white/70 dark:bg-slate-900/40">
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={t.image}
                      alt={t.clientName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.clientName}</h4>
                      <p className="text-[10px] text-slate-500">{t.role}</p>
                    </div>
                    <div className="ml-auto text-amber-400 font-bold text-xs">{"★".repeat(t.rating)}</div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center rounded-3xl p-10 md:p-16 bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-50 blur-2xl transform scale-110 pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Establish Your Premium Presence Today</h2>
          <p className="text-sm text-white/90 leading-relaxed max-w-lg mx-auto mb-8">
            Reach our tech team, request customized features, and explore pricing packages tailored directly to your scale.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/consultation" className="px-6 py-3 bg-white text-primary-600 hover:bg-slate-55 rounded-xl font-bold text-sm shadow-xl transition-all duration-300 transform active:scale-95">
              Book Appointment
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-95">
              Contact Team
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
