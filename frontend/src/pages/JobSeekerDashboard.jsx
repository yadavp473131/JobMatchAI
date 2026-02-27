import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Bookmark, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MetricCard from '../components/common/MetricCard';
import ApplicationCard from '../components/jobseeker/ApplicationCard';
import JobRecommendations from '../components/jobseeker/JobRecommendations';
import api from '../services/api';

const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard data
      const dashboardRes = await api.get('/dashboard/jobseeker');
      setDashboardData(dashboardRes.data.data);
      
      // Try to fetch applications, but don't fail if it doesn't work
      try {
        const applicationsRes = await api.get('/applications/my-applications?limit=5');
        setRecentApplications(applicationsRes.data.data?.applications || []);
      } catch (appError) {
        console.log('No applications found or error fetching applications');
        setRecentApplications([]);
      }
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
              Welcome back, {profile.firstName || 'Job Seeker'}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your job search
            </p>
          </div>

          {/* Profile Completeness Alert */}
          {profile.profileCompleteness < 100 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Your profile is {profile.profileCompleteness}% complete
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Complete your profile to get better job recommendations
                  </p>
                </div>
                <Link
                  to="/profile"
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
              label="Total Applications"
              value={stats.totalApplications || 0}
              icon={FileText}
              color="blue"
            />
            <MetricCard
              label="Pending"
              value={stats.pendingApplications || 0}
              icon={Clock}
              color="orange"
            />
            <MetricCard
              label="Shortlisted"
              value={stats.shortlistedApplications || 0}
              icon={CheckCircle}
              color="green"
            />
            <MetricCard
              label="Saved Jobs"
              value={stats.savedJobs || 0}
              icon={Bookmark}
              color="purple"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                  <Link
                    to="/applications"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
                
                {recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-4">No applications yet</p>
                    <Link
                      to="/jobs"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <ApplicationCard key={application._id} application={application} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              {/* Application Status Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.pendingApplications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Reviewing</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.reviewingApplications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Shortlisted</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.shortlistedApplications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.rejectedApplications || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/jobs"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/profile"
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center px-4 py-2 rounded-lg font-medium border border-gray-300 transition-colors"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/saved-jobs"
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center px-4 py-2 rounded-lg font-medium border border-gray-300 transition-colors"
                  >
                    Saved Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="mt-8">
            <JobRecommendations />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobSeekerDashboard;
