import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import JobCard from '../jobs/JobCard';
import Loader from '../common/Loader';
import Button from '../common/Button';

const JobRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
    fetchSavedJobs();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/recommendations/jobs');
      // Handle both response formats: response.data.data or response.data
      const recommendationsData = response.data.data || response.data;
      setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : []);
    } catch (error) {
      // Silently handle 404 - just means no recommendations yet
      if (error.response?.status !== 404) {
        toast.error('Failed to load recommendations');
      }
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/saved-jobs');
      const savedJobsData = response.data.data || response.data;
      const saved = new Set(
        Array.isArray(savedJobsData) 
          ? savedJobsData.map((item) => item.job?._id || item.jobId).filter(Boolean)
          : []
      );
      setSavedJobs(saved);
    } catch (error) {
      // Silently fail
    }
  };

  const handleSave = async (jobId) => {
    try {
      await api.post(`/saved-jobs/${jobId}`);
      setSavedJobs((prev) => new Set([...prev, jobId]));
      toast.success('Job saved successfully');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error('Failed to unsave job');
    }
  };

  const handleFeedback = async (jobId, helpful) => {
    try {
      await api.post('/recommendations/feedback', {
        jobId,
        helpful,
      });
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  if (loading) {
    return <Loader text="Loading recommendations..." />;
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No recommendations yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete your profile to get personalized job recommendations.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => (window.location.href = '/profile')}
            variant="primary"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended Jobs for You
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Based on your profile and preferences
          </p>
        </div>
        <Button onClick={fetchRecommendations} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.job._id} className="relative">
            <JobCard
              job={{ ...rec.job, matchScore: rec.matchScore }}
              showMatchScore={true}
              isSaved={savedJobs.has(rec.job._id)}
              onSave={handleSave}
              onUnsave={handleUnsave}
            />
            
            {/* Match Reasons */}
            {rec.matchReasons && rec.matchReasons.length > 0 && (
              <div className="mt-2 ml-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Why this job matches:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  {rec.matchReasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
                
                {/* Feedback */}
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 mb-2">
                    Was this recommendation helpful?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFeedback(rec.job._id, true)}
                      className="text-xs px-3 py-1 bg-white text-blue-600 border border-blue-300 rounded hover:bg-blue-100"
                    >
                      👍 Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(rec.job._id, false)}
                      className="text-xs px-3 py-1 bg-white text-blue-600 border border-blue-300 rounded hover:bg-blue-100"
                    >
                      👎 No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
