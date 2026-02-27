import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const MyJobs = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs/my-jobs');
      setJobs(response.data.data?.jobs || []);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      );
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Loading jobs..." />
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your job postings and view applicants
              </p>
            </div>
            <Link to="/employer/post-job">
              <Button variant="primary">Post New Job</Button>
            </Link>
          </div>

        {jobs.length === 0 ? (
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No job postings yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by posting your first job opening.
            </p>
            <div className="mt-6">
              <Link to="/employer/post-job">
                <Button variant="primary">Post Your First Job</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                        </svg>
                        {job.location?.city && job.location?.state
                          ? `${job.location.city}, ${job.location.state}`
                          : typeof job.location === 'string'
                          ? job.location
                          : 'Location not specified'}
                        {job.location?.remote && ' (Remote)'}
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
                        {job.type}
                      </span>
                      <span>Posted {formatDate(job.postedDate)}</span>
                    </div>

                    <div className="mt-4 flex items-center space-x-6 text-sm">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-1 text-blue-600"
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
                        <span className="font-medium text-gray-900">
                          {job.applicantCount || 0}
                        </span>
                        <span className="ml-1 text-gray-600">applicants</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-1 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="font-medium text-gray-900">
                          {job.viewCount || 0}
                        </span>
                        <span className="ml-1 text-gray-600">views</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/employer/jobs/${job._id}/applicants`}>
                    <Button variant="primary" size="sm">
                      View Applicants ({job.applicantCount || 0})
                    </Button>
                  </Link>
                  <Link to={`/employer/edit-job/${job._id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusToggle(job._id, job.status)}
                  >
                    {job.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyJobs;
