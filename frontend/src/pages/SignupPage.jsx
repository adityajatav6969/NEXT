import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, Check } from 'lucide-react';
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

  const perks = [
    'Connect with 10,000+ developers',
    'Land your dream tech job',
    'Share knowledge & grow',
    'Showcase your projects',
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-3 shadow-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">NextDevs</h1>
          <p className="text-dark-400 text-sm mt-1">Join the platform built for builders</p>
        </motion.div>

        {/* Perks */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-5 grid grid-cols-2 gap-2">
          {perks.map(p => (
            <div key={p} className="flex items-center gap-2 text-xs text-dark-400">
              <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
              {p}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-900/80 border border-dark-700 rounded-2xl p-7 backdrop-blur-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-500/30 rounded-lg text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-400 mb-1.5">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Alex Rivera" className="input-base" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-400 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" className="input-base" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-400 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="At least 8 characters" className="input-base pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-dark-700'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${['', 'text-rose-400', 'text-amber-400', 'text-emerald-400'][passwordStrength]}`}>
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
              className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-xl font-semibold text-sm shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-5"
            >
              {loading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account...</> : 'Join NextDevs for free'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-dark-500 mt-4">
            By joining, you agree to our <a href="#" className="text-brand-400">Terms</a> and <a href="#" className="text-brand-400">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-dark-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
