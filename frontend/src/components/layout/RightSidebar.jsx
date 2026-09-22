import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatNumber } from '../../utils/helpers';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const RightSidebar = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/network');
        setFollowingUsers((data.following || []).map(u => ({ ...u, isFollowing: true })).slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch following users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const { data } = await api.post(`/users/${userId}/follow`);
      setFollowingUsers(prev => prev.map(u => {
        if (u._id === userId) {
          return { ...u, isFollowing: data.isFollowing, followersCount: data.followersCount };
        }
        return u;
      }));
    } catch (error) {
      console.error('Failed to follow user', error);
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-64 flex-shrink-0">
      <div className="sticky top-16 space-y-4">
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

        {/* Following List */}
        {followingUsers.length > 0 && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Following</h3>
              <Link to="/network" className="text-xs text-brand-500 hover:text-brand-600 font-medium">See all</Link>
            </div>
            <div className="space-y-3">
              {followingUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-800 dark:text-dark-200 truncate">{u.name}</p>
                    <p className="text-xs text-dark-400 truncate">{u.title}</p>
                    <p className="text-xs text-dark-300">{formatNumber(u.followersCount || u.followers?.length || 0)} followers</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFollow(u._id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded-full transition-all ${
                      u.isFollowing
                        ? 'border-dark-300 text-dark-500 bg-dark-50 hover:bg-dark-100 dark:border-dark-600 dark:text-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700'
                        : 'border-brand-500/50 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                    }`}
                  >
                    {u.isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                    {u.isFollowing ? 'Following' : 'Follow'}
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {['About', 'Privacy', 'Terms', 'Help'].map(t => (
              <a key={t} href="#" className="text-[11px] text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 transition-colors">{t}</a>
            ))}
          </div>
          <p className="text-[11px] text-dark-300 mt-2">NextDevs © 2026</p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
