import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import { BadgeCheck, UserPlus, UserCheck, Compass } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import api from '../utils/api';

const ExplorePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const { data } = await api.get('/users/explore');
        setUsers(data || []);
      } catch (err) {
        console.error('Failed to fetch explore users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const { data } = await api.post(`/users/${userId}/follow`);
      setUsers(prev => prev.map(u => {
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
    <Layout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="card p-6 bg-gradient-to-br from-brand-500 via-purple-600 to-accent-500 text-white border-0">
          <div className="flex items-center gap-3 mb-3">
            <Compass className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Discover</h1>
          </div>
          <p className="text-white/80">Find top developers and exciting projects</p>
        </div>

        {/* Featured Developers */}
        <div className="card p-5">
          <h2 className="font-semibold text-dark-900 dark:text-dark-100 mb-4">Top Developers</h2>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-dark-400">Finding developers...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-all group"
                >
                  <span className="text-sm font-bold text-dark-300 w-5 text-center">{i + 1}</span>
                  <Link to={`/profile/${user._id}`}>
                    <Avatar name={user.name} size="md" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/profile/${user._id}`}>
                        <p className="font-semibold text-sm text-dark-900 dark:text-dark-100 group-hover:text-brand-500 transition-colors">{user.name}</p>
                      </Link>
                      {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-brand-500" />}
                    </div>
                    <p className="text-xs text-dark-400 truncate">{user.title} {user.company ? `· ${user.company}` : ''}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(user.skills || []).slice(0, 3).map(s => <span key={s} className="tag text-[10px] py-0.5">{s}</span>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-dark-700 dark:text-dark-200">{formatNumber(user.followersCount || 0)}</p>
                    <p className="text-[10px] text-dark-400">followers</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFollow(user._id)}
                      className={`mt-1.5 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                        user.isFollowing
                          ? 'border-dark-300 text-dark-500 bg-dark-50 hover:bg-dark-100 dark:border-dark-600 dark:text-dark-300 dark:bg-dark-800 dark:hover:bg-dark-700'
                          : 'border-brand-500/50 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                      }`}
                    >
                      {user.isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && users.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-dark-400">No developers found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
