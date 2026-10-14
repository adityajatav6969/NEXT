import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, ArrowLeft, Mail, Lock, ArrowRight, User } from 'lucide-react';
import api from '../utils/api';

const SignupPage = () => {
  const { completeAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      await completeAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="min-h-screen bg-[#0A0D14] flex relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Left Logo */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 z-20">
        <img src="/logo.png" alt="NextDevs Logo" className="h-8 w-auto object-contain" />
      </Link>

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

          <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
          <p className="text-dark-400 text-sm mb-8">Join the platform built for builders</p>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Rivera"
                  className="w-full bg-[#0A0D14] border border-dark-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-dark-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-dark-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#0A0D14] border border-dark-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-dark-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-dark-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full bg-[#0A0D14] border border-dark-700/50 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-dark-500 tracking-widest"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-dark-800'}`} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${['', 'text-rose-400', 'text-amber-400', 'text-emerald-400'][passwordStrength]}`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Join NextDevs'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

