import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, UserPlus, ExternalLink } from 'lucide-react';
import { users, trendingTopics } from '../../data/mockData';
import { useMockData } from '../../context/MockDataContext';
import Avatar from '../ui/Avatar';
import { formatNumber } from '../../utils/helpers';

const RightSidebar = () => {
  const { followUser, users: storeUsers } = useMockData();
  const suggestedUsers = storeUsers.filter(u => !u.isFollowing).slice(0, 3);

  return (
    <aside className="hidden xl:flex flex-col w-64 flex-shrink-0">
      <div className="sticky top-16 space-y-4">

        {/* Suggested Connections */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">People you may know</h3>
            <Link to="/network" className="text-xs text-brand-500 hover:text-brand-600 font-medium">See all</Link>
          </div>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-800 dark:text-dark-200 truncate">{user.name}</p>
                  <p className="text-xs text-dark-400 truncate">{user.title}</p>
                  <p className="text-xs text-dark-300">{formatNumber(user.followers)} followers</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => followUser(user.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-brand-500/50 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-all"
                >
                  <UserPlus className="w-3 h-3" />
                  Follow
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100">Trending in Tech</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, i) => (
              <Link key={topic.id} to={`/explore?tag=${topic.tag}`} className="flex items-center gap-2 group">
                <span className="text-xs font-bold text-dark-300 w-4">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-dark-800 dark:text-dark-200 group-hover:text-brand-500 transition-colors">#{topic.tag}</p>
                  <p className="text-xs text-dark-400">{formatNumber(topic.posts)} posts</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

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
