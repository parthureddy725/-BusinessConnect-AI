import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Search, Clock, User, Tag, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['All', 'AI Solutions', 'Branding', 'Development'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 animate-fade-in">
        {/* Header Block */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Business Intelligence Blog</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Insights on AI automation systems, brand design interfaces, and modern full-stack development structures.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Selector Tabs */}
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
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
              placeholder="Search articles or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 shadow-sm"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          /* Grid list of articles */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <GlassCard
                key={post._id || post.id}
                className="overflow-hidden bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-[420px] group"
              >
                <div className="h-44 relative bg-slate-900 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' }}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Date / ReadTime line */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-4">
                    <span className="text-[10px] text-slate-400 font-semibold">{post.author}</span>
                    <button
                      onClick={() => setActiveArticle(post)}
                      className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
                    >
                      Read Post <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative flex flex-col max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close Article"
              >
                <X size={16} />
              </button>

              {/* Cover Image */}
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-5">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' }}
                />
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-wider">
                <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 rounded-md">
                  {activeArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {activeArticle.readTime}
                </span>
                <span>•</span>
                <span>{new Date(activeArticle.createdAt).toLocaleDateString()}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 dark:text-white leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-2.5 mt-3 mb-6 pb-4 border-b border-slate-150 dark:border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">A</div>
                <span className="font-semibold text-slate-700 dark:text-slate-355">{activeArticle.author}</span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                {activeArticle.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                {activeArticle.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[9px] font-semibold flex items-center gap-1"
                  >
                    <Tag size={10} /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
