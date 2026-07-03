import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Search, FolderOpen, ArrowRight, Download, CheckCircle2, Circle, AlertCircle, FileText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Tracker = () => {
  const { showToast } = useUI();
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!email || !projectId) return;
    setLoading(true);

    try {
      const res = await axios.post('/projects/track', { email, projectId });
      setProject(res.data);
      showToast('Project details retrieved!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error tracking project. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get stage background style
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Planning': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      case 'Design': return 'text-violet-500 bg-violet-500/10 border-violet-500/20';
      case 'Development': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'Testing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {!project ? (
          /* Initial Search Form */
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 items-center justify-center text-white shadow-glow-primary mb-3">
                <FolderOpen size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Project Milestone Tracker</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Enter your project identification credentials below to inspect live development progress.
              </p>
            </div>

            <GlassCard className="p-6 md:p-8 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
              <form onSubmit={handleTrack} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Client Email</label>
                  <input
                    type="email"
                    placeholder="client@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Project Reference ID</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="e.g. 65fcd8193a02..."
                      required
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-xs mt-2"
                >
                  {loading ? 'Retrieving project records...' : 'Track Milestones'}
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Tips block */}
              <div className="mt-5 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10 text-[10px] text-primary-600 dark:text-primary-400 flex gap-2 items-start leading-relaxed">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>
                  Tip: Log in to your <strong>Client Dashboard</strong> to track all projects automatically without needing to type project reference codes. Or copy the seeded project ID from the console/database. (Demo project ID is auto-seeded: look up yours under Client Dashboard or test with the admin console).
                </span>
              </div>
            </GlassCard>
          </div>
        ) : (
          /* Live Progress Tracking View */
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Top Back Nav & title bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setProject(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-xl text-[10px] text-slate-500 hover:text-slate-800 font-bold transition-colors"
              >
                ← Back
              </button>
              <div className={`px-3 py-1 rounded-full border text-[10px] font-bold ${getStageColor(project.stage)}`}>
                Stage: {project.stage}
              </div>
            </div>

            {/* Core Project Details glass card */}
            <GlassCard className="p-6 md:p-8 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Project Milestones Dashboard</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{project.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{project.description}</p>
              </div>

              {/* Progress Bar metric */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Total Completion</span>
                  <span className="text-gradient font-bold">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-700/30">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full transition-all duration-700"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-150 dark:border-slate-800">
                <div className="text-xs">
                  <span className="text-slate-400 text-[10px] block">Client email</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">{project.clientEmail}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 text-[10px] block">Estimated completion date</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">{project.estimatedCompletion || 'TBD'}</span>
                </div>
              </div>
            </GlassCard>

            {/* Timeline & Downloads row grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timeline status track */}
              <GlassCard className="p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Execution Milestones</h3>
                <div className="flex flex-col gap-4">
                  {project.timeline?.map((step, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <div className="mt-0.5 shrink-0">
                        {step.completed ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <Circle size={16} className="text-slate-300 dark:text-slate-700" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${step.completed ? 'text-slate-850 dark:text-white' : 'text-slate-400'}`}>
                          {step.stage}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {step.completed ? `Completed on: ${step.date || 'Passed'}` : 'Pending execution'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Downloads & Invoices links */}
              <div className="flex flex-col gap-6">
                {/* Documents downloads list */}
                <GlassCard className="p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 flex-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Project Documents</h3>
                  {project.documents?.length === 0 ? (
                    <p className="text-[11px] text-slate-500 py-4">No agreement documents shared yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {project.documents?.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-100/50 dark:bg-slate-850/50 border border-slate-200/25 dark:border-slate-750/30 rounded-xl">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-primary-500" />
                            <span className="text-[11px] text-slate-700 dark:text-slate-350 font-medium truncate max-w-[150px]">{doc.name}</span>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors shadow-sm"
                            aria-label="Download Document"
                          >
                            <Download size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* Linked invoices */}
                <GlassCard className="p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 flex-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Project Invoices</h3>
                  {project.invoices?.length === 0 ? (
                    <p className="text-[11px] text-slate-500 py-4">No invoices mapped yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {project.invoices?.map((invCode, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-100/50 dark:bg-slate-850/50 border border-slate-200/25 dark:border-slate-750/30 rounded-xl text-xs font-semibold">
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{invCode}</span>
                          <span className="text-[10px] text-slate-400">See Client Dashboard to download</span>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tracker;
