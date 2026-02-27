import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

const JobCard = ({ job, onSave, onUnsave, isSaved, showMatchScore = false }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

  const formatLocation = (location) => {
    if (!location) return 'Not specified';
    if (typeof location === 'string') return location;
    
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country && !location.city && !location.state) parts.push(location.country);
    
    if (parts.length === 0) {
      return location.remote ? 'Remote' : 'Not specified';
    }
    
    const locationStr = parts.join(', ');
    return location.remote ? `${locationStr} (Remote)` : locationStr;
  };

  const formatJobType = (jobType) => {
    if (!jobType) return 'Not specified';
    return jobType.charAt(0).toUpperCase() + jobType.slice(1).replace('-', ' ');
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            {job.title}
          </Link>
          {job.company && <p className="text-sm text-gray-600 mt-1">{job.company}</p>}

          <div className="flex flex-wrap items-center mt-3 gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {formatLocation(job.location)}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatSalary(job.salary?.min, job.salary?.max)}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {formatJobType(job.jobType)}
            </span>
            <span className="text-gray-400">• {formatDate(job.createdAt || job.postedDate)}</span>
          </div>

          {showMatchScore && job.matchScore && (
            <div className="mt-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Match:</span>
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${job.matchScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {job.matchScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  +{job.skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {onSave && onUnsave && (
          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={() => (isSaved ? onUnsave(job._id) : onSave(job._id))}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              <svg
                className="w-6 h-6"
                fill={isSaved ? 'currentColor' : 'none'}
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
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <Link to={`/jobs/${job._id}`} className="flex-1">
          <Button variant="primary" fullWidth>
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
