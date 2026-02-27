import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ApplicationCard from '../components/jobseeker/ApplicationCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Applications = () => {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [filter, pagination.page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await api.get('/applications/my-applications', { params });
      
      // Backend returns: { success: true, data: { applications: [...], pagination: {...} } }
      const responseData = response.data.data || response.data;
      const applicationsData = responseData.applications || [];
      const paginationData = responseData.pagination || {};
      
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setPagination({
        page: paginationData.page || pagination.page,
        limit: paginationData.limit || pagination.limit,
        total: paginationData.total || 0,
        pages: paginationData.pages || 0,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 404) {
        // No applications found - this is expected for new users
        setApplications([]);
        setPagination({
          ...pagination,
          total: 0,
          pages: 0,
        });
      } else {
        toast.error('Failed to load applications');
        setApplications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const filterOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
  ];

  const getStatusCount = (status) => {
    if (!applications || !Array.isArray(applications)) return 0;
    if (status === 'all') return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track the status of your job applications
            </p>
          </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  filter === option.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Applications List */}
        {loading ? (
          <Loader text="Loading applications..." />
        ) : applications.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all'
                ? "You haven't applied to any jobs yet."
                : `No ${filter} applications.`}
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
          <>
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total}{' '}
                  total applications)
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
                  {[...Array(pagination.pages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      variant={pagination.page === i + 1 ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {i + 1}
                    </Button>
                  ))}
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

export default Applications;
