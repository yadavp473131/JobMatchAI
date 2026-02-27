import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MetricCard from '../../components/common/MetricCard';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and statistics</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              color="blue"
            />
            <MetricCard
              label="Active Jobs"
              value={stats?.activeJobs || 0}
              icon={Briefcase}
              color="green"
            />
            <MetricCard
              label="Total Applications"
              value={stats?.totalApplications || 0}
              icon={FileText}
              color="purple"
            />
            <MetricCard
              label="Success Rate"
              value={`${stats?.successRate || 0}%`}
              icon={TrendingUp}
              color="orange"
            />
          </div>

          {/* Stats Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* User Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job Seekers</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats?.usersByRole?.jobseeker || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employers</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats?.usersByRole?.employer || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Admins</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {stats?.usersByRole?.admin || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-gray-600">New Users (This Month)</span>
                  <span className="text-lg font-semibold text-green-600">
                    +{stats?.newUsersThisMonth || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="text-lg font-semibold text-green-600">
                    {stats?.jobsByStatus?.active || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Closed Jobs</span>
                  <span className="text-lg font-semibold text-gray-600">
                    {stats?.jobsByStatus?.closed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Draft Jobs</span>
                  <span className="text-lg font-semibold text-yellow-600">
                    {stats?.jobsByStatus?.draft || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-gray-600">New Jobs (This Month)</span>
                  <span className="text-lg font-semibold text-green-600">
                    +{stats?.newJobsThisMonth || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Statistics</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats?.applicationsByStatus?.pending || 0}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.applicationsByStatus?.reviewing || 0}
                </div>
                <div className="text-sm text-gray-600">Reviewing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.applicationsByStatus?.shortlisted || 0}
                </div>
                <div className="text-sm text-gray-600">Shortlisted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats?.applicationsByStatus?.hired || 0}
                </div>
                <div className="text-sm text-gray-600">Hired</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
