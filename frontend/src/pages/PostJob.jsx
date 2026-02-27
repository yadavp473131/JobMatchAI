import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import JobPostForm from '../components/employer/JobPostForm';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const PostJob = () => {
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(!!jobId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to load job');
      navigate('/employer/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (jobId) {
        await api.put(`/jobs/${jobId}`, formData);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', formData);
        toast.success('Job posted successfully');
      }
      navigate('/employer/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Loading job..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {jobId ? 'Edit Job Posting' : 'Post a New Job'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {jobId
                ? 'Update your job posting details'
                : 'Fill in the details to post a new job opening'}
            </p>
          </div>

          <Card>
            <JobPostForm
              initialData={job || {}}
              onSubmit={handleSubmit}
              loading={saving}
            />
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostJob;
