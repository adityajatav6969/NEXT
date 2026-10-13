import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import api from '../../utils/api';

const CreateJob = ({ onJobCreated }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    companyName: '',
    location: '',
    type: 'Full-time',
    salaryRange: '',
    description: '',
    tags: ''
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title || !form.companyName || !form.location || !form.description) {
      alert("Please fill all required fields");
      return;
    }
    
    setPosting(true);
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...form, tags: tagsArray };
      
      const { data } = await api.post('/jobs', payload);
      
      if (onJobCreated) onJobCreated(data);
      
      setForm({
        title: '', companyName: '', location: '', type: 'Full-time', salaryRange: '', description: '', tags: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to create job', error);
      alert('Failed to create job: ' + (error.response?.data?.message || error.message));
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'User'} size="md" showRing />
          <button
            onClick={() => setOpen(true)}
            className="flex-1 text-left px-4 py-2.5 bg-dark-50 dark:bg-dark-700/50 border border-dark-200 dark:border-dark-700 rounded-full text-sm text-dark-400 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all"
          >
            Post a new job opening...
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-100 dark:border-dark-700">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <Briefcase className="w-4 h-4 text-emerald-500" />
            Post a Job
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => !posting && setOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="flex items-center justify-between p-4 border-b border-dark-100 dark:border-dark-700">
                  <h2 className="font-semibold text-dark-900 dark:text-dark-100">Post a Job</h2>
                  <button disabled={posting} onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 disabled:opacity-50">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto flex flex-col gap-3">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title *" className="input-base" disabled={posting} />
                  <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name *" className="input-base" disabled={posting} />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Location *" className="input-base" disabled={posting} />
                    <select name="type" value={form.type} onChange={handleChange} className="input-base" disabled={posting}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="Salary Range (e.g. $100k - $120k)" className="input-base" disabled={posting} />
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated, e.g. React, Node.js)" className="input-base" disabled={posting} />
                  
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Job Description *"
                    className="w-full min-h-[120px] bg-transparent border border-dark-200 dark:border-dark-700 rounded-xl p-3 text-dark-800 dark:text-dark-200 placeholder-dark-400 focus:outline-none text-sm resize-none leading-relaxed"
                    disabled={posting}
                  />
                </div>

                <div className="flex items-center justify-end p-4 border-t border-dark-100 dark:border-dark-700">
                  <motion.button
                    whileHover={!posting ? { scale: 1.02 } : {}}
                    whileTap={!posting ? { scale: 0.98 } : {}}
                    onClick={handlePost}
                    disabled={posting}
                    className="btn-brand disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Posting...
                      </div>
                    ) : 'Post Job'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateJob;
