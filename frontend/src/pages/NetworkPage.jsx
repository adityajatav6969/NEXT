import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import { Users, MapPin, BadgeCheck, MessageSquare, User } from 'lucide-react';
import api from '../utils/api';

const NetworkPage = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const { data } = await api.get('/users/network');
        // Only show users we are following
        setConnected(data.following || []);
      } catch (err) {
        console.error('Failed to fetch network', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetwork();
  }, []);

  return (
    <Layout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-dark-900 dark:text-dark-100">My Network</h1>
              <p className="text-sm text-dark-400 mt-0.5">Users you are following</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card p-12 text-center">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-dark-400">Loading network...</p>
          </div>
        )}

        {/* User cards grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {connected.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden group"
              >
                {/* Banner */}
                <div className="h-16 bg-gradient-to-br from-brand-500 via-purple-500 to-accent-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-4 pt-0">
                  <div className="-mt-7 mb-3 block w-max">
                    <Avatar name={user.name} size="lg" showRing />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-dark-900 dark:text-dark-100 truncate">{user.name}</span>
                        {user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-dark-500 dark:text-dark-400 truncate">{user.title}</p>
                      {user.location && <p className="text-xs text-dark-400 flex items-center gap-0.5 mt-0.5"><MapPin className="w-3 h-3" />{user.location}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 btn-brand"
                    >
                      <User className="w-4 h-4" /> View Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/messages', { state: { targetUser: user } })}
                      className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40"
                    >
                      <MessageSquare className="w-4 h-4" /> Message
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && connected.length === 0 && (
          <div className="card p-12 text-center">
            <Users className="w-10 h-10 text-dark-300 mx-auto mb-3" />
            <p className="text-dark-400">You are not following anyone yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NetworkPage;
