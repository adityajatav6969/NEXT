import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../utils/api';
import { Bookmark, MapPin, Users, Briefcase, Clock, Filter, X, Check, ChevronDown, Search, Building2 } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const companyLogoBg = (name) => {
  const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-rose-500 to-rose-600', 'from-emerald-500 to-emerald-600', 'from-amber-500 to-amber-600', 'from-cyan-500 to-cyan-600'];
  return colors[name.charCodeAt(0) % colors.length];
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setJobs(jobs.map(j => j._id === jobId ? { ...j, hasApplied: true, applicantsCount: (j.applicantsCount || 0) + 1 } : j));
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob({ ...selectedJob, hasApplied: true, applicantsCount: (selectedJob.applicantsCount || 0) + 1 });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const filterOptions = ['all', 'full-time', 'remote', 'saved'];
  const experiences = ['Junior', 'Mid-level', 'Senior', 'Staff', 'Principal'];

  const filteredJobs = jobs.filter(j => {
    if (filter === 'remote') return j.location === 'Remote' || j.type === 'Remote';
    if (locationFilter && !j.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

  const activeJob = selectedJob || filteredJobs[0];

  if (loading) {
    return (
      <Layout showRightSidebar={false}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showRightSidebar={false}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="card p-5">
          <h1 className="text-xl font-bold text-dark-900 dark:text-dark-100 mb-4">Job Board</h1>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input placeholder="Search jobs..." className="input-base pl-9" />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 btn-outline"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {filterOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-wrap gap-3 pt-3 mt-3 border-t border-dark-100 dark:border-dark-700">
                  <div>
                    <label className="text-xs font-medium text-dark-500 block mb-1">Location</label>
                    <input value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="e.g. San Francisco" className="input-base w-44" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-500 block mb-1">Experience</label>
                    <select value={expFilter} onChange={e => setExpFilter(e.target.value)} className="input-base w-36">
                      <option value="">All levels</option>
                      {experiences.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {filterOptions.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                  filter === f ? 'bg-brand-500 text-white shadow-glow' : 'bg-dark-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Job list */}
          <div className="w-full lg:w-80 xl:w-96 space-y-3 flex-shrink-0">
            {filteredJobs.length === 0 && (
              <div className="card p-8 text-center text-dark-400">No jobs found matching your criteria.</div>
            )}
            {filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedJob(job)}
                className={`card p-4 cursor-pointer transition-all ${activeJob?._id === job._id ? 'border-brand-500 shadow-glow' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${companyLogoBg(job.company?.name || 'Company')} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden`}>
                    {job.company?.logo && job.company.logo !== 'https://via.placeholder.com/150' ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      (job.company?.name || 'C')[0]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-dark-900 dark:text-dark-100">{job.title}</h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400">{job.company?.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-dark-400">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium">{job.salaryRange || job.salary}</span>
                      {job.hasApplied && <span className="badge-success">Applied</span>}
                    </div>
                  </div>
                  <button className="p-1 rounded transition-colors flex-shrink-0 text-dark-300 hover:text-brand-400">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Job detail */}
          {activeJob && (
            <motion.div
              key={activeJob._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:block flex-1 card p-6 self-start sticky top-20"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${companyLogoBg(activeJob.company?.name || 'Company')} flex items-center justify-center text-white text-xl font-bold overflow-hidden`}>
                    {activeJob.company?.logo && activeJob.company.logo !== 'https://via.placeholder.com/150' ? (
                      <img src={activeJob.company.logo} alt={activeJob.company.name} className="w-full h-full object-cover" />
                    ) : (
                      (activeJob.company?.name || 'C')[0]
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark-900 dark:text-dark-100">{activeJob.title}</h2>
                    <p className="text-dark-600 dark:text-dark-300">{activeJob.company?.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-dark-400 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activeJob.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{activeJob.type}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(activeJob.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg transition-colors text-dark-300 hover:text-brand-400">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">{activeJob.salaryRange || activeJob.salary}</span>
                {activeJob.tags?.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>

              <div className="mb-5">
                <h3 className="font-semibold text-dark-900 dark:text-dark-100 mb-2">About the role</h3>
                <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed whitespace-pre-wrap">{activeJob.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-dark-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {formatNumber(activeJob.applicantsCount || 0)} applicants
                </span>
              </div>

              <div className="flex gap-3 mt-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApply(activeJob._id)}
                  disabled={activeJob.hasApplied}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    activeJob.hasApplied
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center gap-2 cursor-default'
                      : 'btn-brand text-center'
                  }`}
                >
                  {activeJob.hasApplied ? <><Check className="w-4 h-4" /> Applied!</> : 'Apply Now'}
                </motion.button>
                <button className="btn-outline px-4 py-2.5">Message</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobsPage;
