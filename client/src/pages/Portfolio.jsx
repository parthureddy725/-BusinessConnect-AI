import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Eye, Search, Layers, CheckCircle2, Star } from 'lucide-react';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // Categories list
  const categories = ['All', 'Development', 'Branding', 'AI Solutions'];

  // Portfolio items database
  const projects = [
    {
      id: 'proj1',
      name: 'E-Commerce Platform Rebrand',
      category: 'Development',
      beforeImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600', // Mock wireframe/sketch
      afterImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',  // Premium finished design
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Stripe API'],
      clientReview: 'The conversion rate soared by 35% within the first month. Radical transparency with the tracker kept us completely relaxed throughout.',
      clientName: 'Sarah Jenkins, CEO BrightPath',
      rating: 5,
      description: 'A complete redesign and migration of an outdated legacy commerce structure into a fast, responsive single page application. Integrated checkout webhooks, customer dashboards, and custom order invoice downloads.'
    },
    {
      id: 'proj2',
      name: 'Real Estate Portal & CRM',
      category: 'AI Solutions',
      beforeImage: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600', // plain spreadsheet/lists
      afterImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',  // premium modern villa
      technologies: ['Next.js', 'PostgreSQL', 'Express', 'OpenAI API', 'Cloudinary'],
      clientReview: 'Integrating the AI lead router slashed our follow-up delay from hours to less than 60 seconds. Our agents get warm, filtered leads.',
      clientName: 'Marcus Aurel, Product Lead TechSphere',
      rating: 5,
      description: 'An AI-powered house matching system that processes client budget constraints and preferences, sending instant recommendations to agents. Features automated calendar follow-ups.'
    },
    {
      id: 'proj3',
      name: 'Glassmorphic Design System',
      category: 'Branding',
      beforeImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', // plain layouts
      afterImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600',  // sleek design kit
      technologies: ['Figma', 'UI Kits', 'React Tokens', 'Tailwind Config'],
      clientReview: 'Elena Rostova set up a design blueprint that has saved our frontend engineers hundreds of hours. Consistent, beautiful, and accessible.',
      clientName: 'Diana Prince, Design director',
      rating: 5,
      description: 'A comprehensive branding guidelines system and Figma design language. Standardizes color tokens, glassmorphic filters, typing transitions, and responsive mobile-first layouts.'
    }
  ];

  // Filtering logic
  const filteredProjects = projects.filter(proj => {
    const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Portfolio</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Review our design overhauls and engineered solutions. Hover to reveal before/after transformations.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category tabs */}
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-glow-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search project or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <GlassCard
              key={proj.id}
              className="overflow-hidden bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-[420px] group"
            >
              {/* Before/After visual cover */}
              <div className="w-full h-48 relative overflow-hidden bg-slate-900 select-none">
                {/* AFTER image (default shown) */}
                <img
                  src={proj.afterImage}
                  alt="after"
                  className="w-full h-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500 absolute inset-0"
                />
                {/* BEFORE image (shown on hover) */}
                <img
                  src={proj.beforeImage}
                  alt="before"
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
                />

                {/* Overlay indicators */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {proj.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-primary-600/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider group-hover:bg-amber-600/90 transition-colors">
                  <span className="group-hover:hidden">Finished Product</span>
                  <span className="hidden group-hover:inline">Initial Wireframe</span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {proj.name}
                  </h3>
                  
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {proj.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[9px]"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[9px]">
                        +{proj.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed line-clamp-2">
                    "{proj.clientReview}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-4">
                  <span className="text-[10px] text-slate-400 font-semibold">{proj.clientName.split(',')[0]}</span>
                  <button
                    onClick={() => setActiveProjectModal(proj)}
                    className="p-2 bg-slate-100 hover:bg-primary-500 hover:text-white dark:bg-slate-850 dark:hover:bg-primary-600 text-slate-600 dark:text-slate-300 rounded-xl transition-all flex items-center justify-center"
                    aria-label="View Details"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Project Details Modal */}
        {activeProjectModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary-500 tracking-wider">
                    {activeProjectModal.category} Project
                  </span>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mt-1">
                    {activeProjectModal.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Eye className="rotate-45" size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Before & After</h4>
                  <div className="grid grid-cols-2 gap-2 h-32">
                    <div className="rounded-xl overflow-hidden bg-slate-100">
                      <img src={activeProjectModal.beforeImage} alt="before" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-xl overflow-hidden bg-slate-100">
                      <img src={activeProjectModal.afterImage} alt="after" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overview</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeProjectModal.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProjectModal.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary-500/10 text-primary-500 rounded text-[9px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Review Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
                <div className="flex gap-1.5 text-amber-400 mb-2">
                  {[...Array(activeProjectModal.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-xs italic text-slate-700 dark:text-slate-300">
                  "{activeProjectModal.clientReview}"
                </p>
                <p className="text-[10px] text-slate-500 mt-2 font-bold text-right">
                  — {activeProjectModal.clientName}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Portfolio;
