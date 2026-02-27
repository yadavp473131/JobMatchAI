import { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const jobSeekerLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Applications', path: '/applications' },
    { name: 'Saved Jobs', path: '/saved-jobs' },
    { name: 'Profile', path: '/profile' },
  ];

  const employerLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Post Job', path: '/employer/post-job' },
    { name: 'My Jobs', path: '/employer/jobs' },
    { name: 'Profile', path: '/employer/profile' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Jobs', path: '/admin/jobs' },
  ];

  const getLinks = () => {
    if (!user) return [];
    if (user.role === 'jobseeker') return jobSeekerLinks;
    if (user.role === 'employer') return employerLinks;
    if (user.role === 'admin') return adminLinks;
    return [];
  };

  const links = getLinks();

  return (
    <nav className="bg-primary-900 shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-primary-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-xl font-bold text-white">JobMatchAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {user ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Notification Bell */}
                <div className="ml-2">
                  <NotificationBell />
                </div>

                {/* User Menu */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg focus:outline-none transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-10 border border-neutral-100">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{user.email}</p>
                        <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
                      </div>
                      <Link
                        to="/notifications"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Notifications
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="border-t border-neutral-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            onLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-success-500 text-white hover:bg-success-600 px-5 py-2 rounded-lg text-sm font-semibold ml-2 transition-all shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg focus:outline-none transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary-900/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <div className="px-3 py-3 mb-2 bg-white/10 rounded-lg">
                  <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  <p className="text-xs text-white/70 capitalize">{user.role}</p>
                </div>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-base font-medium transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-300 hover:text-red-200 hover:bg-white/10 px-3 py-2 rounded-lg text-base font-medium transition-all mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="block text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-base font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/login"
                  className="block text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-base font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-success-500 text-white hover:bg-success-600 px-3 py-2 rounded-lg text-base font-semibold mt-2 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
