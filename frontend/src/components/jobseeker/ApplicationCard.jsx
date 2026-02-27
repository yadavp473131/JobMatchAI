import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const ApplicationCard = ({ application }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-purple-100 text-purple-800',
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle both jobId and job properties (backend uses jobId)
  const job = application.jobId || application.job;
  
  // If no job data, show minimal card
  if (!job) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">Job information unavailable</p>
            <p className="text-sm text-gray-600 mt-1">Applied {formatDate(application.appliedAt)}</p>
          </div>
          <div className="ml-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                statusColors[application.status] || statusColors.pending
              }`}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Format location (handle both string and object)
  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      if (location.country) parts.push(location.country);
      return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    }
    return 'Location not specified';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            {job.title || 'Untitled Job'}
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            {job.company || 'Company not specified'}
          </p>
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Applied {formatDate(application.appliedAt)}
            </span>
          </div>
          {application.matchScore && (
            <div className="mt-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Match Score:</span>
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${application.matchScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {application.matchScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[application.status] || statusColors.pending
            }`}
          >
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;
