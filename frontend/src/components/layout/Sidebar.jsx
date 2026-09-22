import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Users, Briefcase, MessageCircle,
  Compass, Building2, Bookmark, Settings,
  TrendingUp, Hash
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import Avatar from '../ui/Avatar';
import { formatNumber } from '../../utils/helpers';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();


  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const mainNav = [
    { path: '/', icon: Home, label: 'Home Feed' },
    { path: '/network', icon: Users, label: 'My Network' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/messages', icon: MessageCircle, label: 'Messages', badge: 0 },
    { path: '/explore', icon: Compass, label: 'Discover' },
    { path: '/companies', icon: Building2, label: 'Companies' },
  ];

  const secondary = [
    { path: '/profile', icon: Bookmark, label: 'Saved Items' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0">
      <div className="sticky top-16 space-y-2 lg:h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar">
        {/* Profile mini card */}
        <div className="card p-4">
          <Link to="/profile" className="flex items-center gap-3 mb-3 group">
            <Avatar name={user?.name || 'User'} size="md" showRing />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-dark-900 dark:text-dark-100 group-hover:text-brand-500 transition-colors truncate">{user?.name}</p>
              <p className="text-xs text-dark-400 truncate">{user?.title || 'Member'}</p>
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-1 pt-2 border-t border-dark-100 dark:border-dark-700">
            <div className="text-center">
              <p className="text-sm font-bold text-dark-900 dark:text-dark-100">{formatNumber(user?.connections || 0)}</p>
              <p className="text-[10px] text-dark-400">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-dark-900 dark:text-dark-100">{formatNumber(user?.profileViews || 0)}</p>
              <p className="text-[10px] text-dark-400">Profile Views</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="card p-2">
          {mainNav.map(({ path, icon: Icon, label, badge }) => (
            <Link key={path} to={path}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`sidebar-item ${isActive(path) ? 'active' : ''}`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 flex items-center justify-center bg-rose-500 text-white text-[9px] font-bold rounded-full px-0.5">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Secondary */}
        <nav className="card p-2">
          {secondary.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path}>
              <div className={`sidebar-item ${isActive(path) ? 'active' : ''}`}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </nav>


      </div>
    </aside>
  );
};

export default Sidebar;
