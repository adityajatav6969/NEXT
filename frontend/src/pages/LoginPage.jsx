import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, ArrowLeft, Mail, Lock, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0A0D14] flex relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg">NextDevs</span>
      </div>

      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 right-8 z-20 flex items-center gap-2 text-sm text-dark-300 hover:text-white bg-dark-800/40 hover:bg-dark-700/60 px-4 py-2 rounded-xl backdrop-blur-md transition-all border border-dark-700/50">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Left Section (Content) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-24 z-10">
        <h1 className="text-6xl font-bold text-white mb-4">
          Next<span className="text-brand-500">Devs</span>
        </h1>
        <h2 className="text-3xl font-bold text-white mb-6">
          Connect. Collaborate. Grow.
        </h2>
        <p className="text-dark-400 text-lg max-w-md leading-relaxed mb-10">
          A professional network for students and developers to share ideas, find teammates, and build the future together.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <img src="https://i.pravatar.cc/100?img=33" className="w-10 h-10 rounded-full border-2 border-[#0A0D14]" alt="User" />
            <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-[#0A0D14]" alt="User" />
            <img src="https://i.pravatar.cc/100?img=68" className="w-10 h-10 rounded-full border-2 border-[#0A0D14]" alt="User" />
            <div className="w-10 h-10 rounded-full border-2 border-[#0A0D14] bg-dark-800 flex items-center justify-center text-xs text-white font-medium">
              +1K
            </div>
          </div>
          <p className="text-sm text-dark-400 max-w-[150px] leading-tight">
            Join a growing community of builders
          </p>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] bg-[#121520]/80 backdrop-blur-2xl border border-brand-500/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top border glow for the card */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-dark-400 text-sm mb-8">Sign in to continue to NextDevs</p>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-dark-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0A0D14] border border-dark-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-dark-500"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-dark-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0D14] border border-dark-700/50 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-dark-500 tracking-widest"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

