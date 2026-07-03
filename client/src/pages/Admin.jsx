import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import GlassCard from '../components/GlassCard';
import { ShieldAlert, BarChart3, Users, Briefcase, Calendar, MessageSquare, CreditCard, Plus, Check, X, FileText, Send, Trash2 } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const { user, token } = useAuth();
  const { showToast } = useUI();

  // Active section tab: 'analytics', 'appointments', 'projects', 'invoices', 'messages', 'services', 'blogs'
  const [activeTab, setActiveTab] = useState('analytics');

  // Backend States
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Seeding forms
  const [newProject, setNewProject] = useState({ name: '', clientEmail: '', description: '', estimatedCompletion: '' });
  const [newInvoice, setNewInvoice] = useState({ clientEmail: '', projectTitle: '', amount: '', dueDate: '', projectId: '' });
  const [newService, setNewService] = useState({ name: '', description: '', features: '', pricing: '', image: '', category: 'Development' });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'Development', author: '', image: '', tags: '' });
  
  // Modifying states
  const [replyMessageId, setReplyMessageId] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [updateProjId, setUpdateProjId] = useState('');
  const [updateProjProgress, setUpdateProjProgress] = useState(0);
  const [updateProjStage, setUpdateProjStage] = useState('Planning');

  // Fetch admin logs
  const fetchAdminData = async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      const analyticRes = await axios.get('/analytics');
      setAnalytics(analyticRes.data);

      const apptRes = await axios.get('/appointments');
      setAppointments(apptRes.data);

      const projRes = await axios.get('/projects');
      setProjects(projRes.data);

      const msgRes = await axios.get('/messages');
      setMessages(msgRes.data);

      const invRes = await axios.get('/invoices');
      setInvoices(invRes.data);

      const srvRes = await axios.get('/services');
      setServices(srvRes.data);

      const blogRes = await axios.get('/blogs');
      setBlogs(blogRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, user]);

  // Appointment decision
  const handleAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      showToast(`Appointment status updated to: ${status}`);
    } catch (err) {
      showToast('Error updating status.', 'error');
    }
  };

  // Create project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/projects', newProject);
      showToast('New client project created successfully!');
      setNewProject({ name: '', clientEmail: '', description: '', estimatedCompletion: '' });
      fetchAdminData();
    } catch (err) {
      showToast('Error setting up project.', 'error');
    }
  };

  // Update project progress
  const handleUpdateProjectProgress = async (e) => {
    e.preventDefault();
    if (!updateProjId) return;
    try {
      await axios.put(`/projects/${updateProjId}`, {
        progress: Number(updateProjProgress),
        stage: updateProjStage
      });
      showToast('Project progress stage saved!');
      setUpdateProjId('');
      fetchAdminData();
    } catch (err) {
      showToast('Error updating project.', 'error');
    }
  };

  // Issue invoice
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/invoices', newInvoice);
      showToast('Client invoice generated and notified!');
      setNewInvoice({ clientEmail: '', projectTitle: '', amount: '', dueDate: '', projectId: '' });
      fetchAdminData();
    } catch (err) {
      showToast('Error issuing invoice.', 'error');
    }
  };

  // Reply message
  const handleReplyMessage = async (e) => {
    e.preventDefault();
    if (!replyMessageId || !replyContent.trim()) return;
    try {
      await axios.post(`/messages/${replyMessageId}/reply`, { reply: replyContent });
      showToast('Response sent to client dashboard!');
      setReplyMessageId('');
      setReplyContent('');
      fetchAdminData();
    } catch (err) {
      showToast('Error replying to support ticket.', 'error');
    }
  };

  // Add Service
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/services', {
        ...newService,
        features: newService.features.split(',').map(f => f.trim())
      });
      showToast('Service listed successfully!');
      setNewService({ name: '', description: '', features: '', pricing: '', image: '', category: 'Development' });
      fetchAdminData();
    } catch (err) {
      showToast('Error saving service.', 'error');
    }
  };

  // Add Blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/blogs', {
        ...newBlog,
        tags: newBlog.tags.split(',').map(t => t.trim())
      });
      showToast('Blog article published!');
      setNewBlog({ title: '', content: '', category: 'Development', author: '', image: '', tags: '' });
      fetchAdminData();
    } catch (err) {
      showToast('Error saving article.', 'error');
    }
  };

  // Auth Guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
        <GlassCard className="p-8 max-w-sm border-rose-500/30">
          <ShieldAlert size={36} className="text-rose-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Administrator credentials are required to enter the platform backend panel.
          </p>
          <a href="/login" className="btn-primary w-full py-2.5 text-xs font-semibold">Sign In as Admin</a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200/50 dark:border-slate-800/40">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Platform Backend Panel
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Oversee metrics, schedule appointments, map projects, and manage dynamic collections.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200/30 dark:border-slate-800/40 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Metrics Analytics', icon: <BarChart3 size={14} /> },
            { id: 'appointments', label: 'Appointments', icon: <Calendar size={14} /> },
            { id: 'projects', label: 'Projects', icon: <Briefcase size={14} /> },
            { id: 'invoices', label: 'Invoices', icon: <CreditCard size={14} /> },
            { id: 'messages', label: 'Support Tickets', icon: <MessageSquare size={14} /> },
            { id: 'services', label: 'Manage Services', icon: <Plus size={14} /> },
            { id: 'blogs', label: 'Manage Blogs', icon: <FileText size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); }}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-glow-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && analytics && (
            <div className="flex flex-col gap-8 animate-fade-in">
              {/* Metric grids */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Total Clients', value: analytics.metrics.totalUsers, desc: 'Registered customers', icon: <Users size={16} /> },
                  { title: 'Active Projects', value: analytics.metrics.activeProjects, desc: 'Milestones unfinished', icon: <Briefcase size={16} /> },
                  { title: 'Total Revenue', value: `$${analytics.metrics.revenue}`, desc: `Growth rate: ${analytics.metrics.monthlyGrowth}`, icon: <CreditCard size={16} /> },
                  { title: 'Satisfaction Rating', value: `${analytics.metrics.customerSatisfaction}/5`, desc: 'Based on testimonials', icon: <Calendar size={16} /> }
                ].map((m, idx) => (
                  <GlassCard key={idx} className="p-4 bg-white/70 dark:bg-slate-900/40 border-slate-200/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{m.title}</span>
                      <div className="text-primary-500">{m.icon}</div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{m.value}</p>
                    <p className="text-[9px] text-slate-450 mt-1">{m.desc}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Progress and lists details */}
              <GlassCard className="p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Project Stages Overview</h3>
                <div className="flex flex-col gap-3">
                  {analytics.charts.projectCompletionStats?.map((s, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500">{s.name} Stage</span>
                        <span className="text-slate-800 dark:text-white">{s.count} Projects</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500"
                          style={{ width: `${analytics.metrics.totalProjects > 0 ? (s.count / analytics.metrics.totalProjects) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 2: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-10">No consultation bookings registered.</p>
              ) : (
                appointments.map((appt) => (
                  <GlassCard key={appt._id || appt.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-slate-900/40 border-slate-200/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{appt.clientName}</h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          appt.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : appt.status === 'declined' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Email: {appt.clientEmail} | Budget: {appt.budget}</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Proposed Call Date: {appt.date} at {appt.timeSlot}</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-slate-100/50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <strong>Requirements:</strong> {appt.requirements}
                      </p>
                    </div>

                    {appt.status === 'pending' && (
                      <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => handleAppointmentStatus(appt._id || appt.id, 'approved')}
                          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center"
                          aria-label="Approve Call"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleAppointmentStatus(appt._id || appt.id, 'declined')}
                          className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center justify-center"
                          aria-label="Decline Call"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </GlassCard>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Form creation */}
              <GlassCard className="lg:col-span-4 p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Register New Project</h3>
                <form onSubmit={handleCreateProject} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="E-Commerce Rebrand"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Client Email</label>
                    <input
                      type="email"
                      required
                      placeholder="client@company.com"
                      value={newProject.clientEmail}
                      onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Description</label>
                    <textarea
                      placeholder="Write description scope details..."
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white resize-none"
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Completion Estimate</label>
                    <input
                      type="text"
                      placeholder="e.g. August 15, 2026"
                      value={newProject.estimatedCompletion}
                      onChange={(e) => setNewProject({ ...newProject, estimatedCompletion: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold mt-2 shadow-glow-primary">
                    Create Project
                  </button>
                </form>
              </GlassCard>

              {/* Projects update listing */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Progress quick-update form overlays */}
                {updateProjId && (
                  <GlassCard className="p-5 border-amber-500/20 bg-amber-500/5 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Update Development Stage & Completion %</h4>
                    <form onSubmit={handleUpdateProjectProgress} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-450">Active Stage</label>
                        <select
                          value={updateProjStage}
                          onChange={(e) => setUpdateProjStage(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-xs text-slate-800 dark:text-white"
                        >
                          {['Planning', 'Design', 'Development', 'Testing', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-450">Completion %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={updateProjProgress}
                          onChange={(e) => setUpdateProjProgress(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-xs text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="btn-primary flex-1 py-2 text-xs font-bold shadow-sm">Save</button>
                        <button type="button" onClick={() => setUpdateProjId('')} className="btn-secondary flex-1 py-2 text-xs font-bold">Cancel</button>
                      </div>
                    </form>
                  </GlassCard>
                )}

                {projects.map((proj) => (
                  <GlassCard key={proj._id || proj.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-slate-900/40 border-slate-200/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{proj.name}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px]">Stage: {proj.stage} ({proj.progress}%)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Client: {proj.clientEmail} | Code: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded select-all font-bold text-primary-500">{proj._id || proj.id}</code></p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Est completion: {proj.estimatedCompletion}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUpdateProjId(proj._id || proj.id);
                        setUpdateProjProgress(proj.progress);
                        setUpdateProjStage(proj.stage);
                      }}
                      className="btn-secondary px-3.5 py-1.5 text-[10px] font-bold"
                    >
                      Update Stage
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Form creation */}
              <GlassCard className="lg:col-span-4 p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Issue Client Invoice</h3>
                <form onSubmit={handleCreateInvoice} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Client Email</label>
                    <input
                      type="email"
                      required
                      placeholder="client@company.com"
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({ ...newInvoice, clientEmail: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="E-Commerce Rebrand - Launch Fee"
                      value={newInvoice.projectTitle}
                      onChange={(e) => setNewInvoice({ ...newInvoice, projectTitle: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-455">Amount ($)</label>
                      <input
                        type="number"
                        required
                        placeholder="1500"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                        className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-455">Due Date</label>
                      <input
                        type="date"
                        required
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                        className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Link to Project (Optional)</label>
                    <select
                      value={newInvoice.projectId}
                      onChange={(e) => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white cursor-pointer"
                    >
                      <option value="">No Project Link</option>
                      {projects.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold mt-2 shadow-glow-primary">
                    Generate Invoice
                  </button>
                </form>
              </GlassCard>

              {/* Invoices List */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {invoices.map((inv) => (
                  <GlassCard key={inv._id || inv.id} className="p-4 flex justify-between items-center bg-white/70 dark:bg-slate-900/40 border-slate-200/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-white">{inv.invoiceNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Client: {inv.clientEmail} | Project: {inv.projectTitle}</p>
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">${inv.amount}</span>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT TICKETS */}
          {activeTab === 'messages' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Ticket reply overlays */}
              {replyMessageId && (
                <GlassCard className="p-5 border-primary-500/20 bg-primary-500/5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Compose Response Ticket</h4>
                  <form onSubmit={handleReplyMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write message reply answers..."
                      required
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-xs text-slate-800 dark:text-white"
                    />
                    <button type="submit" className="btn-primary px-4 py-2 text-xs font-bold shadow-sm">Send</button>
                    <button type="button" onClick={() => setReplyMessageId('')} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </form>
                </GlassCard>
              )}

              {messages.map((msg) => (
                <GlassCard key={msg._id || msg.id} className="p-5 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span>Sender: {msg.senderName} ({msg.senderEmail})</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      msg.read ? 'bg-slate-100 text-slate-400' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {msg.read ? 'Answered' : 'Unopened'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-750 dark:text-slate-300">{msg.content}</p>
                  
                  {msg.reply ? (
                    <div className="p-2.5 rounded-xl bg-primary-500/5 text-xs text-slate-600 dark:text-slate-400 border border-primary-500/5 mt-1">
                      <strong>Answer:</strong> {msg.reply}
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyMessageId(msg._id || msg.id)}
                      className="btn-secondary self-start px-3 py-1.5 text-[9px] font-bold flex items-center gap-1.5"
                    >
                      <Send size={10} /> Reply to ticket
                    </button>
                  )}
                </GlassCard>
              ))}
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              <GlassCard className="lg:col-span-4 p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">List New Service</h3>
                <form onSubmit={handleCreateService} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Service Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SEO optimization"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Pricing Plan</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Starting at $999"
                      value={newService.pricing}
                      onChange={(e) => setNewService({ ...newService, pricing: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Features (Comma separated)</label>
                    <input
                      type="text"
                      required
                      placeholder="Feature 1, Feature 2, Feature 3"
                      value={newService.features}
                      onChange={(e) => setNewService({ ...newService, features: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Category</label>
                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white cursor-pointer"
                    >
                      {['Development', 'Branding', 'AI Solutions', 'SEO Services'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newService.image}
                      onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Description</label>
                    <textarea
                      required
                      placeholder="Write service details..."
                      rows={3}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold mt-2 shadow-glow-primary">
                    Save Service
                  </button>
                </form>
              </GlassCard>

              {/* Service List items */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <GlassCard key={srv._id || srv.id} className="p-4 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 flex flex-col justify-between h-48">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{srv.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-3">{srv.description}</p>
                    </div>
                    <span className="font-bold text-[10px] text-primary-500 mt-2 block">{srv.pricing}</span>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: BLOGS */}
          {activeTab === 'blogs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              <GlassCard className="lg:col-span-4 p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Publish Blog Post</h3>
                <form onSubmit={handleCreateBlog} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Article Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Scaling AI Support systems"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-450">Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white cursor-pointer"
                    >
                      {['Development', 'Branding', 'AI Solutions'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Author</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead designer"
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Design, Figma, Tokens"
                      value={newBlog.tags}
                      onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Cover Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newBlog.image}
                      onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-455">Article Content</label>
                    <textarea
                      required
                      placeholder="Write article details..."
                      rows={4}
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="px-3 py-2.5 bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-white resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-xs font-semibold mt-2 shadow-glow-primary">
                    Publish Article
                  </button>
                </form>
              </GlassCard>

              {/* Articles lists */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {blogs.map((post) => (
                  <GlassCard key={post._id || post.id} className="p-4 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 flex flex-col justify-between h-40">
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[300px]">{post.title}</h4>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold uppercase">{post.category}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">{post.content}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Admin;
