import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ApplicantCard from '../components/employer/ApplicantCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Applicants = () => {
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId, filter, sortBy, pagination.page]);

  const fetchJobAndApplicants = async () => {
    setLoading(true);
    try {
      // Fetch job details
      const jobResponse = await api.get(`/jobs/${jobId}`);
      setJob(jobResponse.data.data?.job || jobResponse.data.data || jobResponse.data);

      // Fetch applicants
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      const applicantsResponse = await api.get(`/applications/job/${jobId}`, {
        params,
      });

      setApplicants(applicantsResponse.data.data?.applications || []);
      setPagination({
        ...pagination,
        total: applicantsResponse.data.data?.pagination?.total || 0,
        pages: applicantsResponse.data.data?.pagination?.pages || 0,
      });
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success('Application status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const filterOptions = [
    { value: 'all', label: 'All Applicants' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Application Date' },
    { value: 'matchScore', label: 'Match Score' },
  ];

  if (loading && !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Loading applicants..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Job Header */}
          {job && (
            <div className="mb-8">
              <Link
                to="/employer/jobs"
                className="text-sm text-blue-600 hover:text-blue-500 mb-2 inline-block"
              >
                ← Back to My Jobs
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-2 text-sm text-gray-600">
                {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

        {/* Filters and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <Loader text="Loading applicants..." />
        ) : applicants.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applicants found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all'
                ? 'No one has applied to this job yet.'
                : `No ${filter} applicants.`}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {applicants.map((application) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total}{' '}
                  total applicants)
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={pagination.page === page ? 'primary' : 'outline'}
                        size="sm"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Applicants;
