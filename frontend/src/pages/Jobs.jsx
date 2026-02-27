import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: '',
    experienceLevel: '',
    minSalary: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Job title or keywords"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <MapPin className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Search
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Filter size={20} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                    <DollarSign className="text-gray-400" size={20} />
                    <input
                      type="number"
                      placeholder="e.g., 80000"
                      value={filters.minSalary}
                      onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? 'Searching...' : `${jobs.length} Jobs Found`}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
