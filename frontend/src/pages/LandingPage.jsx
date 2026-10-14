import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Code, MessagesSquare, ArrowRight, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');


  const features = [
    { icon: <Users className="w-6 h-6 text-brand-400" />, title: 'Expand Your Network', desc: 'Connect with thousands of industry professionals and like-minded builders.' },
    { icon: <Code className="w-6 h-6 text-accent-400" />, title: 'Showcase Projects', desc: 'Share what you are building, get feedback, and find collaborators.' },
    { icon: <MessagesSquare className="w-6 h-6 text-emerald-400" />, title: 'Real-time Messaging', desc: 'Chat instantly with connections, mentors, or potential employers.' },
  ];

  const audiencePreviews = [
    { icon: <BookOpen className="w-5 h-5 text-sky-300" />, title: 'School Students', desc: 'Learn early, meet mentors, and build confidence with beginner-friendly projects.', anchor: 'school-students' },
    { icon: <GraduationCap className="w-5 h-5 text-violet-300" />, title: 'College Students', desc: 'Showcase projects, grow your network, and prepare for internships and placements.', anchor: 'college-students' },
    { icon: <Briefcase className="w-5 h-5 text-emerald-300" />, title: 'Working Professionals', desc: 'Strengthen your brand, expand your reach, and unlock your next opportunity.', anchor: 'working-professionals' },
  ];

  return (
    <div className="min-h-screen bg-[#060814] text-white overflow-hidden relative font-sans">
      {/* Background design backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/landing-bg.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060814]/40 via-transparent to-[#060814]/70" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="NextDevs Logo" className="h-9 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/audiences" className="hidden md:inline-flex px-4 py-2 rounded-xl text-sm font-medium text-dark-300 hover:text-white transition-colors">
            Who It's For
          </Link>
          <Link to="/login" className="px-5 py-2 rounded-xl text-sm font-medium text-dark-300 hover:text-white transition-colors">Sign In</Link>
          <Link to="/signup" className="px-5 py-2 rounded-xl text-sm font-medium bg-white text-dark-950 hover:bg-dark-100 transition-colors shadow-sm">Join Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:pt-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700 text-xs font-medium text-brand-300 mb-8 shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            V2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-tight mb-6">
            The professional network <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">for modern builders</span>
          </h1>
          <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect, collaborate, and grow your tech career on a platform designed for school students, college students, and working professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all hover:-translate-y-0.5">
              Create Account <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-300">{error}</p>
          )}

          <p className="mt-6 text-sm text-dark-400">
            Want a tailored view for your stage?
            {' '}
            <Link to="/audiences" className="text-white underline decoration-brand-400/70 underline-offset-4 hover:text-brand-300 transition-colors">
              See who NextDevs is built for
            </Link>
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-32 grid md:grid-cols-3 gap-8 text-left"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-dark-900/60 border border-white/10 backdrop-blur-md hover:border-brand-500/40 hover:bg-dark-900/80 transition-all duration-300 group shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-dark-800/80 border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-dark-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="text-left">
              <p className="text-sm uppercase tracking-[0.22em] text-dark-500 mb-2">Who It Is For</p>
              <h2 className="text-2xl md:text-3xl font-bold font-display">One platform, different starting points</h2>
            </div>
            <Link to="/audiences" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-white transition-colors">
              Open full page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5 text-left">
            {audiencePreviews.map((audience) => (
              <Link
                key={audience.title}
                to={`/audiences#${audience.anchor}`}
                className="rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-md p-6 hover:border-brand-500/40 hover:bg-dark-900/80 transition-all duration-300 shadow-lg"
              >
                <div className="w-11 h-11 rounded-xl bg-dark-800/80 border border-white/5 flex items-center justify-center mb-4">
                  {audience.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{audience.title}</h3>
                <p className="text-dark-400 leading-relaxed">{audience.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
