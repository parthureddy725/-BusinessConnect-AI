import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import GlassCard from '../components/GlassCard';
import { User as UserIcon, Settings, FolderKanban, MessageSquare, CreditCard, Bell, LogOut, CheckCircle2, Download, Send, Plus, Briefcase, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, token, logout, updateProfile } = useAuth();
  const { showToast } = useUI();

  // Tab state: 'projects', 'messages', 'invoices', 'settings'
  const [activeTab, setActiveTab] = useState('projects');

  // Backend data states
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [loading, setLoading] = useState(false);

  // Sync state values on user fetch
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCompany(user.profile?.company || '');
      setPhone(user.profile?.phone || '');
    }
  }, [user]);

  // Fetch client data
  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const projRes = await axios.get('/projects/client');
      setProjects(projRes.data);

      const invRes = await axios.get('/invoices/client');
      setInvoices(invRes.data);

      const msgRes = await axios.get('/messages'); // Server returns messages
      // Filter client messages in client side or server-side filter. Let's filter on client email
      setMessages(msgRes.data.filter(m => m.senderEmail === user?.email));

      const notifRes = await axios.get('/notifications');
      setNotifications(notifRes.data);
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, company, phone });
      showToast('Profile credentials updated!');
    } catch (err) {
      showToast(err.message || 'Error updating profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post('/messages', {
        senderName: user.name,
        senderEmail: user.email,
        content: newMessage
      });
      setMessages(prev => [res.data, ...prev]);
      setNewMessage('');
      showToast('Support ticket sent successfully!');
    } catch (err) {
      showToast('Error sending message inquiry.', 'error');
    }
  };

  // Auth Protection Guard
  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
        <GlassCard className="p-8 max-w-sm">
          <Settings size={36} className="text-primary-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Please register or sign in using your customer account to access the dashboard.
          </p>
          <a href="/login" className="btn-primary w-full py-2.5 text-xs font-semibold">Sign In Now</a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dashboard Title Panel */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200/50 dark:border-slate-800/40">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Customer Workspace</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, {user.name}. Manage your profile and check project updates.
            </p>
          </div>
          <div className="text-[10px] px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-slate-500 font-semibold uppercase tracking-wider">
            Client ID: <span className="font-bold text-slate-800 dark:text-white">{user.id.slice(-6)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-bold text-left transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FolderKanban size={16} /> Active Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-bold text-left transition-all ${
                activeTab === 'invoices'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CreditCard size={16} /> Invoices & Bills ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-bold text-left transition-all ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <MessageSquare size={16} /> Support Tickets ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-bold text-left transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Settings size={16} /> Profile Settings
            </button>
          </div>

          {/* Right Main Content area */}
          <div className="lg:col-span-9">
            
            {/* TAB 1: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {projects.length === 0 ? (
                  <GlassCard className="p-8 text-center bg-white/70 dark:bg-slate-900/40">
                    <FolderKanban size={32} className="text-slate-400 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Active Projects</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-5">You don't have any projects registered under this email yet.</p>
                    <a href="/consultation" className="btn-primary inline-flex py-2 px-4 text-xs font-semibold">Book Consultation</a>
                  </GlassCard>
                ) : (
                  projects.map((proj) => (
                    <GlassCard key={proj._id || proj.id} className="p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 shadow-md">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Project Code: {proj._id || proj.id}</span>
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{proj.name}</h3>
                        </div>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold border border-indigo-500/10 rounded-full">
                          Stage: {proj.stage}
                        </span>
                      </div>

                      {/* Progress meter */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-slate-500">Progress Milestone</span>
                          <span className="text-gradient font-bold">{proj.progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 w-[60%]" style={{ width: `${proj.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {/* Timeline outline */}
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Milestone Progress</h4>
                          <div className="flex flex-col gap-2.5">
                            {proj.timeline?.map((step, idx) => (
                              <div key={idx} className="flex gap-2 items-center text-xs">
                                {step.completed ? (
                                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                ) : (
                                  <span className="w-3.5 h-3.5 rounded-full border border-slate-350 dark:border-slate-700 shrink-0"></span>
                                )}
                                <span className={step.completed ? 'text-slate-800 dark:text-white font-medium' : 'text-slate-400'}>{step.stage}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Documents download */}
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Shared Documents</h4>
                          {proj.documents?.length === 0 ? (
                            <p className="text-[10px] text-slate-500 italic py-2">No files uploaded yet.</p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {proj.documents?.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-100/50 dark:bg-slate-850/50 border border-slate-200/20 dark:border-slate-850/20">
                                  <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">{doc.name}</span>
                                  <a href={doc.url} target="_blank" rel="noreferrer" className="p-1 rounded bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors">
                                    <Download size={10} />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: INVOICES */}
            {activeTab === 'invoices' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {invoices.length === 0 ? (
                  <GlassCard className="p-8 text-center bg-white/70 dark:bg-slate-900/40">
                    <CreditCard size={32} className="text-slate-400 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Invoices</h3>
                    <p className="text-xs text-slate-500 mt-1">You have zero outstanding or completed invoice payments.</p>
                  </GlassCard>
                ) : (
                  invoices.map((inv) => (
                    <GlassCard key={inv._id || inv.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-850 dark:text-white">{inv.invoiceNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Issued for: <span className="font-medium text-slate-700 dark:text-slate-350">{inv.projectTitle}</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Due date: {inv.dueDate}</p>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">${inv.amount}</span>
                        <a
                          href={inv.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary px-3.5 py-2 text-[10px] font-bold shadow-sm"
                        >
                          <Download size={12} /> Download PDF
                        </a>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: SUPPORT TICKETS */}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* Send new support inquiry form */}
                <GlassCard className="p-6 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Create New Support ticket</h3>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your question about deadlines, invoice discrepancies, or new requirements..."
                      required
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                    />
                    <button type="submit" className="btn-primary px-4 py-2.5 text-xs font-bold shadow-glow-primary">
                      <Send size={12} /> Submit
                    </button>
                  </form>
                </GlassCard>

                {/* Tickets list */}
                <div className="flex flex-col gap-4">
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No previous support history.</p>
                  ) : (
                    messages.map((msg) => (
                      <GlassCard key={msg._id || msg.id} className="p-5 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span>Submitted: {new Date(msg.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 rounded uppercase ${
                            msg.read ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {msg.read ? 'Answered' : 'Pending Review'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Inquiry:</p>
                          <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">{msg.content}</p>
                        </div>
                        {msg.reply && (
                          <div className="mt-2 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">Admin Reply:</p>
                            <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed mt-1">{msg.reply}</p>
                          </div>
                        )}
                      </GlassCard>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS / PROFILE */}
            {activeTab === 'settings' && (
              <GlassCard className="p-6 md:p-8 bg-white/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 shadow-md animate-fade-in">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Manage Profile Details</h3>
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <UserIcon size={14} /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-slate-100 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Mail size={14} /> Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="px-3.5 py-2.5 bg-slate-200/50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Briefcase size={14} /> Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-slate-100 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Phone size={14} /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="px-3.5 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-primary-500 text-slate-850 dark:text-slate-100 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-xs mt-3 font-semibold shadow-glow-primary"
                  >
                    {loading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </GlassCard>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
