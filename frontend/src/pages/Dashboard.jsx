import { useAuth } from '../context/AuthContext';
import JobSeekerDashboard from './JobSeekerDashboard';
import EmployerDashboard from './EmployerDashboard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your dashboard</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  if (user.role === 'jobseeker') {
    return <JobSeekerDashboard />;
  }

  if (user.role === 'employer') {
    return <EmployerDashboard />;
  }

  // Default fallback for admin or other roles
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Dashboard not available for your role</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
