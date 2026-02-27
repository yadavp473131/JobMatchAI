import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const ApplicantCard = ({ application, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const statusOptions = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-purple-100 text-purple-800',
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(application._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const profile = application.jobSeeker;

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm text-gray-600">
                {profile.location?.city && profile.location?.state
                  ? `${profile.location.city}, ${profile.location.state}`
                  : 'Location not specified'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600">Match Score:</span>
              <div className="ml-2 flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${application.matchScore || 0}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900">
                  {application.matchScore || 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
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
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 8 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  +{profile.skills.length - 8} more
                </span>
              )}
            </div>
          )}

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {profile.phone && (
                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-900">{profile.phone}</span>
                </div>
              )}

              {profile.experience && profile.experience.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Recent Experience
                  </h4>
                  {profile.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm text-gray-600 mb-2">
                      <p className="font-medium text-gray-900">{exp.title}</p>
                      <p>{exp.company}</p>
                    </div>
                  ))}
                </div>
              )}

              {application.coverLetter && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Cover Letter
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              )}
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

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>

        {profile.resume && (
          <a
            href={`/api/uploads/resumes/${profile.resume.filename}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              View Resume
            </Button>
          </a>
        )}

        <div className="relative inline-block">
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="appearance-none px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ApplicantCard;
