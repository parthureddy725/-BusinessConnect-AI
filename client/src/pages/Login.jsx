import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import GlassCard from '../components/GlassCard';
import { Mail, Lock, User, Briefcase, Phone, ArrowRight, Shield } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const { login, register } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [isReset, setIsReset] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        // Forgot password flow
        const res = await axios.post('/auth/forgot-password', { email });
        showToast('Password reset link sent to your email.');
        // Auto supply token for demo presentation
        if (res.data.resetToken) {
          setResetToken(res.data.resetToken);
          setIsForgot(false);
          setIsReset(true);
        }
      } else if (isReset) {
        // Reset password flow
        await axios.post('/auth/reset-password', { token: resetToken, password: newPassword });
        showToast('Password updated! You can now sign in.');
        setIsReset(false);
        setIsLogin(true);
      } else if (isLogin) {
        // Login flow
        const user = await login(email, password);
        showToast(`Welcome back, ${user.name}!`);
        
        // Redirect based on role or search redirect params
        const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath);
      } else {
        // Register flow
        const user = await register(name, email, password, company, phone);
        showToast('Account registered successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred during authentication.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (role) => {
    if (role === 'admin') {
      setEmail('admin@businessconnect.ai');
      setPassword('admin123');
    } else {
      setEmail('client@businessconnect.ai');
      setPassword('client123');
    }
    setIsLogin(true);
    setIsForgot(false);
    setIsReset(false);
  };

  return (
    <div className="min-h-screen relative z-10 pt-28 pb-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 items-center justify-center text-white shadow-glow-primary mb-3">
            <span className="font-extrabold text-2xl">B</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isForgot ? 'Recover Password' : isReset ? 'Set New Password' : isLogin ? 'Welcome Back' : 'Create Customer Account'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {isForgot
              ? 'Enter email to receive reset token credentials'
              : isReset
              ? 'Enter a secure new password code'
              : isLogin
              ? 'Manage services and track project milestones'
              : 'Sign up to request services and download invoices'}
          </p>
        </div>

        <GlassCard className="p-8 shadow-2xl relative border-slate-200/50 dark:border-slate-800/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Fields (Sign Up only) */}
            {!isLogin && !isForgot && !isReset && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* Email Field (All except Reset) */}
            {!isReset && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* Phone & Company (Sign Up only) */}
            {!isLogin && !isForgot && !isReset && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Company Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 012-3456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Field (Login & Sign Up only) */}
            {(isLogin || (!isLogin && !isForgot && !isReset)) && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => { setIsForgot(true); setIsLogin(false); }}
                      className="text-xs text-primary-500 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* New Password (Reset Mode only) */}
            {isReset && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold mt-2"
            >
              {loading ? 'Processing...' : isForgot ? 'Send Reset Instructions' : isReset ? 'Save New Password' : isLogin ? 'Sign In' : 'Sign Up'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
            {isForgot || isReset ? (
              <button
                onClick={() => { setIsForgot(false); setIsReset(false); setIsLogin(true); }}
                className="text-primary-500 font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            ) : isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-primary-500 font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-primary-500 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Seed Quick Login Panel */}
          <div className="mt-6 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-700/30 flex flex-col gap-2.5">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Quick Login (Demo accounts)</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCreds('client')}
                className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
              >
                <User size={12} /> Client Account
              </button>
              <button
                type="button"
                onClick={() => fillDemoCreds('admin')}
                className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-semibold text-primary-600 dark:text-secondary-400 flex items-center justify-center gap-1.5"
              >
                <Shield size={12} /> Admin Account
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
