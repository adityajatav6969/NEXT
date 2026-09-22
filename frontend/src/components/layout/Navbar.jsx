import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Briefcase, MessageCircle, Search,
  Sun, Moon, Command, ChevronDown, LogOut, User, Settings,
  Zap, X, Compass, Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUI } from '../../context/UIContext';
import { useMockData } from '../../context/MockDataContext';
import Avatar from '../ui/Avatar';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { toggleCommandPalette } = useUI();
  const { unreadMessages } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile search when route changes
  useEffect(() => {
    setMobileSearchOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/network', icon: Users, label: 'Network' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadMessages },
    { path: '/explore', icon: Compass, label: 'Explore' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 dark:bg-dark-900/98 backdrop-blur-xl border-b border-dark-200 dark:border-dark-700/50 shadow-sm">
      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text hidden sm:block">NextDevs</span>
        </Link>

        {/* Desktop Search */}
        <div className="relative hidden md:block flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search NextDevs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-dark-100 dark:bg-dark-800 border border-transparent dark:border-dark-700 rounded-lg text-dark-900 dark:text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />
          <AnimatePresence>
            {searchOpen && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl shadow-dark overflow-hidden z-50"
              >
                <div className="p-3 text-sm text-dark-400">Searching for "{searchQuery}"...</div>
                <div className="border-t border-dark-100 dark:border-dark-700 p-1">
                  {['People', 'Posts', 'Jobs', 'Companies'].map((cat) => (
                    <button
                      key={cat}
                      className="w-full text-left px-3 py-2 text-sm text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                      onClick={() => navigate(cat === 'People' ? '/explore' : `/${cat.toLowerCase()}`)}
                    >
                      Search {cat} for "{searchQuery}"
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Nav Items — pushed to center */}
        <div className="hidden md:flex items-center gap-0.5 ml-auto">
          {navItems.slice(0, 5).map(({ path, icon: Icon, label, badge }) => (
            <Link key={path} to={path}>
              <div className={`nav-item ${isActive(path) ? 'active' : ''}`}>
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full px-1">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px]">{label}</span>
                {isActive(path) && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto md:ml-2">
          {/* Mobile Search button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Command Palette — desktop only */}
          <button
            onClick={toggleCommandPalette}
            className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors text-xs"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="text-dark-300">K</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-4 h-4 text-amber-500" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-4 h-4 text-brand-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
            >
              <Avatar name={user?.name || 'Guest User'} size="sm" showRing />
              <ChevronDown className={`w-3 h-3 text-dark-400 hidden sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl shadow-dark overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-dark-100 dark:border-dark-700 flex items-center gap-3">
                    <Avatar name={user?.name || 'Guest User'} size="md" showRing />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-dark-900 dark:text-dark-100 truncate">{user?.name}</p>
                      <p className="text-xs text-dark-400 truncate">{user?.title || 'Member'}</p>
                    </div>
                  </div>
                  <div className="p-1">
                    {[
                      { icon: User, label: 'View Profile', path: '/profile' },
                      { icon: Settings, label: 'Settings', path: '/settings' },
                    ].map(({ icon: Icon, label, path }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors group"
                      >
                        <Icon className="w-4 h-4 text-dark-400 group-hover:text-brand-500 transition-colors" />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-dark-100 dark:border-dark-700 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile expandable search bar ── */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-dark-100 dark:border-dark-700/50"
          >
            <div className="px-3 py-2 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="Search NextDevs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-dark-100 dark:bg-dark-800 border border-transparent dark:border-dark-700 rounded-xl text-dark-900 dark:text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile bottom nav bar ── */}
      <div className="flex md:hidden items-center justify-around border-t border-dark-100 dark:border-dark-800 bg-white/98 dark:bg-dark-900/98">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <Link key={path} to={path} className="flex-1">
            <div className={`flex flex-col items-center gap-0.5 py-2 px-1 text-dark-500 dark:text-dark-400 transition-colors duration-200 ${isActive(path) ? 'text-brand-600 dark:text-brand-400' : 'hover:text-brand-500'}`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] flex items-center justify-center bg-rose-500 text-white text-[9px] font-bold rounded-full px-0.5 leading-none">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium leading-none">{label}</span>
              {isActive(path) && (
                <motion.div layoutId="mobile-nav-indicator" className="absolute bottom-0 w-8 h-0.5 bg-brand-500 rounded-full" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
