import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building, Users, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import api from '../services/api';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user && user.role === 'jobseeker') {
      checkIfSaved();
    }
  }, [jobId, user]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${jobId}`);
      const jobData = response.data.data.job;
      const employerData = response.data.data.employer;
      
      // Add company name to job object
      if (employerData) {
        jobData.company = employerData.companyName;
      }
      
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await api.get('/saved-jobs');
      const savedJobs = response.data.data.savedJobs || [];
      setIsSaved(savedJobs.some(saved => saved.job._id === jobId));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.info('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (user.role !== 'jobseeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await api.post(`/applications`, { jobId });
      toast.success('Application submitted successfully!');
      navigate('/applications');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast.info('Please login to save jobs');
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${jobId}`);
        setIsSaved(false);
        toast.success('Job removed from saved jobs');
      } else {
        await api.post('/saved-jobs', { jobId });
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Not specified';
    if (typeof location === 'string') return location;
    
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    
    if (parts.length === 0) {
      return location.remote ? 'Remote' : 'Not specified';
    }
    
    const locationStr = parts.join(', ');
    return location.remote ? `${locationStr} (Remote)` : locationStr;
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not specified';
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()} ${salary.period || 'yearly'}`;
    }
    if (salary.min) return `From $${salary.min.toLocaleString()} ${salary.period || 'yearly'}`;
    return `Up to $${salary.max.toLocaleString()} ${salary.period || 'yearly'}`;
  };

  const formatJobType = (jobType) => {
    if (!jobType) return 'Not specified';
    return jobType.charAt(0).toUpperCase() + jobType.slice(1).replace('-', ' ');
  };

  const formatExperienceLevel = (level) => {
    if (!level) return 'Not specified';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job not found</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
              Browse all jobs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>

          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                {job.company && <p className="text-xl text-gray-600 mb-4">{job.company}</p>}
                
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    {formatLocation(job.location)}
                  </span>
                  <span className="flex items-center">
                    <Briefcase size={18} className="mr-2" />
                    {formatJobType(job.jobType)}
                  </span>
                  <span className="flex items-center">
                    <DollarSign size={18} className="mr-2" />
                    {formatSalary(job.salary)}
                  </span>
                  <span className="flex items-center">
                    <Users size={18} className="mr-2" />
                    {formatExperienceLevel(job.experienceLevel)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Share job"
                >
                  <Share2 size={24} />
                </button>
                {user && user.role === 'jobseeker' && (
                  <button
                    onClick={handleSaveJob}
                    className={`p-2 rounded-lg transition-colors ${
                      isSaved
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={isSaved ? 'Unsave job' : 'Save job'}
                  >
                    <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                )}
              </div>
            </div>

            {user && user.role === 'jobseeker' && (
              <Button
                onClick={handleApply}
                disabled={applying}
                className="w-full md:w-auto"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
            {!user && (
              <Button onClick={() => navigate('/login')} className="w-full md:w-auto">
                Login to Apply
              </Button>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Section */}
          {user && user.role === 'jobseeker' && (
            <div className="bg-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Interested in this position?
              </h3>
              <Button onClick={handleApply} disabled={applying} size="lg">
                {applying ? 'Applying...' : 'Apply Now'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;
