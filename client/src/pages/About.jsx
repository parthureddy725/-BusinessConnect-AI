import React from 'react';
import GlassCard from '../components/GlassCard';
import { Target, Compass, Award, Calendar, Heart, Shield, Users, Mail } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Alex Rivera',
      role: 'CEO & Solutions Architect',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      bio: 'Ex-Lead architect at tech giants. Specialize in full-stack product scaling and client integration.'
    },
    {
      name: 'Elena Rostova',
      role: 'Head of UI/UX Brand Design',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      bio: 'Passionate about clean layouts, micro-interactions, and visual storytelling dashboards.'
    },
    {
      name: 'Devon Patel',
      role: 'AI Infrastructure Lead',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      bio: 'Specialist in custom vector search indexing, automated agents, and API gateway pipelines.'
    }
  ];

  const milestones = [
    { year: '2024', title: 'Agency Founded', desc: 'BusinessConnect AI was launched in San Francisco with a team of 3 engineers.' },
    { year: '2025', title: 'Milestone Dashboard Launch', desc: 'Launched our proprietary real-time Client Milestone tracker, achieving 100% project visibility.' },
    { year: '2026', title: 'Expansion & Scale', desc: 'Grew client list past 150+ companies, integrating custom LLM support chatbot bots across local brands.' }
  ];

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Story & Team</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Resolving transparency bottlenecks in digital development by engineering open collaboration.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Crafting Code With Radical Transparency</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We founded BusinessConnect AI after realizing that clients are often left in the dark during the web development process. Traditional agencies deliver files at the very end, leading to misaligned expectations.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We built an interactive, glassmorphic client portal allowing digital store owners, interior design agencies, and hospitality operators to monitor every stage of coding, review drafts, and manage invoices in one space.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary-500/10 blur-2xl pointer-events-none"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
              alt="team working"
              className="rounded-3xl shadow-xl max-w-full border border-slate-200/50 dark:border-slate-800/50 relative z-10 object-cover h-64 w-full"
            />
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <GlassCard className="p-8 bg-white/70 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-500 mb-5">
              <Target size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Our Mission</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To empower small business structures and agencies by furnishing high-converting web identities, custom automation, and providing complete collaborative clarity during implementation.
            </p>
          </GlassCard>

          <GlassCard className="p-8 bg-white/70 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-secondary-500/15 flex items-center justify-center text-secondary-500 mb-5">
              <Compass size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Our Vision</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To design the global standard for client portal engagement systems, where agency software delivery is immediate, real-time, and powered by smart AI assistant coordinators.
            </p>
          </GlassCard>
        </div>

        {/* Vertical Timeline */}
        <div className="mb-24">
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-12">Growth Timeline</h3>
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:mx-auto md:max-w-2xl">
            {milestones.map((m, idx) => (
              <div key={idx} className="mb-10 ml-6 md:ml-0 relative">
                {/* Marker circle */}
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center"></span>
                
                <div className="md:pl-10">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-500 text-xs font-bold mb-1.5">{m.year}</span>
                  <h4 className="font-bold text-sm text-slate-950 dark:text-white">{m.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meet Team Members */}
        <div>
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-12">Meet Our Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, idx) => (
              <GlassCard key={idx} className="p-6 text-center bg-white/70 dark:bg-slate-900/40">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-500/20 mb-4"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }}
                />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                <p className="text-[10px] font-semibold text-primary-500 dark:text-secondary-400 uppercase tracking-wider mt-0.5">{t.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3">{t.bio}</p>
                
                <div className="flex justify-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors" aria-label="Mail">
                    <Mail size={14} />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors" aria-label="LinkedIn">
                    <Users size={14} />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
