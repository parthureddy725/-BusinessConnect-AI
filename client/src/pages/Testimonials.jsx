import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Star, MessageSquare, Play, X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Testimonials = () => {
  const { showToast } = useUI();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [clientName, setClientName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Video reviews mock list
  const videoReviews = [
    {
      id: 'vid1',
      clientName: 'Alexander Hayes',
      role: 'Founding Partner, Hayes Law Firm',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
      duration: '1:45',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // dummy video
    },
    {
      id: 'vid2',
      clientName: 'Christina Vance',
      role: 'Operations Director, CozyStay Hotels',
      thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400',
      duration: '2:12',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/testimonials');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const payload = { clientName, role, rating, content, videoUrl };
      await axios.post('/testimonials', payload);
      showToast('Thank you! Your testimonial has been posted.');
      
      // Clear forms
      setClientName('');
      setRole('');
      setRating(5);
      setContent('');
      setVideoUrl('');
      setShowForm(false);
      
      // Reload
      fetchReviews();
    } catch (err) {
      showToast('Error submitting review.', 'error');
    }
  };

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-slate-200/50 dark:border-slate-800/40 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Customer Reviews</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
              Read verified testimonials or inspect video presentations of completed client products.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary self-start md:self-auto py-2.5 px-4 text-xs font-semibold"
          >
            <PlusCircle size={16} /> Submit Feedback
          </button>
        </div>

        {/* Written Review Submission Box */}
        {showForm && (
          <GlassCard className="p-6 md:p-8 mb-12 bg-white/70 dark:bg-slate-900/40 border border-slate-250 dark:border-slate-800 animate-fade-in max-w-xl mx-auto">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Share Your Experience</h3>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Role / Company</label>
                  <input
                    type="text"
                    placeholder="CEO, Acme Corp"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rating (1-5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Demo Video Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Review Content</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white resize-none"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold">
                Submit testimonial
              </button>
            </form>
          </GlassCard>
        )}

        {/* Video Testimonials Showcase (Premium visual players) */}
        <div className="mb-20">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Video Case Studies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {videoReviews.map((vid) => (
              <GlassCard
                key={vid.id}
                className="overflow-hidden bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-72 group cursor-pointer"
                onClick={() => setActiveVideoModal(vid)}
              >
                <div className="h-44 relative bg-slate-900">
                  <img src={vid.thumbnail} alt={vid.clientName} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-lg group-hover:bg-primary-500 group-hover:scale-110 transition-all">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/70 text-white text-[9px] rounded font-bold">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{vid.clientName}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{vid.role}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Written Review Cards */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Client Case Reviews</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev) => (
                <GlassCard key={rev._id || rev.id} className="p-6 bg-white/70 dark:bg-slate-900/40 flex flex-col justify-between h-64 border-slate-200/50 dark:border-slate-800/50">
                  <div>
                    <div className="flex gap-0.5 text-amber-400 mb-3.5">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 italic leading-relaxed line-clamp-4">"{rev.content}"</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={rev.image}
                      alt={rev.clientName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200/50"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=50' }}
                    />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">{rev.clientName}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">{rev.role}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Video Player Modal popup */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-850 p-4 shadow-2xl relative">
              <button
                onClick={() => setActiveVideoModal(null)}
                className="absolute -top-10 right-0 p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close Player"
              >
                <X size={16} />
              </button>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                <iframe
                  title="Client Review"
                  className="w-full h-full"
                  src={activeVideoModal.embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 text-white">
                <h4 className="text-xs font-bold">{activeVideoModal.clientName}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{activeVideoModal.role}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Testimonials;
