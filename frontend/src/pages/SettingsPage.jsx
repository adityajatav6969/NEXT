import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Lock, Bell, User, Shield, LogOut, Check } from 'lucide-react';

const SettingsPage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveAccount = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      login({ ...user, ...data });
      alert('Settings saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const { data } = await api.put('/auth/password', passwordData);
      login(data);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const menuItems = [
    { id: 'account', label: 'Account Preferences', icon: User },
    { id: 'security', label: 'Sign in & Security', icon: Lock },

  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-2">
          <div className="card p-2">
            <h2 className="text-xs font-bold text-dark-500 uppercase tracking-wider px-3 mb-2 pt-2">Settings</h2>
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-500'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
            <div className="h-px bg-dark-100 dark:bg-dark-700 my-2 mx-3" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-dark-100">Account Preferences</h2>
                  <p className="text-sm text-dark-400">Manage your basic profile information and preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Full Name', key: 'name' },
                    { label: 'Job Title', key: 'title' },
                    { label: 'Location', key: 'location' },
                    { label: 'Website URL', key: 'website', placeholder: 'https://...' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">{label}</label>
                      <input
                        type="text"
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="input-base"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dark-100 dark:border-dark-700 flex justify-end">
                  <button onClick={handleSaveAccount} disabled={loading} className="btn-brand flex items-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-dark-100">Sign in & Security</h2>
                  <p className="text-sm text-dark-400">Update your password and secure your account.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter your current password"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="At least 8 characters"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Re-enter your new password"
                      className="input-base"
                    />
                  </div>
                  <button onClick={handlePasswordUpdate} disabled={passwordLoading} className="btn-brand">
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>

                <div className="pt-6 border-t border-dark-100 dark:border-dark-700">
                  <h3 className="text-dark-900 dark:text-dark-100 font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-dark-400 mb-4">Add an extra layer of security to your account.</p>
                  <button className="btn-outline" disabled>
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
