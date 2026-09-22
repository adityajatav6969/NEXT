import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { MapPin, Link2, BadgeCheck, Edit, Plus, Briefcase, GraduationCap, X, Check, Globe, MessageSquare } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import PostCard from '../components/feed/PostCard';
import { PostSkeleton } from '../components/ui/Skeletons';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Use the ID from URL, or fallback to the logged-in user's ID
  const targetId = id || user?._id || user?.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/profile/${targetId}`);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      setPostsLoading(true);
      try {
        const { data } = await api.get(`/posts?userId=${targetId}`);
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load user posts', err);
      } finally {
        setPostsLoading(false);
      }
    };

    if (targetId) {
      fetchProfileData();
      fetchUserPosts();
    }
  }, [targetId]);

  const handleSaveProfile = async () => {
    try {
      const { data } = await api.put('/users/profile', profile);
      setProfile(data);
      // Update the global user store if we're editing our own profile
      if (data._id === user?._id || data.id === user?.id) {
        login({ ...user, ...data });
      }
      setEditOpen(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const tabs = ['About', 'Posts', 'Experience', 'Education', 'Skills'];

  if (loading) {
    return (
      <Layout showRightSidebar={false}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout showRightSidebar={false}>
        <div className="text-center py-20 text-dark-400">Profile not found.</div>
      </Layout>
    );
  }

  const isOwnProfile = (user?._id || user?.id) === (profile._id || profile.id);

  return (
    <Layout showRightSidebar={false}>
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Profile Header */}
        <div className="card overflow-hidden">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-br from-brand-500 via-purple-600 to-accent-500 relative">
            <div className="absolute inset-0 opacity-40"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)' }}
            />
          </div>

          <div className="px-6 pb-5">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="ring-4 ring-white dark:ring-dark-800 rounded-full">
                <Avatar name={profile.name} img={profile.avatar} size="3xl" />
              </div>
              <div className="flex items-center gap-2 mt-12">
                {isOwnProfile ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditOpen(true)}
                    className="btn-outline flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </motion.button>
                ) : (
                  <>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-brand">
                      Connect
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => navigate('/messages', { state: { targetUser: profile } })}
                      className="btn-outline flex items-center gap-2 text-brand-600 border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:text-brand-400 dark:hover:bg-brand-900/30"
                    >
                      <MessageSquare className="w-4 h-4" /> Message
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-dark-900 dark:text-dark-100">{profile.name}</h1>
                {profile.isVerified && <BadgeCheck className="w-5 h-5 text-brand-500" />}
              </div>
              <p className="text-dark-600 dark:text-dark-300">{profile.title} <span className="text-dark-400">at</span> <span className="font-semibold text-brand-500">{profile.company}</span></p>
              <div className="flex items-center gap-4 text-sm text-dark-400 flex-wrap">
                {profile.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{profile.location}</span>}
                {profile.website && (
                  <span className="flex items-center gap-1.5 text-brand-500">
                    <Globe className="w-4 h-4" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-dark-100 dark:border-dark-700">
              {[
                { label: 'Connections', value: profile.connections || 0 },
                { label: 'Followers', value: profile.followers?.length || 0 },
                { label: 'Following', value: profile.following?.length || 0 },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="font-bold text-dark-900 dark:text-dark-100">{formatNumber(value)}</p>
                  <p className="text-xs text-dark-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            <p className="mt-4 text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-1 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.toLowerCase()
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'about' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-dark-900 dark:text-dark-100">About</h2>
                <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{profile.bio}</p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {profile.achievements?.map(a => (
                    <div key={a._id || a.id} className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                      <span className="text-2xl">{a.icon || '⭐'}</span>
                      <div>
                        <p className="text-sm font-semibold text-dark-800 dark:text-dark-200">{a.title}</p>
                        <p className="text-xs text-dark-400">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                  {(!profile.achievements || profile.achievements.length === 0) && (
                    <p className="text-sm text-dark-400 col-span-2">No achievements added yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => <PostSkeleton key={i} />)}
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post._id || post.id} post={post} />
                  ))
                ) : (
                  <div className="card p-12 text-center">
                    <p className="text-dark-400">No posts found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-dark-900 dark:text-dark-100">Experience</h2>
                  <button className="p-1.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors text-brand-500">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-5">
                  {profile.experience?.map((exp, i) => (
                    <div key={exp._id || exp.id || i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-brand-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-dark-900 dark:text-dark-100">{exp.title}</p>
                        <p className="text-sm text-dark-600 dark:text-dark-300">{exp.company}</p>
                        <p className="text-xs text-dark-400 mt-0.5">{exp.duration}</p>
                        {exp.description && <p className="text-sm text-dark-500 mt-2">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                  {(!profile.experience || profile.experience.length === 0) && (
                    <p className="text-sm text-dark-400">No experience details added yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-dark-900 dark:text-dark-100">Education</h2>
                  <button className="p-1.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors text-brand-500">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {profile.education?.map((edu, i) => (
                  <div key={edu._id || edu.id || i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-dark-900 dark:text-dark-100">{edu.degree}</p>
                      <p className="text-sm text-dark-600 dark:text-dark-300">{edu.school}</p>
                      <p className="text-xs text-dark-400 mt-0.5">{edu.year}</p>
                    </div>
                  </div>
                ))}
                {(!profile.education || profile.education.length === 0) && (
                  <p className="text-sm text-dark-400">No education details added yet.</p>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-dark-900 dark:text-dark-100">Skills</h2>
                  <button className="p-1.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors text-brand-500">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map(skill => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full text-sm font-medium border border-brand-200/50 dark:border-brand-800/50 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                  {(!profile.skills || profile.skills.length === 0) && (
                    <p className="text-sm text-dark-400">No skills added yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="card p-6">
                <h2 className="font-semibold text-dark-900 dark:text-dark-100 mb-4">Projects</h2>
                <p className="text-sm text-dark-400">No projects added yet. <button className="text-brand-500 hover:text-brand-600">Add your first project →</button></p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {editOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setEditOpen(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg bg-white dark:bg-dark-800 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center justify-between p-5 border-b border-dark-100 dark:border-dark-700">
                    <h2 className="font-semibold text-dark-900 dark:text-dark-100">Edit Profile</h2>
                    <button onClick={() => setEditOpen(false)}><X className="w-5 h-5 text-dark-400" /></button>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { label: 'Full Name', value: profile.name, key: 'name' },
                      { label: 'Job Title', value: profile.title, key: 'title' },
                      { label: 'Company', value: profile.company, key: 'company' },
                      { label: 'Location', value: profile.location, key: 'location' },
                      { label: 'Website (https://...)', value: profile.website || '', key: 'website', type: 'url' },
                    ].map(({ label, value, key, type }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-dark-500 mb-1">{label}</label>
                        <input
                          type={type || 'text'}
                          defaultValue={value}
                          onChange={(e) => setProfile(p => ({ ...p, [key]: e.target.value }))}
                          className="input-base"
                          placeholder={type === 'url' ? 'https://example.com' : ''}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium text-dark-500 mb-1">Bio</label>
                      <textarea
                        defaultValue={profile.bio}
                        onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                        className="input-base min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-100 dark:border-dark-700">
                    <button onClick={() => setEditOpen(false)} className="btn-ghost" disabled={loading}>Cancel</button>
                    <button onClick={handleSaveProfile} className="btn-brand flex items-center gap-2" disabled={loading}>
                      <Check className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default ProfilePage;
