import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Loader from '../common/Loader';

const CandidateRecommendations = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    experienceLevel: '',
  });

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = { jobId, ...filters };
      const response = await api.get('/recommendations/candidates/search', { params });
      setCandidates(response.data.data?.candidates || []);
    } catch (error) {
      toast.error('Failed to load candidate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchCandidates();
  };

  const handleClearFilters = () => {
    setFilters({
      skills: '',
      location: '',
      experienceLevel: '',
    });
  };

  if (loading) {
    return <Loader text="Loading candidate recommendations..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recommended Candidates
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          AI-powered candidate recommendations based on job requirements
        </p>

        {/* Filters */}
        <Card className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="e.g., React, Node.js"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g., San Francisco"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button onClick={handleSearch} variant="primary">
              Search
            </Button>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      {candidates.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No candidates found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((item) => {
            const candidate = item.candidate;
            const matchScore = item.matchScore || 0;
            const matchReasons = item.matchReasons || [];
            
            return (
              <Card key={candidate._id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                          {candidate.firstName?.[0]}
                          {candidate.lastName?.[0]}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {candidate.location?.city && candidate.location?.state
                            ? `${candidate.location.city}, ${candidate.location.state}`
                            : typeof candidate.location === 'string'
                            ? candidate.location
                            : 'Location not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Match Score:</span>
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${matchScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 8).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 8 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                            +{candidate.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    )}

                    {candidate.experience && candidate.experience.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Recent Experience
                        </h4>
                        {candidate.experience.slice(0, 2).map((exp, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{exp.title}</p>
                            <p>{exp.company}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {matchReasons && matchReasons.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-2">
                          Why this candidate matches:
                        </p>
                        <ul className="text-sm text-green-800 space-y-1">
                          {matchReasons.map((reason, index) => (
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
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="primary" size="sm">
                    Contact Candidate
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateRecommendations;
