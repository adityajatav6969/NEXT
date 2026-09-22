import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, Github, Chrome, UserCheck } from 'lucide-react';
import api from '../utils/api';

const LoginPage = () => {
  const { completeAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await completeAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-3 shadow-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">NextDevs</h1>
          <p className="text-dark-400 text-sm mt-1">The professional network for builders</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-900/80 border border-dark-700 rounded-2xl p-7 backdrop-blur-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-500/30 rounded-lg text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-base"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-dark-400">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold text-sm shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign in'}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-xs text-dark-500">or continue with</span>
            <div className="flex-1 h-px bg-dark-700" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { icon: Github, label: 'GitHub', action: () => {} },
              { icon: Chrome, label: 'Google', action: () => {} },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                className="flex items-center justify-center gap-2 py-2.5 border border-dark-700 rounded-xl text-dark-300 hover:text-white hover:border-dark-500 hover:bg-dark-700/50 transition-all text-sm font-medium"
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-dark-400 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
