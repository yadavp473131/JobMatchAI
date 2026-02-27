import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Eye, CheckCircle, Clock, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MetricCard from '../components/common/MetricCard';
import CandidateRecommendations from '../components/employer/CandidateRecommendations';
import api from '../services/api';

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, jobsRes] = await Promise.all([
        api.get('/dashboard/employer'),
        api.get('/jobs/my-jobs?limit=5')
      ]);
      
      setDashboardData(dashboardRes.data.data);
      setRecentJobs(jobsRes.data.data.jobs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  const stats = dashboardData?.statistics || {};
  const profile = dashboardData?.profile || {};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile.companyName || 'Employer'}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your hiring activity
            </p>
          </div>

          {/* Profile Completeness Alert */}
          {!profile.companyName && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Complete your company profile
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Add company information to attract better candidates
                  </p>
                </div>
                <Link
                  to="/employer/profile"
                  className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Active Jobs"
              value={stats.activeJobs || 0}
              icon={Briefcase}
              color="blue"
            />
            <MetricCard
              label="Total Applicants"
              value={stats.totalApplicants || 0}
              icon={Users}
              color="green"
            />
            <MetricCard
              label="New Applicants"
              value={stats.newApplicants || 0}
              icon={FileText}
              color="orange"
            />
            <MetricCard
              label="Total Views"
              value={stats.totalViews || 0}
              icon={Eye}
              color="purple"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Jobs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Job Postings</h2>
                  <Link
                    to="/employer/jobs"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
                
                {recentJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-4">No job postings yet</p>
                    <Link
                      to="/employer/post-job"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Post a Job
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/employer/jobs/${job._id}/applicants`}
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                            >
                              {job.title}
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Users size={16} className="mr-1" />
                                {job.applicantCount || 0} applicants
                              </span>
                              <span className="flex items-center">
                                <Eye size={16} className="mr-1" />
                                {job.viewCount || 0} views
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                job.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/employer/edit-job/${job._id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Application Status Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Applicant Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.pendingApplicants || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Reviewing</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.reviewingApplicants || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Shortlisted</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.shortlistedApplicants || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Hired</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.hiredApplicants || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/employer/post-job"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Post New Job
                  </Link>
                  <Link
                    to="/employer/jobs"
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center px-4 py-2 rounded-lg font-medium border border-gray-300 transition-colors"
                  >
                    Manage Jobs
                  </Link>
                  <Link
                    to="/employer/profile"
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center px-4 py-2 rounded-lg font-medium border border-gray-300 transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Recommendations */}
          {recentJobs.length > 0 && (
            <div className="mt-8">
              <CandidateRecommendations jobId={recentJobs[0]._id} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmployerDashboard;
