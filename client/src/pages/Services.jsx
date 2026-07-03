import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { Code, Smartphone, BarChart, Award, Palette, Search, Cpu, Cloud, Check, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookService = (serviceName) => {
    // Navigate to booking page and pass preselected service name in state
    navigate('/consultation', { state: { preSelectedService: serviceName } });
  };

  // Helper icon map based on service name key matches
  const getIcon = (name) => {
    const key = name.toLowerCase();
    if (key.includes('web') || key.includes('site')) return <Code size={24} />;
    if (key.includes('mobile') || key.includes('app')) return <Smartphone size={24} />;
    if (key.includes('marketing')) return <BarChart size={24} />;
    if (key.includes('branding') || key.includes('brand')) return <Award size={24} />;
    if (key.includes('ui') || key.includes('ux') || key.includes('design')) return <Palette size={24} />;
    if (key.includes('seo')) return <Search size={24} />;
    if (key.includes('ai') || key.includes('automation')) return <Cpu size={24} />;
    if (key.includes('cloud')) return <Cloud size={24} />;
    return <Code size={24} />;
  };

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Digital Solutions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Choose from a comprehensive list of premium engineering, design, and intelligence systems.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv) => (
              <GlassCard key={srv._id || srv.id} className="overflow-hidden bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all flex flex-col md:flex-row h-auto md:h-80">
                {/* Left image column */}
                <div className="w-full md:w-2/5 relative shrink-0 min-h-[160px] md:min-h-0 bg-slate-900">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-black/30 pointer-events-none"></div>
                </div>

                {/* Right content column */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="text-primary-500 dark:text-secondary-400">
                        {getIcon(srv.name)}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white">{srv.name}</h3>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {srv.description}
                    </p>

                    {/* Features list */}
                    <div className="flex flex-col gap-1.5 mb-4">
                      {srv.features?.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Investment</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{srv.pricing}</p>
                    </div>
                    <button
                      onClick={() => handleBookService(srv.name)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-bold shadow-glow-primary transition-colors flex items-center gap-1 active:scale-95 transform"
                    >
                      Book Service <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
