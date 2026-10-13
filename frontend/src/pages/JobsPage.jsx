import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Bookmark, MapPin, Users, Briefcase, Clock, Filter, X, Check, ChevronDown, Search, Building2 } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import CreateJob from '../components/jobs/CreateJob';

const companyLogoBg = (name) => {
  const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-rose-500 to-rose-600', 'from-emerald-500 to-emerald-600', 'from-amber-500 to-amber-600', 'from-cyan-500 to-cyan-600'];
  return colors[name.charCodeAt(0) % colors.length];
};

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);

  const handleJobCreated = (newJob) => {
    setJobs([newJob, ...jobs]);
    if (!selectedJob) setSelectedJob(newJob);
  };

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

  const activeJob = selectedJob || jobs[0];

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
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Job list */}
          <div className="w-full lg:w-80 xl:w-96 space-y-3 flex-shrink-0">
            <CreateJob onJobCreated={handleJobCreated} />
            {jobs.length === 0 && (
              <div className="card p-8 text-center text-dark-400">No jobs found.</div>
            )}
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ y: -2 }}
                onClick={() => { setSelectedJob(job); setShowApplicants(false); }}
                className={`card p-4 cursor-pointer transition-all ${activeJob?._id === job._id ? 'border-brand-500 shadow-glow' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${companyLogoBg(job.companyName || 'Company')} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden`}>
                    {job.companyLogo && job.companyLogo !== 'https://via.placeholder.com/150' ? (
                      <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                    ) : (
                      (job.companyName || 'C')[0]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-dark-900 dark:text-dark-100">{job.title}</h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400">{job.companyName}</p>
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
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${companyLogoBg(activeJob.companyName || 'Company')} flex items-center justify-center text-white text-xl font-bold overflow-hidden`}>
                    {activeJob.companyLogo && activeJob.companyLogo !== 'https://via.placeholder.com/150' ? (
                      <img src={activeJob.companyLogo} alt={activeJob.companyName} className="w-full h-full object-cover" />
                    ) : (
                      (activeJob.companyName || 'C')[0]
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark-900 dark:text-dark-100">{activeJob.title}</h2>
                    <p className="text-dark-600 dark:text-dark-300">{activeJob.companyName}</p>
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

              {((activeJob.postedBy?._id || activeJob.postedBy) === (user?._id || user?.id)) ? (
                <div className="mt-5 border-t border-dark-100 dark:border-dark-700 pt-4">
                  <button 
                    onClick={() => setShowApplicants(!showApplicants)}
                    className="btn-outline w-full py-2 mb-4 text-sm"
                  >
                    {showApplicants ? 'Hide Applicants' : 'View Applicants'}
                  </button>
                  
                  {showApplicants && (
                    <div className="space-y-3">
                      {activeJob.applicants?.length > 0 ? (
                        activeJob.applicants.map(applicant => (
                          <div key={applicant._id} className="flex items-center gap-3 p-3 bg-dark-50 dark:bg-dark-800/50 rounded-xl border border-dark-100 dark:border-dark-700">
                            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center overflow-hidden flex-shrink-0 text-brand-600 dark:text-brand-400 font-semibold">
                               {applicant.avatar && applicant.avatar !== 'https://via.placeholder.com/150' ? <img src={applicant.avatar} className="w-full h-full object-cover"/> : (applicant.name ? applicant.name[0] : 'U')}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-dark-900 dark:text-dark-100">{applicant.name || 'Unknown User'}</p>
                                <p className="text-xs text-dark-500 dark:text-dark-400">{applicant.title || 'User'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center bg-dark-50 dark:bg-dark-800/30 rounded-xl">
                          <p className="text-sm text-dark-400">No applicants yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
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
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobsPage;
