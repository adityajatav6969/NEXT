import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../utils/api';
import { Building2, Users, Briefcase, MapPin, Globe, UserPlus } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const companyColors = ['from-blue-500 to-blue-600', 'from-violet-500 to-violet-600', 'from-rose-500 to-rose-600'];

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/companies');
        setCompanies(data);
      } catch (err) {
        console.error('Failed to load companies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const toggleFollow = async (id) => {
    try {
      const { data } = await api.post(`/companies/${id}/follow`);
      setCompanies(companies.map(c => 
        c._id === id 
          ? { ...c, isFollowing: data.isFollowing, followersCount: data.followersCount } 
          : c
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle follow');
    }
  };

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
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="card p-5">
          <h1 className="text-xl font-bold text-dark-900 dark:text-dark-100 mb-1">Company Pages</h1>
          <p className="text-sm text-dark-400">Discover top companies hiring developers</p>
        </div>

        <div className="space-y-4">
          {companies.map((company, i) => (
            <motion.div
              key={company._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card overflow-hidden"
            >
              {/* Banner */}
              <div className={`h-28 bg-gradient-to-br ${companyColors[i % companyColors.length]} relative flex items-end px-6 pb-4`}>
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
                />
                <p className="text-white/80 text-sm relative">{company.description?.slice(0, 100)}...</p>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${companyColors[i % companyColors.length]} flex items-center justify-center text-white text-2xl font-bold -mt-10 ring-4 ring-white dark:ring-dark-800 flex-shrink-0 overflow-hidden`}>
                      {company.logo && company.logo !== 'https://via.placeholder.com/150' ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        company.name[0]
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-dark-900 dark:text-dark-100">{company.name}</h2>
                      <p className="text-sm text-dark-500 dark:text-dark-400">{company.industry}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-dark-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{company.employees} employees</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{formatNumber(company.followersCount || 0)} followers</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFollow(company._id)}
                      className={company.isFollowing ? 'btn-ghost' : 'btn-brand'}
                    >
                      {company.isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{company.description}</p>

                <div className="mt-4 flex gap-2">
                  <button className="btn-outline text-xs flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Visit Website
                  </button>
                  <button className="btn-outline text-xs flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> View Jobs
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage;
