import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useMockData } from '../context/MockDataContext';
import { users, posts, trendingTopics } from '../data/mockData';
import Avatar from '../components/ui/Avatar';
import { BadgeCheck, TrendingUp, Hash, UserPlus, Compass } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const ExplorePage = () => {
  const { users: storeUsers, followUser } = useMockData();

  return (
    <Layout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="card p-6 bg-gradient-to-br from-brand-500 via-purple-600 to-accent-500 text-white border-0">
          <div className="flex items-center gap-3 mb-3">
            <Compass className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Discover</h1>
          </div>
          <p className="text-white/80">Find top developers, trending topics, and exciting projects</p>
        </div>

        {/* Trending topics */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-dark-900 dark:text-dark-100">Trending in Tech</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {trendingTopics.map((topic, i) => (
              <motion.button
                key={topic.id}
                whileHover={{ scale: 1.03, y: -2 }}
                className="p-3 bg-dark-50 dark:bg-dark-700 rounded-xl text-center group hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
              >
                <Hash className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                <p className="text-xs font-semibold text-dark-800 dark:text-dark-200 group-hover:text-brand-500 transition-colors">{topic.tag}</p>
                <p className="text-[10px] text-dark-400 mt-0.5">{formatNumber(topic.posts)} posts</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured Developers */}
        <div className="card p-5">
          <h2 className="font-semibold text-dark-900 dark:text-dark-100 mb-4">Top Developers</h2>
          <div className="space-y-3">
            {storeUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-all group"
              >
                <span className="text-sm font-bold text-dark-300 w-5 text-center">{i + 1}</span>
                <Avatar name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-dark-900 dark:text-dark-100 group-hover:text-brand-500 transition-colors">{user.name}</p>
                    {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-brand-500" />}
                  </div>
                  <p className="text-xs text-dark-400 truncate">{user.title} · {user.company}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.skills.slice(0, 3).map(s => <span key={s} className="tag text-[10px] py-0.5">{s}</span>)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-dark-700 dark:text-dark-200">{formatNumber(user.followers)}</p>
                  <p className="text-[10px] text-dark-400">followers</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => followUser(user.id)}
                    className={`mt-1.5 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                      user.isFollowing
                        ? 'border-dark-300 text-dark-500 hover:border-rose-400 hover:text-rose-500'
                        : 'border-brand-500/50 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                    }`}
                  >
                    <UserPlus className="w-3 h-3" />
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
