import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import JobTable from '../../components/admin/JobTable';
import api from '../../services/api';

const JobModeration = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/jobs');
      setJobs(response.data.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (job) => {
    if (!window.confirm(`Approve job: ${job.title}?`)) {
      return;
    }

    try {
      await api.patch(`/admin/jobs/${job._id}/approve`);
      toast.success('Job approved successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error approving job:', error);
      toast.error('Failed to approve job');
    }
  };

  const handleReject = async (job) => {
    if (!window.confirm(`Reject job: ${job.title}?`)) {
      return;
    }

    try {
      await api.patch(`/admin/jobs/${job._id}/reject`);
      toast.success('Job rejected successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast.error('Failed to reject job');
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Are you sure you want to delete: ${job.title}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/jobs/${job._id}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Moderation</h1>
            <p className="text-gray-600">Review and moderate job postings on the platform</p>
          </div>

          {/* Job Table */}
          <JobTable
            jobs={jobs}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobModeration;
