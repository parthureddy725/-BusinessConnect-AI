import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUI } from '../context/UIContext';
import { Menu, X, Sun, Moon, Bell, User, LogOut, LayoutDashboard, Shield, Layers } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef();
  const profileRef = useRef();

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Reviews', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
    { name: 'Track', path: '/tracker' }
  ];

  // Fetch client notifications if logged in
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // refresh every 20s
    return () => clearInterval(interval);
  }, [token]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
      showToast('Notifications cleared');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/40 shadow-lg px-5 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-glow-primary">
            <span className="font-extrabold text-xl">B</span>
          </div>
          <span className="font-bold text-lg tracking-wide hidden sm:block">
            BusinessConnect <span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-secondary-400 bg-primary-50/50 dark:bg-slate-800/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-secondary-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logged In Controls */}
          {user ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                      <span className="font-semibold text-sm">Notifications</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">No new updates.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleMarkAsRead(notif._id)}
                            className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                              notif.read
                                ? 'bg-transparent text-slate-400'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <p className="text-xs font-semibold">{notif.title}</p>
                            <p className="text-[11px] mt-0.5 leading-relaxed">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-700/30 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={user.profile?.avatar || '/images/avatar-placeholder.png'}
                    alt="profile"
                    className="w-7 h-7 rounded-lg object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50' }}
                  />
                  <span className="text-xs font-semibold pr-1.5 hidden md:inline">{user.name.split(' ')[0]}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard size={14} /> Client Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-primary-600 dark:text-secondary-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                      >
                        <Shield size={14} /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary px-4 py-2 text-xs"
            >
              Sign In
            </Link>
          )}

          {/* Book Consultation CTA */}
          <Link
            to="/consultation"
            className="hidden md:flex btn-secondary px-4 py-2 text-xs"
          >
            Book Demo
          </Link>

          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/consultation"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center py-2.5 text-xs"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
