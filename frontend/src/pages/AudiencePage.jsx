import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const audienceTracks = [
  {
    id: 'school-students',
    title: 'School Students',
    icon: BookOpen,
    eyebrow: 'Start early',
    headline: 'Build curiosity into real skills before college starts.',
    description:
      'Discover coding, design, and communication skills through beginner-friendly communities, mentor discovery, and project-first learning.',
    focusAreas: ['Explore beginner-friendly tech communities', 'Share mini projects and get feedback', 'Follow mentors and future-ready role models'],
    outcomes: ['Confidence with foundational tech skills', 'A stronger portfolio for future applications', 'Early exposure to real-world collaboration'],
    accent: 'from-sky-400 via-cyan-400 to-teal-400',
  },
  {
    id: 'college-students',
    title: 'College Students',
    icon: GraduationCap,
    eyebrow: 'Build momentum',
    headline: 'Turn coursework, hackathons, and internships into a visible career story.',
    description:
      'Create a stronger public profile, showcase projects, grow a campus and industry network, and get noticed for internships and entry-level roles.',
    focusAreas: ['Showcase projects, certifications, and hackathon work', 'Connect with peers, alumni, and recruiters', 'Track opportunities that match your skills'],
    outcomes: ['A polished profile recruiters can trust', 'Better internship and placement readiness', 'A network that extends beyond campus'],
    accent: 'from-violet-500 via-fuchsia-500 to-pink-500',
  },
  {
    id: 'working-professionals',
    title: 'Working Professionals',
    icon: Briefcase,
    eyebrow: 'Grow with intention',
    headline: 'Strengthen your brand, expand your network, and unlock your next move.',
    description:
      'Whether you are switching roles, building authority in your field, or hiring, NextDevs can support consistent visibility and meaningful connections.',
    focusAreas: ['Build a sharper professional presence', 'Reach peers, hiring teams, and collaborators', 'Stay visible with posts, conversations, and updates'],
    outcomes: ['Higher quality professional opportunities', 'A stronger personal brand in your niche', 'More leverage for transitions and leadership growth'],
    accent: 'from-emerald-400 via-teal-400 to-lime-400',
  },
];

const stageSignals = [
  { label: 'School Students', value: 'Explore' },
  { label: 'College Students', value: 'Build' },
  { label: 'Working Professionals', value: 'Lead' },
];

const AudiencePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, completeAuth } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = location.hash.replace('#', '');
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.hash]);

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/guest');
      await completeAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-hidden relative font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-8%] left-[-8%] w-[28rem] h-[28rem] rounded-full bg-sky-500/20 blur-[120px]" />
        <div className="absolute top-[22%] right-[-10%] w-[34rem] h-[34rem] rounded-full bg-fuchsia-500/15 blur-[160px]" />
        <div className="absolute bottom-[-14%] left-[18%] w-[30rem] h-[30rem] rounded-full bg-emerald-500/15 blur-[150px]" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">NextDevs</span>
          </Link>
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/" className="px-5 py-2 rounded-xl text-sm font-medium bg-white text-dark-950 hover:bg-dark-100 transition-colors">
              Open Feed
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 rounded-xl text-sm font-medium text-dark-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2 rounded-xl text-sm font-medium bg-white text-dark-950 hover:bg-dark-100 transition-colors">
                Join Free
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-sky-200 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            One platform, three career stages
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display tracking-tight leading-tight mb-6">
            Built for school students,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300">
              college students, and working professionals.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-dark-300 max-w-3xl leading-relaxed">
            NextDevs adapts to where you are in your journey. Learn early, build credibility in college, or grow your professional network with a clearer online presence.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {stageSignals.map((signal, index) => (
              <motion.a
                key={signal.label}
                href={`#${audienceTracks[index].id}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index + 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/10 transition-colors"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-dark-400 mb-2">{signal.label}</p>
                <p className="text-2xl font-semibold text-white">{signal.value}</p>
              </motion.a>
            ))}
          </div>
        </motion.section>

        <section className="mt-16 lg:mt-24 grid gap-6">
          {audienceTracks.map(({ id, title, icon: Icon, eyebrow, headline, description, focusAreas, outcomes, accent }, index) => (
            <motion.article
              key={id}
              id={id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 * index }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 p-8 lg:p-10">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-dark-950 shadow-glow`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-dark-400">{eyebrow}</p>
                      <h2 className="text-3xl font-bold font-display">{title}</h2>
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-white mb-4 max-w-2xl">{headline}</h3>
                  <p className="text-dark-300 text-base leading-7 max-w-2xl">{description}</p>

                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-white mb-3">What this group can do here</p>
                      <div className="space-y-3">
                        {focusAreas.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-dark-200">
                            <CheckCircle2 className="w-5 h-5 text-sky-300 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-3">Expected outcomes</p>
                      <div className="space-y-3">
                        {outcomes.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-dark-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-dark-950/60 p-6 lg:p-7">
                  <p className="text-xs uppercase tracking-[0.24em] text-dark-400 mb-3">Recommended next step</p>
                  <p className="text-xl font-semibold text-white mb-3">
                    {title === 'School Students' && 'Start by exploring communities and beginner-friendly profiles.'}
                    {title === 'College Students' && 'Publish your strongest work and get ready for internships and placements.'}
                    {title === 'Working Professionals' && 'Sharpen your professional story and expand meaningful relationships.'}
                  </p>
                  <p className="text-dark-300 leading-7">
                    The page is designed to guide each audience toward the same product with different motivations: learning, proving capability, and unlocking opportunity.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      to={isAuthenticated ? '/' : '/signup'}
                      className="w-full px-5 py-3 rounded-xl bg-white text-dark-950 font-semibold flex items-center justify-center gap-2 hover:bg-dark-100 transition-colors"
                    >
                      {isAuthenticated ? 'Go to Feed' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={isAuthenticated ? '/network' : '/login'}
                      className="w-full px-5 py-3 rounded-xl border border-white/15 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                    >
                      {isAuthenticated ? 'Grow Network' : 'Sign In'}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-16 lg:mt-24 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 lg:p-10"
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-200 mb-5">
                <Users className="w-3.5 h-3.5" />
                Ready to explore?
              </div>
              <h2 className="text-3xl font-bold font-display mb-4">Pick your stage now, then grow with the same network over time.</h2>
              <p className="text-dark-300 max-w-2xl leading-7">
                Someone can begin as a school student, build publicly in college, and later become a working professional on the same platform. This page makes that journey visible.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-white text-dark-950 font-semibold text-center hover:bg-dark-100 transition-colors"
                >
                  Open Feed
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-6 py-3 rounded-xl bg-white text-dark-950 font-semibold text-center hover:bg-dark-100 transition-colors"
                  >
                    Join Free
                  </Link>
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl border border-white/15 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Opening guest access...' : 'Explore as Guest'}
                  </button>
                </>
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
        </motion.section>
      </main>
    </div>
  );
};

export default AudiencePage;
