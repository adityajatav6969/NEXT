import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useMockData } from '../context/MockDataContext';
import Avatar from '../components/ui/Avatar';
import { UserPlus, UserCheck, Users, Search, MapPin, BadgeCheck } from 'lucide-react';
import { users } from '../data/mockData';
import { formatNumber } from '../utils/helpers';

const NetworkPage = () => {
  const { users: storeUsers, followUser } = useMockData();
  const [activeTab, setActiveTab] = useState('discover');
  const [search, setSearch] = useState('');

  const suggested = storeUsers.filter(u => !u.isFollowing);
  const connected = storeUsers.filter(u => u.isFollowing);
  const list = activeTab === 'discover' ? suggested : connected;
  const filtered = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-dark-900 dark:text-dark-100">My Network</h1>
              <p className="text-sm text-dark-400 mt-0.5">{storeUsers.filter(u => u.isFollowing).length} connections · {suggested.length} pending suggestions</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people..." className="input-base pl-9" />
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {['discover', 'connections'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-brand-500 text-white shadow-glow' : 'bg-dark-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400'
                }`}
              >
                {tab === 'discover' ? `Discover (${suggested.length})` : `Connections (${connected.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Invites Sent', value: 12, icon: UserPlus, color: 'text-brand-500' },
            { label: 'Connections', value: connected.length, icon: Users, color: 'text-emerald-500' },
            { label: 'Profile Views', value: 2847, icon: Users, color: 'text-amber-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 text-center">
              <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-dark-900 dark:text-dark-100">{formatNumber(value)}</p>
              <p className="text-xs text-dark-400">{label}</p>
            </div>
          ))}
        </div>

        {/* User cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden group"
            >
              {/* Banner */}
              <div className="h-16 bg-gradient-to-br from-brand-500 via-purple-500 to-accent-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-4 pt-0">
                <div className="-mt-7 mb-3">
                  <Avatar name={user.name} size="lg" showRing />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-sm text-dark-900 dark:text-dark-100 truncate">{user.name}</h3>
                      {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-dark-500 dark:text-dark-400 truncate">{user.title}</p>
                    <p className="text-xs text-dark-400 flex items-center gap-0.5 mt-0.5"><MapPin className="w-3 h-3" />{user.location}</p>
                    <p className="text-xs text-dark-300 mt-0.5">{formatNumber(user.followers)} followers</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.skills.slice(0, 2).map(s => <span key={s} className="tag text-[10px] py-0.5">{s}</span>)}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => followUser(user.id)}
                  className={`w-full mt-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    user.isFollowing
                      ? 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500'
                      : 'btn-brand'
                  }`}
                >
                  {user.isFollowing ? <><UserCheck className="w-4 h-4" /> Connected</> : <><UserPlus className="w-4 h-4" /> Connect</>}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Users className="w-10 h-10 text-dark-300 mx-auto mb-3" />
            <p className="text-dark-400">No people found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NetworkPage;
