import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import JobCard from '../components/jobs/JobCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const SavedJobs = () => {
  const { user, logout } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/saved-jobs');
      // Handle different response formats
      const data = response.data.data || response.data;
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      // Silently handle 404 - just means no saved jobs yet
      if (error.response?.status === 404) {
        setSavedJobs([]);
      } else {
        toast.error('Failed to load saved jobs');
        setSavedJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs((prev) => prev.filter((item) => item.job._id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error('Failed to unsave job');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
            <p className="mt-2 text-sm text-gray-600">
              Jobs you've saved for later
            </p>
          </div>

          {loading ? (
            <Loader text="Loading saved jobs..." />
          ) : !Array.isArray(savedJobs) || savedJobs.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No saved jobs
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start saving jobs you're interested in to view them here.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => (window.location.href = '/jobs')}
                  variant="primary"
                >
                  Browse Jobs
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((item) => (
                <JobCard
                  key={item._id}
                  job={item.job}
                  isSaved={true}
                  onUnsave={handleUnsave}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SavedJobs;
